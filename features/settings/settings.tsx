import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon, Clock as ClockIcon } from 'lucide-react';
import { useMiniRouter } from '@context/router-context';
import { settingsService } from '@services/settings-service';
import { storage } from '@utils/storage';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@utils/constants';
import type { AppSettings } from '@types/settings';
import { styles } from './styles';

const MIN_INTERVAL = 1;
const MAX_INTERVAL = 720;
const SAVE_DEBOUNCE_MS = 600;

const clampInterval = (value: number) => {
  const defaults = DEFAULT_SETTINGS.NOTIFICATION;
  if (Number.isNaN(value)) {
    return defaults.intervalMinutes;
  }
  return Math.min(Math.max(value, MIN_INTERVAL), MAX_INTERVAL);
};

export const Settings: React.FC = () => {
  const { navigate } = useMiniRouter();

  const defaults = DEFAULT_SETTINGS.NOTIFICATION;
  const [settings, setSettings] = useState<AppSettings>({
    ...defaults,
  });
  const [intervalInput, setIntervalInput] = useState(defaults.intervalMinutes.toString());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<AppSettings | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalDescription = useMemo(() => {
    if (!settings.receiveReminder) {
      return 'Notifications are disabled';
    }
    const minutes = settings.intervalMinutes;
    if (minutes < 60) {
      return `Every ${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    const hours = (minutes / 60).toFixed(1);
    return `About every ${hours.endsWith('.0') ? hours.slice(0, -2) : hours} hours`;
  }, [settings.receiveReminder, settings.intervalMinutes]);

  const persistLocally = useCallback(async (payload: AppSettings) => {
    await storage.set(STORAGE_KEYS.SETTINGS, payload);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const response = await settingsService.get();
        setSettings(response);
        setIntervalInput(response.intervalMinutes.toString());
        await persistLocally(response);
      } catch (err) {
        const fallback = { ...defaults };
        setSettings(fallback);
        setIntervalInput(fallback.intervalMinutes.toString());
        setError(err instanceof Error ? err.message : 'Unable to load settings. Using defaults.');
        await persistLocally(fallback);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    loadSettings();
  }, [persistLocally, defaults]);

  const saveSettings = useCallback(
    async (payload: AppSettings) => {
      setIsSaving(true);
      setError(null);
      try {
        const updated = await settingsService.update(payload);
        setSettings(updated);
        setIntervalInput(updated.intervalMinutes.toString());
        await persistLocally(updated);
        setStatusMessage('Settings saved');
        setTimeout(() => setStatusMessage(null), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save settings');
      } finally {
        setIsSaving(false);
      }
    },
    [persistLocally]
  );

  useEffect(() => {
    if (!pendingSettings || !initialized) {
      return;
    }

    const timeout = setTimeout(() => {
      void saveSettings(pendingSettings);
      setPendingSettings(null);
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [pendingSettings, initialized, saveSettings]);

  const handleToggleNotifications = () => {
    if (isLoading) return;

    const next = {
      ...settings,
      receiveReminder: !settings.receiveReminder,
    };
    setSettings(next);
    setPendingSettings(next);
  };

  const handleIntervalChange = (value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setIntervalInput(value);

    if (!value) {
      return;
    }

    const minutes = clampInterval(Number(value));
    if (minutes === settings.intervalMinutes) {
      return;
    }

    const next = {
      ...settings,
      intervalMinutes: minutes,
    };
    setSettings(next);
    setPendingSettings(next);
  };

  const handleIntervalBlur = () => {
    if (!intervalInput) {
      setIntervalInput(settings.intervalMinutes.toString());
    }
  };

  const handleNavigateBack = () => {
    navigate('home');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleNavigateBack} aria-label="Back to home">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 style={styles.title}>Settings</h1>
        <div style={styles.headerSpacer} />
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              <BellIcon size={18} />
            </div>
            <div>
              <h2 style={styles.sectionTitle}>Task notifications</h2>
              <p style={styles.sectionSubtitle}>Choose if and how often you get reminders</p>
            </div>
            <button
              style={{
                ...styles.toggle,
                ...(settings.receiveReminder ? styles.toggleActive : {}),
                ...(isLoading ? styles.toggleDisabled : {}),
              }}
              onClick={handleToggleNotifications}
              role="switch"
              aria-checked={settings.receiveReminder}
              disabled={isLoading}
            >
              <div
                style={{
                  ...styles.toggleThumb,
                  ...(settings.receiveReminder ? styles.toggleThumbActive : {}),
                }}
              />
            </button>
          </div>

          <div style={styles.intervalWrapper}>
            <label style={styles.intervalLabel}>
              <ClockIcon size={16} />
              Notification interval (minutes)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={intervalInput}
              onChange={(e) => handleIntervalChange(e.target.value)}
              onBlur={handleIntervalBlur}
              disabled={!settings.receiveReminder || isLoading}
              style={{
                ...styles.intervalInput,
                ...(!settings.receiveReminder ? styles.intervalInputDisabled : {}),
              }}
              placeholder={`Between ${MIN_INTERVAL} and ${MAX_INTERVAL}`}
            />
            <p style={styles.intervalHelper}>{intervalDescription}</p>
          </div>
        </div>

        <div style={styles.footer}>
          {error && <span style={styles.errorText}>{error}</span>}
          {!error && (isSaving ? <span style={styles.savingText}>Saving...</span> : null)}
          {!error && !isSaving && statusMessage && (
            <span style={styles.successText}>{statusMessage}</span>
          )}
        </div>

        {isLoading && <div style={styles.loadingOverlay}>Loading settings...</div>}
      </div>
    </div>
  );
};
