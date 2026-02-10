import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AddNewNote } from '@components/home/add-note/AddNewNote';
import { noteService } from '@services/note-service';
import { NoteCard } from '@features/home/message/note-card/NoteCard';
import { TaskListDisplay } from '../task-list/task-list-display';
import { styles } from '../notes-display.styles';
import type { IntentDisplayProps } from '../types';
import type { Note } from '@services/note-service';

export const RetrieveInformationDisplay: React.FC<IntentDisplayProps> = ({
  notes,
  intent,
  messageContent,
  onNotesChange,
}) => {
  const [localNotes, setLocalNotes] = useState<Note[]>(notes || []);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setLocalNotes(notes || []);
  }, [notes]);

  // Split notes into dated and non-dated
  const datedNotes = localNotes.filter((note) => note.dateAt && note.dateAt.trim());
  const nonDatedNotes = localNotes.filter((note) => !note.dateAt || !note.dateAt.trim());

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

  const handleAddNote = async (content: string, date?: string, category?: string) => {
    try {
      const createdNote = await noteService.createNote({
        content,
        date: date || new Date().toISOString(),
        category: category as 'on-a-date' | 'information',
      });

      setLocalNotes((prevNotes) => {
        const updatedNotes = [...prevNotes, createdNote];
        onNotesChange?.(updatedNotes);
        return updatedNotes;
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleDatedNotesChange = (updatedDatedNotes: Note[]) => {
    // Merge updated dated notes with non-dated notes
    const mergedNotes = [...updatedDatedNotes, ...nonDatedNotes];
    setLocalNotes(mergedNotes);
    onNotesChange?.(mergedNotes);
  };

  return (
    <div>
      {/* Dated items: Render using TaskListDisplay */}
      {datedNotes.length > 0 && (
        <TaskListDisplay
          notes={datedNotes}
          intent={intent}
          messageContent={messageContent}
          onNotesChange={handleDatedNotesChange}
        />
      )}

      {/* Non-dated items: Render as separate section titled "Information" */}
      {nonDatedNotes.length > 0 && (
        <div style={styles.notesContainer}>
          <div style={styles.notesHeader}>
            <div style={styles.notesTitle}>Information</div>
            <div style={styles.notesCount}>{nonDatedNotes.length}</div>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#059669',
                padding: '0',
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
              title="Add information"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          {showAddForm && (
            <AddNewNote
              styles={styles}
              isInline={false}
              initialCategory="information"
              onSave={(content, date, category) => handleAddNote(content, date, category)}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {nonDatedNotes.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              note={note}
              index={index}
              onNoteUpdate={handleNoteUpdate}
              onNoteDelete={handleNoteDelete}
            />
          ))}
        </div>
      )}

      {/* Empty state when no notes at all */}
      {datedNotes.length === 0 && nonDatedNotes.length === 0 && (
        <div style={styles.notesContainer}>
          <div
            style={{
              ...styles.noteCard,
              textAlign: 'center',
              color: '#64748b',
              fontSize: '13px',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
            <div>No information found.</div>
          </div>
        </div>
      )}
    </div>
  );
};
