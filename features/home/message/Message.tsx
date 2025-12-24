import React from 'react';
import {
  User as UserIcon,
  Bot as BotIcon,
  AlertTriangle,
} from 'lucide-react';
import { Note } from '@services/note-service';
import { useChat } from '@context/chat-context';
import { NotesDisplay } from './notes-display/NotesDisplay';
import { styles } from './message.styles';

interface MessageProps {
  message: {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
    notes?: Note[];
    intent?: string;
    queryStatus?: string;
  };
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { messages: chatMessages, setMessages } = useChat();
  const isAI = message.type === 'ai';
  const isLoading = message.queryStatus === 'in-progress' || message.id.startsWith('loading-');
  const isCancelled = message.queryStatus === 'cancelled' || message.id.startsWith('error-');
  const errorDescription = message.content ? message.content : 'The server returned a 500 error while processing your request. Please try again.';
  const handleNotesChange = (updatedNotes: Note[]) => {
    const nextMessages = chatMessages.map((msg) =>
      msg.id === message.id ? { ...msg, notes: updatedNotes } : msg
    );
    setMessages(nextMessages);
  };

  return (
    <div
      style={{
        ...styles.messageWrapper,
        ...(isAI ? styles.messageWrapperAI : styles.messageWrapperUser),
      }}
    >
      {isAI && (
        <div style={{ ...styles.avatar, ...styles.avatarAI }}>
          <BotIcon size={18} color="white" />
        </div>
      )}
      <div
        style={{
          ...styles.messageBubble,
          ...(isAI ? styles.aiBubble : styles.userBubble),
        }}
        className={isAI ? 'message-bubble-ai' : 'message-bubble-user'}
      >
        <div style={styles.messageContent}>
          {isAI ? (
            <div>
              {isCancelled ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#991b1b',
                    alignItems: 'flex-start',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#ef4444',
                    }}
                  >
                    <AlertTriangle size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                      Server error (500)
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#b91c1c' }}>
                      {errorDescription}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '12px', fontSize: '15px', color: '#374151' }}>
                    {message.content}
                  </div>
                  <NotesDisplay
                    notes={message.notes ? message.notes : []}
                    intent={message.intent}
                    messageContent={message.content}
                    onNotesChange={handleNotesChange}
                  />
                </>
              )}
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Thinking</span>
              <span className="loading-dots"></span>
            </div>
          ) : (
            message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))
          )}
        </div>
        <div
          style={{
            ...styles.messageTime,
            ...(isAI ? styles.messageTimeAI : styles.messageTimeUser),
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      {!isAI && (
        <div style={{ ...styles.avatar, ...styles.avatarUser }}>
          <UserIcon size={18} color="white" />
        </div>
      )}
    </div>
  );
};
