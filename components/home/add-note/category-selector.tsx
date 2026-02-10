import React from 'react';
import { CATEGORY_OPTIONS, CategoryValue } from '@constants/category';

interface CategorySelectorProps {
  selectedCategory: CategoryValue;
  onCategoryChange: (category: CategoryValue) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '12px',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          color: '#6b7280',
          fontWeight: '500',
        }}
      >
        Category:
      </span>
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        {CATEGORY_OPTIONS.map((option) => (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: selectedCategory === option.value ? '#059669' : '#6b7280',
              fontWeight: selectedCategory === option.value ? '600' : '400',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="radio"
              name="category"
              value={option.value}
              checked={selectedCategory === option.value}
              onChange={() => onCategoryChange(option.value as CategoryValue)}
              style={{
                accentColor: '#10b981',
                cursor: 'pointer',
                width: '16px',
                height: '16px',
              }}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};
