import React, { useState, useRef, useEffect } from 'react';

// Calendar component for date selection
export const DatePicker: React.FC<{
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}> = ({ selectedDate, onDateChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update current month when selectedDate changes
    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateChange(newDate);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          style={{
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().toDateString() ===
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
      const isSelected =
        selectedDate.toDateString() ===
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          style={{
            width: '26px',
            height: '26px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            backgroundColor: isSelected ? '#3b82f6' : isToday ? '#f3f4f6' : 'transparent',
            color: isSelected ? 'white' : isToday ? '#1f2937' : '#6b7280',
            fontWeight: isToday ? '600' : 'normal',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            margin: '0',
            outline: 'none',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isSelected && !isToday) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected && !isToday) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div
      ref={calendarRef}
      style={{
        position: 'absolute',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '8px',
        zIndex: 1000,
        width: '220px',
      }}
    >
      {/* Header with month/year and navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
          padding: '0 2px',
        }}
      >
        <button
          onClick={handlePrevMonth}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '3px',
            color: '#6b7280',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          ‹
        </button>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#1f2937',
          }}
        >
          {monthNames[currentMonth.getMonth()].slice(0, 3)} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={handleNextMonth}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '3px',
            color: '#6b7280',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          ›
        </button>
      </div>

      {/* Week day headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          marginBottom: '4px',
        }}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#9ca3af',
              textAlign: 'center',
              textTransform: 'uppercase',
              width: '26px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          justifyContent: 'center',
        }}
      >
        {renderCalendarDays()}
      </div>
    </div>
  );
};
