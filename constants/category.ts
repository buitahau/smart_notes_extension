export const ON_A_DATE = 'on_a_date';

export const DEFAULT_CATEGORY = ON_A_DATE;

export const CATEGORY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Someday', value: 'someday' },
  { label: 'On a Date', value: ON_A_DATE },
] as const;

export type CategoryValue = (typeof CATEGORY_OPTIONS)[number]['value'];