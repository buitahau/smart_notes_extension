export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
}

export interface UserProfileResponse {
  success: boolean;
  message?: string;
  data?: UserProfile;
}
