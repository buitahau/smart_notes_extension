import apiClient from './api-client';
import { API_ENDPOINTS } from '@utils/constants';
import type {  UpdateProfilePayload, } from '@types/profile';
import { UserDetails } from '@types/login';
import { UserDetailsResponse } from '@types/login/login';

class ProfileService {
  async updateProfile(payload: UpdateProfilePayload): Promise<UserDetails> {
    const response = await apiClient.put<UserDetailsResponse>(API_ENDPOINTS.USER.ME, payload);

    if (!response.data.success || !response.data.user) {
      throw new Error(response.data.error || 'Failed to update profile');
    }

    return response.data.user;
  }
}

export const profileService = new ProfileService();
