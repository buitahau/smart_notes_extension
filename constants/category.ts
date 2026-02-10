export const ON_A_DATE = 'on-a-date';
export const INFORMATION = 'information';

export const DEFAULT_CATEGORY = ON_A_DATE;

export const CATEGORY_OPTIONS = [
  { label: 'On a Date', value: ON_A_DATE },
  { label: 'Information', value: INFORMATION },
] as const;

export type CategoryValue = typeof ON_A_DATE | typeof INFORMATION;