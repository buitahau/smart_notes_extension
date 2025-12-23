import React, { useEffect, useRef, useState } from 'react';
import { Edit2, MoreVertical, Save, Trash2, X } from 'lucide-react';
import { Note, noteService } from '@services/note-service';
import { noteCardStyles } from './styles';

interface NoteCardProps {
  note: Note;
  index: number;
  onNoteUpdate: (updatedNote: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, index, onNoteUpdate, onNoteDelete }) => {
  const styles = noteCardStyles;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const isCompleted = note.status === 'completed';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setEditedContent(note.content);
  }, [note]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const updatedNote = await noteService.updateNote(note.id, {
        content: editedContent,
        date: note.dateAt,
      });
      onNoteUpdate(updatedNote);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(note.content);
  };

  const handleDelete = async () => {
    try {
      await noteService.deleteNote(note.id);
      onNoteDelete(note.id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div
      style={{
        ...styles.noteCard,
        animation: `fadeInUp 0.4s ease ${index * 0.1}s both`,
        opacity: isCompleted ? 0.6 : 1,
        zIndex: isMenuOpen ? 20 : 'auto',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          styles.noteCardHover.backgroundColor || 'rgba(255, 255, 255, 0.95)';
        e.currentTarget.style.borderColor =
          styles.noteCardHover.borderColor || 'rgba(99, 102, 241, 0.3)';
        e.currentTarget.style.boxShadow =
          styles.noteCardHover.boxShadow || '0 8px 24px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = styles.noteCardHover.transform || 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          styles.noteCard.backgroundColor || 'rgba(255, 255, 255, 0.9)';
        e.currentTarget.style.borderColor =
          (styles.noteCard.border as string) || 'rgba(229, 231, 235, 0.6)';
        e.currentTarget.style.boxShadow =
          styles.noteCard.boxShadow || '0 2px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ ...styles.noteContent, textDecoration: isCompleted ? 'line-through' : 'none' }}>
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '13px',
              lineHeight: '1.4',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '60px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{note.content}</span>
            {!isEditing && (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  style={{
                    display: 'grid',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '28px',
                    height: '28px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="More options"
                >
                  <MoreVertical size={16} />
                </button>
                {isMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '34px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 50,
                      width: '200px',
                      padding: '4px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <button
                      onClick={() => {
                        handleEdit();
                        setIsMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: '#374151',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit2 size={14} />
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setIsMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: '#ef4444',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={14} />
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {isEditing && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handleCancel}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#4b5563';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6b7280';
            }}
          >
            <X size={14} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#059669';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            <Save size={14} />
            Save
          </button>
        </div>
      )}
    </div>
  );
};
