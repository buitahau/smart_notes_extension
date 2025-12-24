import React, { useEffect, useState } from 'react';
import { formatDateDisplay } from '@utils/date-utils';
import { getHeaderTitle, getEmptyState } from '@utils';
import { styles } from '../notes-display.styles';
import { groupNotesByDate } from '../utils';
import type { IntentDisplayProps } from '../types';
import type { Note } from '@services/note-service';

export const DateLookupDisplay: React.FC<IntentDisplayProps> = ({
  notes,
  intent,
  messageContent,
}) => {
  const [localNotes, setLocalNotes] = useState<Note[]>(notes || []);

  useEffect(() => {
    setLocalNotes(notes || []);
  }, [notes]);

  const title = getHeaderTitle({ intent, messageContent });
  const groupedNotes = groupNotesByDate(localNotes);

  if (!localNotes.length) {
    const emptyState = getEmptyState({ intent, messageContent });
    return (
      <div style={styles.notesContainer}>
        {title && (
          <div style={styles.notesHeader}>
            <div style={styles.notesTitle}>{title}</div>
            <div style={styles.notesCount}>0</div>
          </div>
        )}
        <div
          style={{
            ...styles.noteCard,
            textAlign: 'center',
            color: '#64748b',
            fontSize: '13px',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{emptyState.icon}</div>
          <div>{emptyState.text}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.notesContainer}>
      {title && (
        <div style={styles.notesHeader}>
          <div style={styles.notesTitle}>{title}</div>
          <div style={styles.notesCount}>{localNotes.length}</div>
        </div>
      )}

      {Object.entries(groupedNotes).map(([dateString, dateNotes]) => (
        <div key={dateString} style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#4f46e5',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px',
            }}
          >
            {formatDateDisplay(dateString)}
          </div>
          {dateNotes.map((note) => (
            <div
              key={note.id}
              style={{
                ...styles.noteCard,
                borderLeft: '4px solid #6366f1',
                paddingLeft: '16px',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '6px' }}>
                {note.content}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Logged on {formatDateDisplay(note.createdAt)} at{' '}
                {new Date(note.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
