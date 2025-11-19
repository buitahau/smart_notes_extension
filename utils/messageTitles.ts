/**
 * Context-aware title and empty state generator for chat messages
 */

export interface MessageTitleConfig {
  intent?: string;
  messageContent?: string;
}

export interface EmptyStateConfig {
  icon: string;
  text: string;
}

/**
 * Generates context-aware header titles based on intent and message content
 */
export const getHeaderTitle = (config: MessageTitleConfig): string => {
  const { intent, messageContent } = config;

  if (!messageContent) {
    switch (intent) {
      case 'task_list':
        return '';
      case 'date_lookup':
        return 'Related Notes';
      default:
        return 'Notes';
    }
  }

  const content = messageContent.toLowerCase();

  if (intent === 'task_list') {
    if (content.includes('today')) return "Today's Tasks";
    if (content.includes('tomorrow')) return "Tomorrow's Tasks";
    if (content.includes('week') || content.includes('this week')) return "This Week's Tasks";
    if (content.includes('month') || content.includes('this month')) return "This Month's Tasks";
    if (content.includes('yesterday')) return "Yesterday's Tasks";
    if (content.includes('weekend')) return 'Weekend Tasks';
    if (content.includes('upcoming') || content.includes('future')) return 'Upcoming Tasks';
    if (content.includes('overdue') || content.includes('pending')) return 'Pending Tasks';
    if (content.includes('complete') || content.includes('done')) return 'Completed Tasks';
    return '';
  }

  switch (intent) {
    case 'date_lookup':
      return 'Related Notes';
    default:
      return 'Notes';
  }
};

/**
 * Generates context-aware empty state messages based on intent and message content
 */
export const getEmptyState = (config: MessageTitleConfig): EmptyStateConfig => {
  const { intent, messageContent } = config;

  if (!messageContent) {
    switch (intent) {
      case 'task_list':
        return { icon: '📋', text: 'No tasks found for this time period.' };
      case 'date_lookup':
        return { icon: '🔍', text: 'No related notes found.' };
      default:
        return { icon: '📝', text: 'No notes found.' };
    }
  }

  const content = messageContent.toLowerCase();

  if (intent === 'task_list') {
    if (content.includes('today')) return { icon: '📅', text: 'No tasks scheduled for today.' };
    if (content.includes('tomorrow'))
      return { icon: '📅', text: 'No tasks scheduled for tomorrow.' };
    if (content.includes('week') || content.includes('this week'))
      return { icon: '📆', text: 'No tasks scheduled for this week.' };
    if (content.includes('month') || content.includes('this month'))
      return { icon: '📆', text: 'No tasks scheduled for this month.' };
    if (content.includes('yesterday'))
      return { icon: '📅', text: 'No tasks found from yesterday.' };
    if (content.includes('weekend'))
      return { icon: '🏖️', text: 'No tasks scheduled for the weekend.' };
    if (content.includes('upcoming') || content.includes('future'))
      return { icon: '🔮', text: 'No upcoming tasks found.' };
    if (content.includes('overdue') || content.includes('pending'))
      return { icon: '⏰', text: 'No overdue or pending tasks found.' };
    if (content.includes('complete') || content.includes('done'))
      return { icon: '✅', text: 'No completed tasks found.' };
    return { icon: '📋', text: 'No tasks found for this time period.' };
  }

  switch (intent) {
    case 'date_lookup':
      return { icon: '🔍', text: 'No related notes found.' };
    default:
      return { icon: '📝', text: 'No notes found.' };
  }
};

/**
 * Utility functions for message title generation
 */
export const MessageTitles = {
  getHeaderTitle,
  getEmptyState,
};
