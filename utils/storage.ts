import { STORAGE_KEYS } from './constants';

type BrowserApi = typeof chrome;
type BrowserGlobal = typeof globalThis & { browser?: BrowserApi };

const getStorageArea = () => {
  if (typeof chrome !== 'undefined') {
    return chrome.storage.local;
  }

  const maybeBrowser = (globalThis as BrowserGlobal).browser;
  console.log("maybeBrowser")
  console.log(maybeBrowser)
  if (maybeBrowser?.storage?.local) {
    return maybeBrowser.storage.local;
  }

  throw new Error('Browser storage API is unavailable in this environment');
};

export type StorageKeys = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const storage = {
  async set<T>(key: StorageKeys, value: T): Promise<void> {
    await getStorageArea().set({ [key]: value });
  },

  async get<T>(key: StorageKeys): Promise<T | null> {
    const result = await getStorageArea().get(key);
    if (result == undefined) {
      return null;
    }
    return result[key] ?? null;
  },

  async remove(key: StorageKeys): Promise<void> {
    await getStorageArea().remove(key);
  },

  async clear(): Promise<void> {
    await getStorageArea().clear();
  },
};
