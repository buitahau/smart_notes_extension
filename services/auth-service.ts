import { SignupFormData, SignUpResponse } from '@types/signup';
import {
  LoginFormData,
  LoginResponse,
  UserDetails,
  ValidateTokenResponse,
  OtpRequestResponse,
} from '@types/login';
import { storage } from '@utils/storage';
import { handleApiError } from '@utils/error-handler';
import { STORAGE_KEYS, API_ENDPOINTS } from '@utils/constants';
import apiClient from './api-client';
import { LogoutResponse } from '@types/login';

export const signInWithOtp = async (email: string): Promise<OtpRequestResponse> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN_OTP, { email });
    const data = response.data;

    if (!data.success) {
      return {
        success: false,
        error: data.message || 'Failed to send verification code',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

export const verifyOtp = async (payload: LoginFormData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      email: payload.email,
      token: payload.otp,
    });
    const data = response.data;

    if (!data.success) {
      return {
        username: null,
        error: data.message || 'Invalid or expired code',
      };
    }

    const username = await updateStorage(data);

    return {
      username,
      error: null,
    };
  } catch (error) {
    return {
      username: null,
      error: handleApiError(error),
    };
  }
};

const deriveNamesFromUsername = (fullName: string | null) => {
  if (!fullName || !fullName.trim() || fullName.includes('@')) {
    return { firstName: null, lastName: null };
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

const updateStorage = async (data: any) => {
  const username = data.user?.user_metadata?.username ?? data.user?.email ?? null;
  const email = data.user?.email ?? null;
  const token = data.session?.access_token ?? null;
  const firstNameFromMeta = data.user?.user_metadata?.firstName ?? data.user?.user_metadata?.first_name ?? null;
  const lastNameFromMeta = data.user?.user_metadata?.lastName ?? data.user?.user_metadata?.last_name ?? null;
  const derivedNames = deriveNamesFromUsername(username);

  const userDetails: UserDetails = {
    username,
    email,
    firstName: firstNameFromMeta ?? derivedNames.firstName,
    lastName: lastNameFromMeta ?? derivedNames.lastName,
  };

  if (username || email) {
    await storage.set(STORAGE_KEYS.USER, userDetails);
  }
  if (token) {
    await storage.set(STORAGE_KEYS.TOKEN, token);
  }

  return username;
};

export const signUp = async (payload: SignupFormData): Promise<SignUpResponse> => {
  try {
    const fullName = `${payload.firstName} ${payload.lastName}`;

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email: payload.email,
      password: payload.password,
      username: fullName,
    });

    const data = response.data;

    if (!data.success) {
      return {
        username: null,
        error: data.message || 'Registration failed',
      };
    }

    return {
      username: fullName,
      error: null,
    };
  } catch (error) {
    return {
      username: null,
      error: handleApiError(error),
    };
  }
};

export const validateToken = async (): Promise<ValidateTokenResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.VALIDATE);
    const data = response.data;

    if (!data.success) {
      return {
        valid: false,
        error: data.message || 'Token validation failed',
      };
    }
    console.log('Token validated successfully.');
    return {
      valid: true,
    };
  } catch (error) {
    return {
      valid: false,
      error: handleApiError(error),
    };
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.LOGOUT);
    const data = response.data;

    if (!data.success) {
      return {
        status: false,
        error: data.message || 'Logout failed',
      };
    }
    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
      error: handleApiError(error),
    };
  }
};
