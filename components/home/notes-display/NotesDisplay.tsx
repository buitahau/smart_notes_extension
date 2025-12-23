import React from 'react';
import { Note } from '@services/note-service';
import { TaskListDisplay } from './TaskListDisplay';
import { DateLookupDisplay } from './DateLookupDisplay';

interface NotesDisplayProps {
  notes: Note[] | undefined;
  intent?: string;
  messageContent?: string;
  onNotesChange?: (notes: Note[]) => void;
}

const intentComponentMap: Record<string, React.FC<NotesDisplayProps>> = {
  task_list: TaskListDisplay,
  date_lookup: DateLookupDisplay,
};

export const NotesDisplay: React.FC<NotesDisplayProps> = (props) => {
  const { intent = 'task_list' } = props;
  const Component = intentComponentMap[intent] || TaskListDisplay;
  return <Component {...props} />;
};
