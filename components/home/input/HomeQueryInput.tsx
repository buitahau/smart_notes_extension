import React from 'react';
import { QueryInput } from './QueryInput';

interface HomeQueryInputProps {
    inputText: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSendMessage: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    styles: { [key: string]: React.CSSProperties };
}

const HINTS = [
    'my task weekend',
    'my task today',
    'find notes from today',
    'create a new note',
    'summarize recent messages',
    'show my tasks',
];

export const HomeQueryInput: React.FC<HomeQueryInputProps> = ({
    inputText,
    onInputChange,
    onSendMessage,
    onKeyDown,
    styles,
}) => {
    // Adapter to convert string value back to event for parent compatibility
    // Or better, we just adapt the change handler here.
    const handleInputChange = (value: string) => {
        // We need to create a synthetic event or just call onInputChange with a mock object
        // since the parent expects ChangeEvent.
        // However, it's cleaner if we can change parent, but per instructions, we integrate this component.
        // Let's manually construct a minimal object that satisfies the usage in Home.tsx: e.target.value
        const mockEvent = {
            target: { value }
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onInputChange(mockEvent);
    };

    return (
        <QueryInput
            inputText={inputText}
            onInputChange={handleInputChange}
            onSendMessage={onSendMessage}
            onKeyDown={onKeyDown}
            styles={styles}
            hints={HINTS}
        />
    );
};
