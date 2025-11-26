import React, { useState, useRef, useEffect } from 'react';
import { storage } from '@utils/storage';
import { logout } from '@services/auth-service';
import { useMiniRouter } from '@context/router-context';
import { useChat } from '@context/chat-context';
import { STORAGE_KEYS } from '@utils/constants';
import { UserDetails } from '@types/login';
import { queryService } from '@services/query-service';
import { Message } from '@context/chat-context';
import { Header } from './Header';
import { Message as MessageComponent } from './Message';
import { Input } from './Input';
import { styles } from './styles';

export const Home: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { navigate } = useMiniRouter();
  const { messages, setMessages } = useChat();

  // Load messages from storage on initial render
  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await storage.get<Message[]>(STORAGE_KEYS.CHAT_MESSAGES);
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
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
  }, [setMessages]);

  // Save messages to storage when they change
  useEffect(() => {
    if (messages.length > 0) {
      const lastFiveMessages = messages.slice(-5);
      storage.set(STORAGE_KEYS.CHAT_MESSAGES, lastFiveMessages);
    }
  }, [messages]);

  const handleCreateNote = () => {
    navigate('create-note');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userInput = inputText.trim();

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
      content: 'Thinking',
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userMessage, loadingMessage];
    setMessages(updatedMessages);

    setInputText('');

    // Call query service
    try {
      const response = await queryService.sendQuery(userInput.toLowerCase());
      const notesData = response.notes;

      // Remove loading message and add AI response
      const filteredMessages = updatedMessages.filter(
        (msg: Message) => msg.id !== loadingMessageId
      );
      let aiResponse: Message;

      // Ensure notesData.data is always an array
      const notesArray = Array.isArray(notesData.data) ? notesData.data : [];

      if (
        (notesData.intent === 'task_list' || notesData.intent === 'date_lookup') &&
        notesArray.length > 0
      ) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: 'Here are your tasks:',
          timestamp: new Date().toISOString(),
          notes: notesArray,
          intent: notesData.intent,
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: notesArray.length > 0 ? 'Here are your notes:' : 'No notes found.',
          timestamp: new Date().toISOString(),
          notes: notesArray,
          intent: notesData.intent,
        };
      }
      setMessages([...filteredMessages, aiResponse]);
    } catch (error) {
      // Remove loading message and add error response
      const filteredMessages = updatedMessages.filter(
        (msg: Message) => msg.id !== loadingMessageId
      );
      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages([...filteredMessages, errorResponse]);
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
