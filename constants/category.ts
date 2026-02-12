export const ON_A_DATE = 'on-a-date';
export const INFORMATION = 'information';

export const DEFAULT_CATEGORY = INFORMATION;

export const CATEGORY_OPTIONS = [
  { label: 'Information', value: INFORMATION },
  { label: 'On a Date', value: ON_A_DATE },
] as const;

export type CategoryValue = (typeof CATEGORY_OPTIONS)[number]['value'];