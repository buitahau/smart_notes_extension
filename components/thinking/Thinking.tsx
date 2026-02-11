import { styles } from './thinking.styles';

export function Thinking() {
    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes blink {
                        0% { opacity: 0.2; }
                        20% { opacity: 1; }
                        100% { opacity: 0.2; }
                    }
                `}
            </style>
            <span style={styles.text}>
                Thinking
                <span style={styles.dots}>
                    <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0.2s' }}>.</span>
                    <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0.4s' }}>.</span>
                    <span style={{ animation: 'blink 1.4s infinite both', animationDelay: '0.6s' }}>.</span>
                </span>
            </span>
        </div>
    );
}