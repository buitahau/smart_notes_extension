import React, { useState } from 'react';
import {
  ArrowLeft as ArrowLeftIcon,
  Calendar as CalendarIcon,
  Check as CheckIcon,
  X as XIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMiniRouter } from '@context/router-context';
import { noteService } from '@services/note-service';

interface NoteFormData {
  content: string;
  date: string;
}

export function CreateNote() {
  const { navigate } = useMiniRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    defaultValues: {
      content: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmitNote = async (data: NoteFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await noteService.createNote({
        content: data.content,
        date: data.date,
      });

      // Reset form and navigate on success
      reset();
      navigate('home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    navigate('home');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleCancel}>
          <ArrowLeftIcon size={20} />
        </button>
        <h1 style={styles.title}>Create New Note</h1>
        <div style={styles.headerSpacer} />
      </div>

      {/* Form */}
      <div style={styles.content}>
        <form onSubmit={handleSubmit(onSubmitNote)} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Note Content</label>
            <textarea
              {...register('content', {
                required: 'Note content is required',
                minLength: { value: 1, message: 'Note content cannot be empty' },
              })}
              style={{
                ...styles.formTextArea,
                ...(errors.content ? styles.formInputError : {}),
              }}
              placeholder="Write your note here..."
              rows={8}
              autoFocus
              disabled={isLoading}
            />
            {errors.content && <span style={styles.errorMessage}>{errors.content.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <CalendarIcon size={16} style={styles.labelIcon} />
              Date
            </label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              style={{
                ...styles.formInput,
                ...(errors.date ? styles.formInputError : {}),
              }}
              disabled={isLoading}
            />
            {errors.date && <span style={styles.errorMessage}>{errors.date.message}</span>}
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                ...styles.cancelButton,
                ...(isLoading ? styles.disabledButton : {}),
              }}
              disabled={isLoading}
            >
              <XIcon size={16} />
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.disabledButton : {}),
              }}
              disabled={isLoading}
            >
              <CheckIcon size={16} />
              {isLoading ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    maxHeight: '600px',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  headerSpacer: {
    width: '40px', // Same width as back button for centering
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto' as const,
    backgroundColor: '#fafbfc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    height: '100%',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  },
  labelIcon: {
    color: '#6b7280',
  },
  formTextArea: {
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#374151',
    lineHeight: '1.6',
    minHeight: '200px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  formInput: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#374151',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  formInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorMessage: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '4px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '16px',
    marginTop: 'auto',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: '2px solid transparent',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    minWidth: '120px',
  },
  errorAlert: {
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  disabledButton: {
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  },
};
