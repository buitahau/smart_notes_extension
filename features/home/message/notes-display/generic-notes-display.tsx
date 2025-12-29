import React from 'react';
import { getHeaderTitle } from '@utils';
import { formatDateDisplay } from '@utils/date-utils';
import { styles } from './notes-display.styles';
import type { IntentDisplayProps } from './types';

export const GenericNotesDisplay: React.FC<IntentDisplayProps> = ({
  notes,
  intent,
  messageContent,
}) => {
  const title = getHeaderTitle({ intent, messageContent });

  if (!notes || notes.length === 0) {
    return (
      <div className='generic-notes-display-without-notes'></div>
    );
  }

  return (
    <div className='generic-notes-display' style={styles.notesContainer}>
      {title && (
        <div style={styles.notesHeader}>
          <div style={styles.notesTitle}>{title}</div>
          <div style={styles.notesCount}>{notes.length}</div>
        </div>
      )}
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            ...styles.noteCard,
            marginBottom: '12px',
          }}
        >
          <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
            {note.content}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {formatDateDisplay(note.dateAt)}
          </div>
        </div>
      ))}
    </div>
  );
};
