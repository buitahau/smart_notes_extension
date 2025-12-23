import React, { useEffect, useState } from 'react';
import { getHeaderTitle } from '@utils';
import { formatDateDisplay } from '@utils/date-utils';
import { Note } from '@services/note-service';
import { NoteCard } from '@components/home/message/note-card/NoteCard';
import { notesDisplayStyles } from '../styles';
import { groupNotesByDate } from '../utils';

interface DateLookupDisplayProps {
  notes: Note[] | undefined;
  intent?: string;
  messageContent?: string;
  onNotesChange?: (notes: Note[]) => void;
}

export const DateLookupDisplay: React.FC<DateLookupDisplayProps> = ({
  notes,
  intent,
  messageContent,
  onNotesChange,
}) => {
  const styles = notesDisplayStyles;
  const [localNotes, setLocalNotes] = useState<Note[]>(notes || []);

  useEffect(() => {
    setLocalNotes(notes || []);
  }, [notes]);

  if (!localNotes || localNotes.length === 0) {
    const title = intent ? getHeaderTitle({ intent, messageContent }) : 'No matching notes';
    return (
      <div style={styles.notesContainer}>
        {title && (
          <div style={styles.notesHeader}>
            <div style={styles.notesTitle}>{title}</div>
            <div style={styles.notesCount}>0</div>
          </div>
        )}
        <div style={{ fontSize: '13px', color: '#6b7280' }}>No notes for the requested date.</div>
      </div>
    );
  }

  const groupedNotes = groupNotesByDate(localNotes);

  return (
    <div style={styles.notesContainer}>
      <div style={styles.notesHeader}>
        <div style={styles.notesTitle}>
          {intent ? getHeaderTitle({ intent, messageContent }) : 'Notes by Date'}
        </div>
        <div style={styles.notesCount}>{localNotes.length}</div>
      </div>

      {Object.entries(groupedNotes).map(([dateString, dateNotes]) => (
        <div key={dateString} style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '8px 12px',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.15)',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {formatDateDisplay(dateString)}
            </div>
            <div
              style={{
                marginLeft: 'auto',
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              {dateNotes.length} note{dateNotes.length === 1 ? '' : 's'}
            </div>
          </div>

          {dateNotes.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              note={note}
              index={index}
              onNoteUpdate={(updatedNote) => {
                const nextNotes = localNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
                setLocalNotes(nextNotes);
                onNotesChange?.(nextNotes);
              }}
              onNoteDelete={(noteId) => {
                const filtered = localNotes.filter((n) => n.id !== noteId);
                setLocalNotes(filtered);
                onNotesChange?.(filtered);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
