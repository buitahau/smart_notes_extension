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
import { styles } from './create-note.styles';
import { CATEGORY_OPTIONS, CategoryValue, DEFAULT_CATEGORY, ON_A_DATE } from '@constants/category';

interface NoteFormData {
  content: string;
  category: CategoryValue;
  date?: string;
}

export function CreateNote() {
  const { navigate } = useMiniRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NoteFormData>({
    defaultValues: {
      content: '',
      category: DEFAULT_CATEGORY,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch('category', DEFAULT_CATEGORY);
  const shouldShowDatePicker = selectedCategory === ON_A_DATE;

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
              rows={5}
              autoFocus
              disabled={isLoading}
            />
            {errors.content && <span style={styles.errorMessage}>{errors.content.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <div style={styles.categoryOptions}>
              {CATEGORY_OPTIONS.map((category) => (
                <label
                  key={category.value}
                  style={{
                    ...styles.categoryOption,
                    ...(selectedCategory === category.value ? styles.categoryOptionSelected : {}),
                  }}
                >
                  <input
                    type='radio'
                    value={category.value}
                    {...register('category', {required: true})}
                    style={styles.categoryInput}
                    disabled={isLoading}
                  />
                  {category.label}
                </label>
              ))}
            </div>
          </div>
          
          {shouldShowDatePicker && (
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <CalendarIcon size={16} style={styles.labelIcon} />
                Date
              </label>
              <input
                type='date'
                {...register('date', {required: 'Date is required'})}
                style={{
                  ...styles.formInput,
                  ...(errors.date ? styles.formInputError : {}),
                }}
                disabled={isLoading}
              />
              {errors.date && <span style={styles.errorMessage}>{errors.date.message}</span>}
            </div>
          )}
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
