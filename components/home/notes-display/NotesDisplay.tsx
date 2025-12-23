import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getHeaderTitle } from '@utils';
import { formatDateDisplay } from '@utils/date-utils';
import { Note, noteService } from '@services/note-service';
import { AddNewNote } from '@components/home/add-note/AddNewNote';
import { NoteCard } from '@components/home/message/note-card/NoteCard';
import { noteCardStyles } from '@components/home/message/note-card/styles';
import { notesDisplayStyles } from './styles';

interface NotesDisplayProps {
  notes: Note[] | undefined;
  intent?: string;
  messageContent?: string;
  onNotesChange?: (notes: Note[]) => void;
}

const groupNotesByDate = (notes: Note[]): { [date: string]: Note[] } => {
  const grouped: { [date: string]: Note[] } = {};

  notes.forEach((note) => {
    const dateKey = new Date(note.dateAt).toDateString();

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(note);
  });

  const sortedKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const sortedGrouped: { [date: string]: Note[] } = {};
  sortedKeys.forEach((key) => {
    sortedGrouped[key] = grouped[key].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return sortedGrouped;
};

export const NotesDisplay: React.FC<NotesDisplayProps> = ({
  notes,
  intent,
  messageContent,
  onNotesChange,
}) => {
  const styles = notesDisplayStyles;
  const [localNotes, setLocalNotes] = useState<Note[]>(notes || []);
  const [addForms, setAddForms] = useState<{ [date: string]: string[] }>({});

  useEffect(() => {
    setLocalNotes(notes || []);
  }, [notes]);

  const handleNoteUpdate = (updatedNote: Note) => {
    setLocalNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note.id === updatedNote.id ? { ...note, ...updatedNote } : note
      );
      onNotesChange?.(updatedNotes);
      return updatedNotes;
    });
  };

  const handleNoteDelete = (noteId: string) => {
    setLocalNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((note) => note.id !== noteId);
      onNotesChange?.(updatedNotes);
      return updatedNotes;
    });
  };

  const handleAddNote = async (content: string, targetDate?: string) => {
    try {
      const createdNote = await noteService.createNote({
        content,
        date: targetDate || new Date().toISOString(),
      });

      setLocalNotes((prevNotes) => {
        const updatedNotes = [...prevNotes, createdNote];
        onNotesChange?.(updatedNotes);
        return updatedNotes;
      });
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const addNewForm = (dateString: string) => {
    const formId = `form-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setAddForms((prev) => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), formId],
    }));
  };

  const removeForm = (dateString: string, formId: string) => {
    setAddForms((prev) => ({
      ...prev,
      [dateString]: prev[dateString].filter((id) => id !== formId),
    }));
  };

  if (!localNotes || localNotes.length === 0) {
    if (intent === undefined) {
      return <div style={styles.notesContainer} />;
    }
    const title = getHeaderTitle({ intent, messageContent });
    return (
      <div style={styles.notesContainer}>
        {title && (
          <div style={styles.notesHeader}>
            <div style={styles.notesTitle}>{title}</div>
            <div style={styles.notesCount}>0</div>
          </div>
        )}
      </div>
    );
  }

  const title = getHeaderTitle({ intent, messageContent });
  const groupedNotes = groupNotesByDate(localNotes);

  return (
    <div style={styles.notesContainer}>
      {title && (
        <div style={styles.notesHeader}>
          <div style={styles.notesTitle}>{title}</div>
          <div style={styles.notesCount}>{localNotes?.length || 0}</div>
        </div>
      )}

      {Object.entries(groupedNotes).map(([dateString, dateNotes]) => (
        <div key={dateString} style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '8px 12px',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(99, 102, 241, 0.15)',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#4f46e5',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {formatDateDisplay(dateString)}
            </div>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {dateNotes.length} {dateNotes.length === 1 ? 'task' : 'tasks'}
              </div>
              <button
                onClick={() => addNewForm(dateString)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#059669',
                  padding: '0',
                  margin: '0',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
                  e.currentTarget.style.borderColor = '#059669';
                  e.currentTarget.style.color = '#047857';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                  e.currentTarget.style.color = '#059669';
                }}
                title={`Add task for ${formatDateDisplay(dateString)}`}
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {dateNotes.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              note={note}
              index={index}
              onNoteUpdate={handleNoteUpdate}
              onNoteDelete={handleNoteDelete}
            />
          ))}

          {(addForms[dateString] || []).map((formId, index) => (
            <AddNewNote
              key={formId}
              styles={noteCardStyles}
              isInline={true}
              index={index}
              initialDate={new Date(dateString)}
              onSave={(content, date) => {
                handleAddNote(content, date);
                removeForm(dateString, formId);
              }}
              onCancel={() => removeForm(dateString, formId)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
