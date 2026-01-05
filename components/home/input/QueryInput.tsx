import React, { useState, useEffect, useRef } from 'react';
import { Send as SendIcon } from 'lucide-react';

interface QueryInputProps {
    inputText: string;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    styles: { [key: string]: React.CSSProperties };
    hints: string[];
}

export const QueryInput: React.FC<QueryInputProps> = ({
    inputText,
    onInputChange,
    onSendMessage,
    onKeyDown,
    styles,
    hints,
}) => {
    const [suggestion, setSuggestion] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!inputText) {
            setSuggestion('');
            return;
        }

        const matches = hints.filter((hint) =>
            hint.toLowerCase().startsWith(inputText.toLowerCase())
        );

        if (matches.length > 0) {
            // Find longest common prefix of all matches
            const commonPrefix = matches.reduce((prefix, current) => {
                let i = 0;
                while (i < prefix.length && i < current.length && prefix[i].toLowerCase() === current[i].toLowerCase()) {
                    i++;
                }
                return prefix.slice(0, i);
            }, matches[0]);

            // If common prefix is longer than input, suggest the difference
            if (commonPrefix.length > inputText.length) {
                // Use the case from the common prefix (taking from the first match usually preserves case if consistent)
                // But we computed commonPrefix from matches[0] and reduced, so it should be correct.
                // However, we want to respect the user's input case for the start.
                // Actually, commonPrefix might have mixed case if hints have different casing, 
                // but assuming hints are consistent or we just use the first match's casing for the shared part.
                // Let's rely on the computed commonPrefix.
                setSuggestion(commonPrefix.slice(inputText.length));
            } else {
                setSuggestion('');
            }
        } else {
            setSuggestion('');
        }
    }, [inputText, hints]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab' && suggestion) {
            e.preventDefault();
            onInputChange(inputText + suggestion);
        } else {
            onKeyDown(e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onInputChange(e.target.value);
    };

    return (
        <div style={styles.inputContainer}>
            <div
                style={{
                    ...styles.inputWrapper,
                    ...(document.activeElement === textareaRef.current ? styles.inputWrapperFocus : {}),
                }}
            >
                <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                    {/* Overlay for match suggestion */}
                    <div
                        style={{
                            ...styles.textArea,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                            color: 'transparent',
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                        }}
                        aria-hidden="true"
                    >
                        {inputText}
                        <span style={{ color: '#9ca3af', opacity: 0.5 }}>{suggestion}</span>
                    </div>

                    <textarea
                        ref={textareaRef}
                        style={{
                            ...styles.textArea,
                            position: 'relative',
                            background: 'transparent',
                            zIndex: 1,
                        }}
                        value={inputText}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message here..."
                        rows={1}
                        onFocus={(e) => {
                            // We need to traverse up to the inputWrapper to apply focus styles
                            // Since we added a wrapper div, we go up 2 levels
                            const wrapper = e.currentTarget.closest('[style*="position: relative"][style*="display: flex"][style*="gap: 12px"]');
                            if (wrapper && wrapper instanceof HTMLElement) {
                                wrapper.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                                wrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                                wrapper.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.15)';
                            }
                        }}
                        onBlur={(e) => {
                            const wrapper = e.currentTarget.closest('[style*="position: relative"][style*="display: flex"][style*="gap: 12px"]');
                            if (wrapper && wrapper instanceof HTMLElement) {
                                // Reset inline styles to let CSS/original styles take over or clear them
                                // Re-applying original style is tricky without classNames.
                                // We will just clear the focus specific overrides.
                                wrapper.style.borderColor = '';
                                wrapper.style.backgroundColor = '';
                                wrapper.style.boxShadow = '';
                            }
                        }}
                    />
                </div>

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
