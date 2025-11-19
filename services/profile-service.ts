import apiClient from './api-client';
import { API_ENDPOINTS } from '@utils/constants';
import type { UserProfile, UpdateProfilePayload, UserProfileResponse } from '@types/profile';

class ProfileService {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfileResponse>(API_ENDPOINTS.PROFILE.BASE);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to load profile');
    }

    return response.data.data;
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response = await apiClient.put<UserProfileResponse>(API_ENDPOINTS.PROFILE.BASE, payload);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update profile');
    }

    return response.data.data;
  }
}

export const profileService = new ProfileService();
