import { browser } from 'wxt/browser';
import { STORAGE_KEYS } from './constants';

export type StorageKeys = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const storage = {
  async set<T>(key: StorageKeys, value: T): Promise<void> {
    await browser.storage.local.set({ [key]: value });
  },

  async get<T>(key: StorageKeys): Promise<T | null> {
    const result = await browser.storage.local.get(key);
    return (result?.[key] ?? null) as T | null;
  },

  async remove(key: StorageKeys): Promise<void> {
    await browser.storage.local.remove(key);
  },

  async clear(): Promise<void> {
    await browser.storage.local.clear();
  },
};
