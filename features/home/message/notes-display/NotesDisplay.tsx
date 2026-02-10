import React from 'react';
import type { IntentDisplayProps } from './types';
import { TaskListDisplay } from './task-list/task-list-display';
import { DateLookupDisplay } from './date-lookup/date-lookup-display';
import { GenericNotesDisplay } from './generic-notes-display';
import { RetrieveInformationDisplay } from './retrieve-information/retrieve-information-display';

const intentComponentMap: Record<string, React.FC<IntentDisplayProps>> = {
  task_list: TaskListDisplay,
  date_lookup: DateLookupDisplay,
  retrieve_information: RetrieveInformationDisplay,
};

export const NotesDisplay: React.FC<IntentDisplayProps> = (props) => {
  const Component =
    (props.intent && intentComponentMap[props.intent]) || GenericNotesDisplay;

  return <Component {...props} />;
};
