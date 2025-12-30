import React from 'react';
import type { IntentDisplayProps } from './types';
import { TaskListDisplay } from './task-list/task-list-display';
import { DateLookupDisplay } from './date-lookup/date-lookup-display';
import { GenericNotesDisplay } from './generic-notes-display/generic-notes-display';

const intentComponentMap: Record<string, React.FC<IntentDisplayProps>> = {
  task_list: TaskListDisplay,
  date_lookup: DateLookupDisplay,
};

export const NotesDisplay: React.FC<IntentDisplayProps> = (props) => {
  const Component =
    (props.intent && intentComponentMap[props.intent]) || GenericNotesDisplay;

  return <Component {...props} />;
};
