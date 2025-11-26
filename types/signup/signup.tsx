export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface SignupErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

export interface SignupProps {
  onSubmit?: (data: SignupFormData) => Promise<void>;
  onGoogleSignup?: () => void;
  onFacebookSignup?: () => void;
  onSignIn?: () => void;
}

export interface SignUpResponse {
  username: any | null;
  error: string | null;
}
