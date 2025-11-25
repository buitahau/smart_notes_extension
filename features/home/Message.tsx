import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Bot as BotIcon,
  Check,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  MoreVertical,
} from 'lucide-react';
import { Note, noteService } from '@services/note-service';
import { Clock as ClockIcon } from 'lucide-react';
import { getHeaderTitle, getEmptyState } from '@utils';
import { formatDateDisplay } from './date-utils';
import { useChat } from '@context/chat-context';
import { AddNewNote } from '@components/home/add-note/AddNewNote';

interface MessageProps {
  message: {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
    notes?: Note[];
    intent?: string;
  };
  styles: { [key: string]: React.CSSProperties };
}

const NoteCard: React.FC<{
  note: Note;
  index: number;
  styles: { [key: string]: React.CSSProperties };
  onNoteUpdate: (updatedNote: Note) => void;
  onNoteDelete: (noteId: string) => void;
}> = ({ note, index, styles, onNoteUpdate, onNoteDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isCompleted, setIsCompleted] = useState(note.status === 'completed');
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

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    // TODO: API call to update status
    console.log('Toggle complete status for note:', note.id);
  };

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
    console.log('Delete note:', note.id);
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
                    {/* TODO: Hide Mark as complete */}
                    {/* <button
                      onClick={() => {
                        handleComplete();
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
                      <Check size={14} />
                      {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button> */}
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

// Helper function to group notes by date
const groupNotesByDate = (notes: Note[]): { [date: string]: Note[] } => {
  const grouped: { [date: string]: Note[] } = {};

  notes.forEach((note) => {
    const dateKey = new Date(note.dateAt).toDateString();

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(note);
  });

  // Sort dates in descending order (newest first)
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

const NotesDisplay: React.FC<{
  notes: Note[] | undefined;
  styles: { [key: string]: React.CSSProperties };
  intent?: string;
  messageContent?: string;
  onNotesChange?: (notes: Note[]) => void;
}> = ({ notes, styles, intent, messageContent, onNotesChange }) => {
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
      // Optionally, handle error state or notify user
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
      // Welcome message case
      return (
        <div style={styles.notesContainer}>
          {/* <AddNewNote styles={styles} onSave={(content, date) => handleAddNote(content, date)} /> */}
        </div>
      );
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
        {/* <AddNewNote styles={styles} onSave={(content, date) => handleAddNote(content, date)} /> */}
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
          {/* Date Header */}
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
              {/* Plus button beside task count */}
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

          {/* Notes for this date */}
          {dateNotes.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              note={note}
              index={index}
              styles={styles}
              onNoteUpdate={handleNoteUpdate}
              onNoteDelete={handleNoteDelete}
            />
          ))}

          {/* Multiple add forms that appear when plus button is clicked */}
          {(addForms[dateString] || []).map((formId, index) => (
            <AddNewNote
              key={formId}
              styles={styles}
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

export const Message: React.FC<MessageProps> = ({ message, styles }) => {
  const { messages: chatMessages, setMessages } = useChat();
  const isAI = message.type === 'ai';
  const isLoading = message.id.startsWith('loading-');
  const handleNotesChange = (updatedNotes: Note[]) => {
    const nextMessages = chatMessages.map((msg) =>
      msg.id === message.id ? { ...msg, notes: updatedNotes } : msg
    );
    setMessages(nextMessages);
  };

  return (
    <div
      style={{
        ...styles.messageWrapper,
        ...(isAI ? styles.messageWrapperAI : styles.messageWrapperUser),
      }}
    >
      {isAI && (
        <div style={{ ...styles.avatar, ...styles.avatarAI }}>
          <BotIcon size={18} color="white" />
        </div>
      )}
      <div
        style={{
          ...styles.messageBubble,
          ...(isAI ? styles.aiBubble : styles.userBubble),
        }}
        className={isAI ? 'message-bubble-ai' : 'message-bubble-user'}
      >
        <div style={styles.messageContent}>
          {isAI ? (
            <div>
              <div style={{ marginBottom: '12px', fontSize: '15px', color: '#374151' }}>
                {message.content}
              </div>
              {message.notes && message.notes.length > 0 && !isLoading ? (
                <NotesDisplay
                  notes={message.notes}
                  styles={styles}
                  intent={message.intent}
                  messageContent={message.content}
                  onNotesChange={handleNotesChange}
                />
              ) : !isLoading ? (
                <NotesDisplay
                  notes={[]}
                  styles={styles}
                  intent={message.intent}
                  messageContent={message.content}
                  onNotesChange={handleNotesChange}
                />
              ) : null}
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Thinking</span>
              <span className="loading-dots"></span>
            </div>
          ) : (
            message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))
          )}
        </div>
        <div
          style={{
            ...styles.messageTime,
            ...(isAI ? styles.messageTimeAI : styles.messageTimeUser),
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      {!isAI && (
        <div style={{ ...styles.avatar, ...styles.avatarUser }}>
          <UserIcon size={18} color="white" />
        </div>
      )}
    </div>
  );
};
