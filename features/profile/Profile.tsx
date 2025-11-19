import React, { useEffect, useState } from 'react';
import { ArrowLeft as ArrowLeftIcon, Mail as MailIcon, User as UserIcon } from 'lucide-react';
import { useMiniRouter } from '@context/router-context';
import { profileService } from '@services/profile-service';
import type { UserProfile, UpdateProfilePayload } from '@types/profile';
import { STORAGE_KEYS } from '@utils/constants';
import { storage } from '@utils/storage';
import type { UserDetails } from '@types/login';
import { profileStyles as styles } from './styles';

type ProfileErrors = Partial<Record<keyof UpdateProfilePayload, string>>;

const emptyProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
};

const splitFromUsername = (username?: string | null) => {
  if (!username || !username.trim() || username.includes('@')) {
    return { firstName: '', lastName: '' };
  }

  const parts = username.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

const deriveProfileFromUser = (details: UserDetails | null): UserProfile => {
  if (!details) {
    return { ...emptyProfile };
  }

  const fallback = splitFromUsername(details.username);

  return {
    firstName: details.firstName?.trim() || fallback.firstName,
    lastName: details.lastName?.trim() || fallback.lastName,
    email: details.email ?? '',
  };
};

const persistProfileLocally = async (profile: UserProfile) => {
  const trimmedFirst = profile.firstName.trim();
  const trimmedLast = profile.lastName.trim();
  const composedName = [trimmedFirst, trimmedLast].filter(Boolean).join(' ') || null;

  const userDetails: UserDetails = {
    username: composedName ?? profile.email ?? null,
    email: profile.email ?? null,
    firstName: trimmedFirst || null,
    lastName: trimmedLast || null,
  };

  await storage.set(STORAGE_KEYS.USER, userDetails);
};

export const Profile: React.FC = () => {
  const { navigate } = useMiniRouter();
  const [formData, setFormData] = useState<UserProfile>({ ...emptyProfile });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await profileService.getProfile();
        setFormData(profile);
        await persistProfileLocally(profile);
        setErrorMessage(null);
      } catch (err) {
        const storedDetails = (await storage.get(STORAGE_KEYS.USER)) as UserDetails | null;
        const fallbackProfile = deriveProfileFromUser(storedDetails);
        setFormData(fallbackProfile);
        setErrorMessage(err instanceof Error ? err.message : 'Unable to load profile information.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field: keyof UpdateProfilePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): ProfileErrors => {
    const validationErrors: ProfileErrors = {};

    if (!formData.firstName.trim()) {
      validationErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      validationErrors.lastName = 'Last name is required';
    }

    return validationErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const payload: UpdateProfilePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };
      const updatedProfile = await profileService.updateProfile(payload);
      setFormData(updatedProfile);
      await persistProfileLocally(updatedProfile);
      setStatusMessage('Profile updated');
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigateBack = () => {
    navigate('home');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={styles.backButton}
          onClick={handleNavigateBack}
          aria-label="Back to home"
          type="button"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 style={styles.title}>Profile</h1>
        <div style={styles.headerSpacer} />
      </div>

      <div style={styles.content}>
        {isLoading ? (
          <div style={styles.loadingState}>Loading profile...</div>
        ) : (
          <form style={styles.card} onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="firstName">
                First name
              </label>
              <div
                style={{
                  ...styles.inputWrapper,
                  ...(errors.firstName ? styles.inputError : {}),
                }}
              >
                <UserIcon size={16} style={styles.inputIcon} />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  placeholder="Enter first name"
                  onChange={(event) => handleChange('firstName', event.target.value)}
                  style={styles.input}
                  autoComplete="given-name"
                />
              </div>
              {errors.firstName && <p style={styles.errorText}>{errors.firstName}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="lastName">
                Last name
              </label>
              <div
                style={{
                  ...styles.inputWrapper,
                  ...(errors.lastName ? styles.inputError : {}),
                }}
              >
                <UserIcon size={16} style={styles.inputIcon} />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  placeholder="Enter last name"
                  onChange={(event) => handleChange('lastName', event.target.value)}
                  style={styles.input}
                  autoComplete="family-name"
                />
              </div>
              {errors.lastName && <p style={styles.errorText}>{errors.lastName}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="email">
                Email
              </label>
              <div style={styles.inputWrapper}>
                <MailIcon size={16} style={styles.inputIcon} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  style={{ ...styles.input, ...styles.inputReadOnly }}
                  disabled
                  autoComplete="email"
                />
              </div>
              <p style={styles.helperText}>Email cannot be changed.</p>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isSaving ? styles.buttonDisabled : {}),
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>

            <div style={styles.statusRow}>
              {statusMessage && (
                <p style={{ ...styles.statusText, ...styles.statusSuccess }}>{statusMessage}</p>
              )}
              {errorMessage && (
                <p style={{ ...styles.statusText, ...styles.statusError }}>{errorMessage}</p>
              )}
              {!statusMessage && !errorMessage && (
                <p style={styles.statusText}>Update your personal information</p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
