export interface LoginFormData {
  email: string;
  otp: string;
}

export interface LoginErrors {
  email?: string;
  otp?: string;
  general?: string;
}

export interface LoginResponse {
  username: any | null;
  error: string | null;
}

export interface LogoutResponse {
  status: boolean;
  error?: string | null;
}

export interface ValidateTokenResponse {
  valid: boolean;
  error?: string;
}

export interface UserDetails {
  username: string | null;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface NotificationMessageProps {
  type: 'success' | 'error';
  message: string;
}

export interface OtpRequestResponse {
  success: boolean;
  error?: string | null;
}
