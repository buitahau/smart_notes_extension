import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { DatePicker } from './date-picker';
import { CategorySelector } from './category-selector';
import { formatDateDisplay } from '@utils/date-utils';
import { DEFAULT_CATEGORY, CategoryValue } from '@constants/category';

interface AddNewNoteProps {
  styles: { [key: string]: React.CSSProperties };
  onSave: (content: string, date: string, category: CategoryValue) => void;
  onCancel?: () => void;
  initialDate?: Date;
  initialCategory?: CategoryValue;
  isInline?: boolean;
  index?: number;
}

export const AddNewNote: React.FC<AddNewNoteProps> = ({
  styles,
  onSave,
  onCancel,
  initialDate,
  initialCategory,
  isInline,
  index,
}: AddNewNoteProps) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryValue>(initialCategory || DEFAULT_CATEGORY);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const handleSave = () => {
    if (content.trim()) {
      if (category === 'on-a-date') {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();
        const utcDate = new Date(Date.UTC(year, month, day));
        onSave(content.trim(), utcDate.toISOString(), category);
      } else {
        // Information category - no date
        onSave(content.trim(), '', category);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey && content.trim()) {
      handleSave();
    } else if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  if (!isInline) {
    return (
      <div
        style={{
          ...styles.noteCard,
          border: '2px dashed #10b981',
          backgroundColor: '#f0fdf4',
        }}
      >
        <CategorySelector selectedCategory={category} onCategoryChange={setCategory} />
        <textarea
          placeholder="Enter your content..."
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
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
            backgroundColor: 'white',
          }}
          autoFocus
        />
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handleSave}
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
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    );
  }

  const isSelectedDateDifferent =
    initialDate && selectedDate.toDateString() !== new Date(initialDate).toDateString();

  return (
    <div
      className="add-note-container-selector"
      style={{
        ...styles.noteCard,
        border: '2px dashed #10b981',
        backgroundColor: '#f0fdf4',
        marginTop: '8px',
        marginBottom: '8px',
        animation: `fadeInUp 0.3s ease ${(index || 0) * 0.1}s both`,
        position: 'relative',
      }}
    >
      <CategorySelector selectedCategory={category} onCategoryChange={setCategory} />

      {category === 'on-a-date' && (
        <div
          style={{
            fontSize: '12px',
            color: '#059669',
            marginBottom: '8px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            position: 'relative',
          }}
        >
          <Plus size={14} />
          Adding task for{' '}
          <button
            onClick={() => setDatePickerOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: isSelectedDateDifferent ? '#1f2937' : '#059669',
              textDecoration: isSelectedDateDifferent ? 'underline' : 'none',
              cursor: 'pointer',
              padding: '0',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '2px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(5, 150, 105, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {formatDateDisplay(selectedDate.toISOString())}
          </button>
          {isDatePickerOpen && (
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={(newDate) => {
                setSelectedDate(newDate);
                setDatePickerOpen(false);
              }}
              onClose={() => setDatePickerOpen(false)}
            />
          )}
        </div>
      )}

      <textarea
        placeholder={category === 'on-a-date' ? 'Enter your task...' : 'Enter your information...'}
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
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
          backgroundColor: 'white',
        }}
        autoFocus
      />
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={onCancel}
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
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
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
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
          }}
        >
          <Save size={14} />
          Save
        </button>
      </div>
    </div>
  );
};
