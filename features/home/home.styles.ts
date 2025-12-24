import type { CSSProperties } from 'react';

type HomeStyles = Record<string, CSSProperties>;

export const styles: HomeStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    borderBottom: '1px solid #f3f4f6',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  discussionContainer: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    position: 'relative',
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
    `,
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 16px',
    background: 'transparent',
    position: 'relative',
  },
  messagesWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
  },
  inputContainer: {
    padding: '16px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTop: '1px solid rgba(229, 231, 235, 0.6)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '20px',
    padding: '12px 16px',
    border: '2px solid rgba(229, 231, 235, 0.5)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
  inputWrapperFocus: {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
  },
  textArea: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    resize: 'none',
    outline: 'none',
    padding: '8px 0',
    fontFamily: 'inherit',
    fontSize: '14px',
    lineHeight: '1.4',
    maxHeight: '100px',
    color: '#1f2937',
    fontWeight: '400',
    letterSpacing: '0.01em',
  },
  sendButton: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid transparent',
    backgroundColor: 'rgba(229, 231, 235, 0.8)',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  sendButtonActive: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
    transform: 'scale(1.05)',
  },
  userSectionWrapper: {
    position: 'relative',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
  },
  userSectionHover: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  userIcon: {
    color: '#6366f1',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1f2937',
  },
  chevronIcon: {
    color: '#9ca3af',
    transition: 'transform 0.2s ease',
  },
  userMenu: {
    position: 'absolute',
    top: '100%',
    marginTop: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f0f0f0',
    minWidth: '160px',
    overflow: 'hidden',
    zIndex: 50,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
  },
  menuItemHover: {
    backgroundColor: '#f8fafc',
    color: '#6366f1',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  createButtonHover: {
    backgroundColor: '#4f46e5',
    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
    transform: 'translateY(-1px)',
  },
};

export const textContentStyles = `
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
