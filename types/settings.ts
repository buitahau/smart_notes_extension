export interface AppSettings {
  receiveReminder: boolean;
  intervalMinutes: number;
}

export interface AppSettingsResponse {
  success: boolean;
  message?: string;
  data?: AppSettings;
}
