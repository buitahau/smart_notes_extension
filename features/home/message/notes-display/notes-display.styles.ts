import type { CSSProperties } from 'react';

type NoteDisplayStyles = Record<string, CSSProperties>;

export const styles: NoteDisplayStyles = {
  notesContainer: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  notesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(229, 231, 235, 0.4)',
  },
  notesTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    letterSpacing: '0.01em',
  },
  notesCount: {
    fontSize: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '600',
    letterSpacing: '0.02em',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  },
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
};
