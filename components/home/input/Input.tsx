import React from 'react';
import { Send as SendIcon } from 'lucide-react';

interface InputProps {
  inputText: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  styles: { [key: string]: React.CSSProperties };
}

export const Input: React.FC<InputProps> = ({
  inputText,
  onInputChange,
  onSendMessage,
  onKeyDown,
  styles,
}) => {
  return (
    <div style={styles.inputContainer}>
      <div
        style={{
          ...styles.inputWrapper,
          ...(document.activeElement?.tagName === 'TEXTAREA' ? styles.inputWrapperFocus : {}),
        }}
      >
        <textarea
          style={styles.textArea}
          value={inputText}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder="Type your message here..."
          rows={1}
          onFocus={(e) => {
            e.currentTarget.parentElement!.style.cssText = `
              ${Object.entries(styles.inputWrapper)
                .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
                .join('; ')}
              ${Object.entries(styles.inputWrapperFocus)
                .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
                .join('; ')}
            `;
          }}
          onBlur={(e) => {
            e.currentTarget.parentElement!.style.cssText = `
              ${Object.entries(styles.inputWrapper)
                .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
                .join('; ')}
            `;
          }}
        />
        <button
          style={{
            ...styles.sendButton,
            ...(inputText.trim() ? styles.sendButtonActive : {}),
          }}
          onClick={onSendMessage}
          disabled={!inputText.trim()}
        >
          <SendIcon size={22} />
        </button>
      </div>
    </div>
  );
};
