import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@utils/constants';
import { storage } from '@utils/storage';
import type { Note } from '@services/note-service';
import type { AppSettings } from '@types/settings';

type BackgroundMessage = {
  type: string;
  payload?: unknown;
};

type StoredMessage = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  notes?: Note[];
  intent?: string;
};

const NOTIFICATION_ALARM_NAME = 'smart_note_task_notification';

const getStoredNotificationSettings = async (): Promise<AppSettings> => {
  const defaults = DEFAULT_SETTINGS.NOTIFICATION;
  const stored = (await storage.get<AppSettings>(STORAGE_KEYS.SETTINGS)) ?? defaults;

  return {
    receiveReminder: stored.receiveReminder ?? defaults.receiveReminder,
    intervalMinutes: Math.max(1, stored.intervalMinutes ?? defaults.intervalMinutes),
  };
};

const syncReminderAlarm = async () => {
  if (!browser?.alarms) return;

  const settings = await getStoredNotificationSettings();

  if (!settings.receiveReminder) {
    await browser.alarms.clear(NOTIFICATION_ALARM_NAME);
    return;
  }

  const desiredInterval = Math.max(1, settings.intervalMinutes);

  const existingAlarm = await browser.alarms.get(NOTIFICATION_ALARM_NAME);
  if (!existingAlarm || existingAlarm.periodInMinutes !== desiredInterval) {
    browser.alarms.create(NOTIFICATION_ALARM_NAME, {
      periodInMinutes: desiredInterval,
    });
  }
};

const pickRandomNote = (messages: StoredMessage[]): Note | null => {
  const notes = messages
    .flatMap((message) => message.notes ?? [])
    .filter((note): note is Note => Boolean(note?.content?.trim()));

  if (notes.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

const truncateContent = (content: string) => {
  const normalized = content.replace(/\s+/g, ' ').trim();
  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
};

const showTaskReminderNotification = async () => {
  try {
    const settings = await getStoredNotificationSettings();
    if (!settings.receiveReminder) {
      return;
    }

    const storedMessages = (await storage.get<StoredMessage[]>(STORAGE_KEYS.CHAT_MESSAGES)) ?? [];

    if (storedMessages.length === 0) return;

    const note = pickRandomNote(storedMessages);
    if (!note) return;

    await browser.notifications.create(`smart-note-${Date.now()}`, {
      type: 'basic',
      iconUrl: browser.runtime.getURL('icon/128.png'),
      title: 'Task reminder',
      message: truncateContent(note.content),
      contextMessage: note.dateAt ? new Date(note.dateAt).toLocaleDateString() : undefined,
      priority: 1,
    });
  } catch (error) {
    console.error('Failed to display task reminder notification', error);
  }
};

export default defineBackground(() => {
  console.log('Background script loaded');

  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('Extension installed');
    } else if (details.reason === 'update') {
      console.log('Extension updated');
    }
    void syncReminderAlarm();
  });

  browser.runtime.onStartup?.addListener(() => {
    void syncReminderAlarm();
  });
  void syncReminderAlarm();

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') {
      return;
    }

    if (STORAGE_KEYS.SETTINGS in changes) {
      void syncReminderAlarm();
    }
  });

  if (browser?.alarms) {
    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === NOTIFICATION_ALARM_NAME) {
        showTaskReminderNotification();
      }
    });
  }

  browser.runtime.onMessage.addListener((message: unknown, _sender, _sendResponse) => {
    const msg = message as BackgroundMessage;
    console.log('Message received in background script:', msg);

    switch (msg?.type) {
      case 'example':
        console.log('Example message received with payload:', msg.payload);
        break;
      case 'show-task-reminder':
        showTaskReminderNotification();
        break;
      default:
        console.warn('Unknown message type:', msg?.type);
    }
  });

  return () => {
    console.log('Background script unloaded');
  };
});
