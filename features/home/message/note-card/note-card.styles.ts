import type { CSSProperties } from 'react';

type NoteCardStyles = Record<string, CSSProperties>;

export const styles: NoteCardStyles = {
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(229, 231, 235, 0.6)',
    borderRadius: '12px',
    padding: '14px 18px',
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  noteCardHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
  noteContent: {
    fontSize: '13px',
    lineHeight: '1.4',
    color: '#374151',
    fontWeight: '400',
    letterSpacing: '0.01em',
  },
};
