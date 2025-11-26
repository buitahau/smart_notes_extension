import React from 'react';
import { useChat } from '@context/chat-context';
import { MessageItem } from './MessageItem';
import { styles } from './styles';

export const ChatPreview: React.FC = () => {
  const { messages } = useChat();

  if (messages.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Recent Chat</h3>
      </div>
      <div style={styles.messagesContainer}>
        {messages.slice(-3).map((message) => (
          <MessageItem key={message.id} message={message} isPreview={true} />
        ))}
      </div>
    </div>
  );
};
