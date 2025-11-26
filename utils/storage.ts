import { STORAGE_KEYS } from './constants';

export type StorageKeys = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const storage = {
  async set<T>(key: StorageKeys, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },

  async get<T>(key: StorageKeys): Promise<T | null> {
    const result = await chrome.storage.local.get(key);
    return result[key] ?? null;
  },

  async remove(key: StorageKeys): Promise<void> {
    await chrome.storage.local.remove(key);
  },

  async clear(): Promise<void> {
    await chrome.storage.local.clear();
  },
};
