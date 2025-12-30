import type { CSSProperties } from 'react';

type ThinkingStyles = Record<string, CSSProperties>;

export const styles: ThinkingStyles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 0',
        color: '#6b7280', // Gray-500
        fontSize: '14px',
        fontWeight: 500,
    },
    text: {
        fontFamily: 'Inter, system-ui, sans-serif',
        letterSpacing: '0.01em',
    },
    dots: {
        display: 'inline-flex',
        marginLeft: '2px', // Slight spacing from text
    },
};
