import React from 'react';
import { Message } from '@context/chat-context';
import { styles } from './styles';

interface MessageItemProps {
  message: Message;
  isPreview?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isPreview = false }) => {
  const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isAI = message.type === 'ai';

  const previewStyles = isPreview ? {
    messageWrapper: {
      ...styles.messageWrapper,
      marginBottom: '8px',
      backgroundColor: isAI ? '#f8fafc' : '#f3f4f6',
      borderRadius: '8px',
    },
    avatar: {
      ...styles.avatar,
      width: '24px',
      height: '24px',
    },
    avatarText: {
      ...styles.avatarText,
      fontSize: '10px',
    },
    messageBubble: {
      ...styles.messageBubble,
      padding: '8px 12px',
      fontSize: '12px',
    },
    messageContent: {
      ...styles.messageContent,
      fontSize: '12px',
    },
    messageTime: {
      ...styles.messageTime,
      fontSize: '10px',
      marginTop: '4px',
    },
  } : {};

  return (
    <div style={previewStyles.messageWrapper || styles.messageWrapper}>
      {isAI && (
        <div style={previewStyles.avatar || styles.avatar}>
          <span style={previewStyles.avatarText || styles.avatarText}>AI</span>
        </div>
      )}
      <div style={previewStyles.messageBubble || styles.messageBubble}>
        <div style={previewStyles.messageContent || styles.messageContent}>
          {message.content}
        </div>
        <div style={previewStyles.messageTime || styles.messageTime}>
          {timeString}
        </div>
      </div>
      {!isAI && (
        <div style={{...previewStyles.avatar || styles.avatar, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'}}>
          <span style={previewStyles.avatarText || styles.avatarText}>You</span>
        </div>
      )}
    </div>
  );
};