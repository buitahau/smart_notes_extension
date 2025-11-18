import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  overlay?: boolean;
}

export function LoadingSpinner({
  message,
  size = 'medium',
  fullScreen = false,
  overlay = false
}: LoadingSpinnerProps) {
  const containerClass = `
    loading-spinner-container
    ${fullScreen ? 'fullscreen' : ''}
    ${overlay ? 'overlay' : ''}
  `.trim();

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${size}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}