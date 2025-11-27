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
import { UserDetailsResponse } from '@types/login/login';

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

    const token = data.session?.access_token;
    if (token) {
      console.log("verifyOtp")
      await storage.set(STORAGE_KEYS.TOKEN, token);
    } else {
      console.warn('Login succeeded but token missing in response.');
    }

    const userDetails = token ? await fetchUserDetails(token) : null;
    if (!userDetails) {
      console.error('Can not fetch user detail of email ' + payload.email);
      return {
        username: payload.email,
        error: null,
      };
    }
    const username = await updateStorage(userDetails);

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

const fetchUserDetails = async (token: string | null): Promise<UserDetails | null> => {
  try {
    const response = await apiClient.get<UserDetailsResponse>(API_ENDPOINTS.USER.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userDetailsResponse = response.data;
    if (!userDetailsResponse.success) {
      console.warn('Failed to fetch user details:', userDetailsResponse.error);
      return null;
    }
    return userDetailsResponse.user;
  } catch (error) {
    console.warn('Failed to fetch user details:', error);
    return null;
  }
};

const updateStorage = async (userDetails: UserDetails): Promise<string | null> => {
  const username =
    userDetails.firstName || userDetails.lastName
      ? `${userDetails.firstName ?? ''} ${userDetails.lastName ?? ''}`.trim()
      : userDetails.email;

  await storage.set(STORAGE_KEYS.USER, userDetails);
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
