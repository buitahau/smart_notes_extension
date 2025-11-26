import { LoginFormData, LoginErrors } from '@types';

export const validateLoginForm = (formData: LoginFormData): LoginErrors => {
  const errors: LoginErrors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }

  return errors;
};
