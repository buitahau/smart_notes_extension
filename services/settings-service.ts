import apiClient from './api-client';
import { API_ENDPOINTS, DEFAULT_SETTINGS } from '@utils/constants';
import { AppSettings, AppSettingsResponse } from '@types/settings';

class SettingsService {
  async get(): Promise<AppSettings> {
    const response = await apiClient.get<AppSettingsResponse>(API_ENDPOINTS.SETTINGS);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch settings');
    }

    const defaults = DEFAULT_SETTINGS.NOTIFICATION;
    const payload = response.data.data;

    if (!payload) {
      return { ...defaults };
    }

    const interval = Number(payload.intervalMinutes) || defaults.intervalMinutes;

    return {
      receiveReminder: Boolean(payload.receiveReminder),
      intervalMinutes: Math.max(1, interval),
    };
  }

  async update(payload: AppSettings): Promise<AppSettings> {
    const response = await apiClient.put<AppSettingsResponse>(API_ENDPOINTS.SETTINGS, payload);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update settings');
    }

    const defaults = DEFAULT_SETTINGS.NOTIFICATION;
    const next = response.data.data ?? payload ?? defaults;

    if (!next) {
      return { ...defaults };
    }

    const interval = Number(next.intervalMinutes) || defaults.intervalMinutes;

    return {
      receiveReminder: Boolean(next.receiveReminder),
      intervalMinutes: Math.max(1, interval),
    };
  }
}

export const settingsService = new SettingsService();
