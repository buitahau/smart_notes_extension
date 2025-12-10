import React, { useState, useRef, useEffect, useCallback } from 'react';
import { storage } from '@utils/storage';
import { logout } from '@services/auth-service';
import { useMiniRouter } from '@context/router-context';
import { useChat } from '@context/chat-context';
import { STORAGE_KEYS } from '@utils/constants';
import { UserDetails } from '@types/login';
import { asyncQueryService } from '@services/async-query-service';
import type { QueryResponse } from '@services/query-service';
import { Message } from '@context/chat-context';
import { Header } from './Header';
import { Message as MessageComponent } from './Message';
import { Input } from './Input';
import { styles } from './styles';

const MAX_POLL_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 2000;
const THINKING_MESSAGE = 'Thinking';
const CANCELLED_ERROR_MESSAGE = 'Sorry, your request was cancelled. Please try again.';
const GENERIC_ERROR_MESSAGE =
  'Sorry, I encountered an error while processing your request. Please try again.';

interface PollOptions {
  showErrorOnCancel?: boolean;
}

export const Home: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { navigate } = useMiniRouter();
  const { messages, setMessages } = useChat();
  const isMountedRef = useRef(true);
  const pollingQueriesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      pollingQueriesRef.current.clear();
    };
  }, []);

  const handleQuerySuccess = useCallback(
    (queryId: string, response: QueryResponse | null) => {
      if (!isMountedRef.current) {
        return;
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.queryId !== queryId) {
            return msg;
          }

          const notesData = response?.notes;
          const notesArray = Array.isArray(notesData?.data) ? notesData.data : [];

          let content = 'No notes found.';
          if (
            (notesData?.intent === 'task_list' || notesData?.intent === 'date_lookup') &&
            notesArray.length > 0
          ) {
            content = 'Here are your tasks:';
          } else if (notesArray.length > 0) {
            content = 'Here are your notes:';
          }

          return {
            ...msg,
            queryStatus: 'completed',
            content,
            notes: notesArray,
            intent: notesData?.intent,
            timestamp: new Date().toISOString(),
          };
        })
      );
    },
    [setMessages]
  );

  const handleCancelled = useCallback(
    (queryId: string, showError = false) => {
      if (!isMountedRef.current) {
        return;
      }

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.queryId !== queryId);
        if (!showError) {
          return filtered;
        }

        const now = Date.now();
        const timestamp = new Date(now).toISOString();

        return [
          ...filtered,
          {
            id: `error-${now}`,
            type: 'ai',
            content: CANCELLED_ERROR_MESSAGE,
            timestamp,
          },
        ];
      });
    },
    [setMessages]
  );

  const pollAsyncQuery = useCallback(
    (queryId: string, attempt = 0, options?: PollOptions) => {
      if (!queryId || !isMountedRef.current) {
        return;
      }

      const shouldShowError = options?.showErrorOnCancel ?? false;

      if (attempt === 0) {
        if (pollingQueriesRef.current.has(queryId)) {
          return;
        }
        pollingQueriesRef.current.add(queryId);
      }

      const checkStatus = async () => {
        if (!isMountedRef.current) {
          pollingQueriesRef.current.delete(queryId);
          return;
        }

        if (attempt >= MAX_POLL_ATTEMPTS) {
          pollingQueriesRef.current.delete(queryId);
          handleCancelled(queryId, shouldShowError);
          return;
        }

        try {
          const result = await asyncQueryService.get(queryId);

          if (!isMountedRef.current) {
            pollingQueriesRef.current.delete(queryId);
            return;
          }

          if (!result) {
            pollingQueriesRef.current.delete(queryId);
            handleCancelled(queryId, shouldShowError);
            return;
          }

          if (result.status === 'completed') {
            handleQuerySuccess(queryId, result.response);
            pollingQueriesRef.current.delete(queryId);
            return;
          }

          if (result.status === 'cancelled') {
            handleCancelled(queryId, shouldShowError);
            pollingQueriesRef.current.delete(queryId);
            return;
          }

          window.setTimeout(() => {
            pollAsyncQuery(queryId, attempt + 1, options);
          }, POLL_INTERVAL_MS);
        } catch (error) {
          console.error('Failed to poll async query', error);
          pollingQueriesRef.current.delete(queryId);
          handleCancelled(queryId, shouldShowError);
        }
      };

      void checkStatus();
    },
    [handleCancelled, handleQuerySuccess]
  );

  const handleExistingAsyncMessage = useCallback(
    async (message: Message) => {
      if (!message.queryId) {
        return;
      }

      if (message.queryStatus === 'completed') {
        return;
      }

      if (message.queryStatus === 'cancelled') {
        handleCancelled(message.queryId);
        return;
      }

      try {
        const result = await asyncQueryService.get(message.queryId);

        if (!isMountedRef.current) {
          return;
        }

        if (!result) {
          handleCancelled(message.queryId);
          return;
        }

        if (result.status === 'completed') {
          handleQuerySuccess(message.queryId, result.response);
          return;
        }

        if (result.status === 'cancelled') {
          handleCancelled(message.queryId);
          return;
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id
              ? {
                  ...msg,
                  queryStatus: result.status,
                  content: THINKING_MESSAGE,
                }
              : msg
          )
        );

        pollAsyncQuery(message.queryId, 0, { showErrorOnCancel: false });
      } catch (error) {
        console.error('Failed to resume async query', error);
        handleCancelled(message.queryId);
      }
    },
    [handleCancelled, handleQuerySuccess, pollAsyncQuery, setMessages]
  );

  // Load messages from storage on initial render
  useEffect(() => {
    let isActive = true;

    const loadMessages = async () => {
      const savedMessages = await storage.get<Message[]>(STORAGE_KEYS.CHAT_MESSAGES);

      if (!isActive || !isMountedRef.current) {
        return;
      }

      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);

        savedMessages.forEach((message) => {
          if (message.queryId && message.queryStatus !== 'completed') {
            void handleExistingAsyncMessage(message);
          }
        });
      } else {
        // Initialize welcome message if no messages exist
        setMessages([
          {
            id: '1',
            type: 'ai',
            content:
              "Hello! 👋 I'm your AI assistant. I can help you with:\n\n• Finding your notes for today\n• Creating new notes\n• Organizing your thoughts\n\nWhat would you like to do?",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    loadMessages();

    return () => {
      isActive = false;
    };
  }, [handleExistingAsyncMessage, setMessages]);

  // Save messages to storage when they change
  useEffect(() => {
    const messagesToPersist = messages.length > 0 ? messages.slice(-5) : [];
    storage.set(STORAGE_KEYS.CHAT_MESSAGES, messagesToPersist);
  }, [messages]);

  const handleCreateNote = () => {
    navigate('create-note');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userInput = inputText.trim();
    const normalizedQuery = userInput.toLowerCase();

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
    };

    // Show loading indicator
    const loadingMessageId = `loading-${Date.now()}`;
    const loadingMessage: Message = {
      id: loadingMessageId,
      type: 'ai',
      content: THINKING_MESSAGE,
      timestamp: new Date().toISOString(),
      queryStatus: 'pending',
    };
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    setInputText('');

    try {
      const asyncQueryId = await asyncQueryService.create(normalizedQuery);

      if (!isMountedRef.current) {
        return;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, queryId: asyncQueryId, queryStatus: 'in-progress' }
            : msg
        )
      );

      pollAsyncQuery(asyncQueryId, 0, { showErrorOnCancel: true });
    } catch (error) {
      console.error('Failed to create async query', error);
      if (!isMountedRef.current) {
        return;
      }

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessageId);
        const now = Date.now();
        const timestamp = new Date(now).toISOString();
        const errorResponse: Message = {
          id: `error-${now}`,
          type: 'ai',
          content: GENERIC_ERROR_MESSAGE,
          timestamp,
        };
        return [...filtered, errorResponse];
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleProfile = () => {
    navigate('profile');
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate('settings');
    setShowUserMenu(false);
  };

  const handleLogout = async () => {
    await storage.clear();
    await logout();
    navigate('login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const loadProfile = async () => {
      const userDetail = (await storage.get(STORAGE_KEYS.USER)) as UserDetails | null;
      if (userDetail) {
        const composedName = [userDetail.firstName, userDetail.lastName]
          .filter((value) => Boolean(value && value.trim()))
          .join(' ')
          .trim();
        setUserName(composedName || userDetail.email || '');
      } else {
        setUserName('');
      }
    };
    loadProfile();

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    const messagesArea = document.getElementById('messages-area');
    if (messagesArea) {
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add CSS animations to the document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
        }
      }

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .message-bubble-ai {
        animation: slideIn 0.4s ease-out;
      }

      .message-bubble-user {
        animation: slideInRight 0.4s ease-out;
      }

      .avatar-glow {
        animation: pulse 2s infinite;
      }

      .loading-dots {
        display: inline-block;
      }

      .loading-dots::after {
        content: '';
        animation: loading-dots 1.5s infinite;
      }

      @keyframes loading-dots {
        0% { content: ''; }
        25% { content: '.'; }
        50% { content: '..'; }
        75% { content: '...'; }
        100% { content: ''; }
      }

      textarea::placeholder {
        color: '#9ca3af';
        opacity: 0.7;
      }

      textarea:focus {
        outline: none;
      }

      /* Custom scrollbar */
      #messages-area::-webkit-scrollbar {
        width: 6px;
      }

      #messages-area::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
      }

      #messages-area::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.3);
        border-radius: 3px;
      }

      #messages-area::-webkit-scrollbar-thumb:hover {
        background: rgba(99, 102, 241, 0.5);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Part 1: Header with user name and Create Note button */}
      <Header
        userName={userName}
        showUserMenu={showUserMenu}
        onToggleUserMenu={toggleUserMenu}
        onProfile={handleProfile}
        onSettings={handleSettings}
        onLogout={handleLogout}
        onCreateNote={handleCreateNote}
        userMenuRef={userMenuRef}
        styles={styles}
      />

      {/* Part 2: Discussion view between user and AI */}
      <div style={styles.discussionContainer}>
        <div style={styles.messagesArea} id="messages-area">
          <div style={styles.messagesWrapper}>
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} styles={styles} />
            ))}
          </div>
        </div>
      </div>

      {/* Part 3: Text input area */}
      <Input
        inputText={inputText}
        onInputChange={(e) => setInputText(e.target.value)}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        styles={styles}
      />
    </div>
  );
};
