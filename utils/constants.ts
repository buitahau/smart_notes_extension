/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  USER: 'smart_note_user',
  TOKEN: 'smart_note_token',
  CHAT_MESSAGES: 'smart_note_chat_messages',
  SETTINGS: 'smart_note_settings',
  PENDING_OTP_LOGIN: 'smart_note_pending_otp_login',
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGIN_OTP: '/api/auth/otp',
    VERIFY_OTP: '/api/auth/otp/verify',
    VALIDATE: '/api/auth/validate',
    LOGOUT: '/api/auth/logout',
  },
  USER: {
    ME: '/api/users/me',
  },
  NOTES: {
    BASE: '/api/notes',
    BY_ID: (id: string) => `/api/notes/${id}`,
  },
  QUERY: {
    BASE: '/api/query',
  },
  SETTINGS: '/api/settings',
} as const;

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  APP_NAME: 'Smart Notes',
  VERSION: '1.0.0',
} as const;

export const DEFAULT_SETTINGS = {
  NOTIFICATION: {
    receiveReminder: true,
    intervalMinutes: 60,
  },
} as const;
