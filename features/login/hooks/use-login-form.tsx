import { useEffect, useState } from 'react';
import { LoginFormData, LoginErrors, LoginResponse, OtpRequestResponse } from '@types/login';
import { validateLoginForm } from '@features/login/utils';
import { useMiniRouter } from '@context/router-context';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';

export const useLoginForm = () => {
  const { navigate } = useMiniRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    otp: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const loadPendingOtp = async () => {
      const pending = await storage.get<{ email?: string }>(STORAGE_KEYS.PENDING_OTP_LOGIN);
      if (pending?.email) {
        setFormData((prev) => ({ ...prev, email: pending.email }));
        setIsOtpSent(true);
      }
    };

    loadPendingOtp();
  }, []);

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    if (field === 'email') {
      setErrors((prev) => ({ ...prev, general: undefined }));
      if (isOtpSent) {
        setIsOtpSent(false);
        setFormData((prev) => ({ ...prev, otp: '' }));
        void storage.remove(STORAGE_KEYS.PENDING_OTP_LOGIN);
      }
    }
  };

  const requestOtp = async (
    handler: (email: string) => Promise<OtpRequestResponse>
  ): Promise<boolean> => {
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const result = await handler(formData.email);
      if (!result.success) {
        setErrors({
          general: result.error || 'Failed to send verification code',
        });
        return false;
      }

      await storage.set(STORAGE_KEYS.PENDING_OTP_LOGIN, { email: formData.email, timestamp: Date.now() });
      setIsOtpSent(true);
      return true;
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to send verification code',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (handler: (data: LoginFormData) => Promise<LoginResponse>) => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        otp: 'Enter the 6-digit code sent to your email',
      }));
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const response = await handler(formData);
      if (!response.error) {
        await storage.remove(STORAGE_KEYS.PENDING_OTP_LOGIN);
        navigate('home');
      } else {
        setErrors({
          general: response.error || 'Invalid or expired code',
        });
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to verify code',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetOtp = () => {
    setFormData((prev) => ({ ...prev, otp: '' }));
    setErrors((prev) => ({ ...prev, otp: undefined }));
  };

  return {
    formData,
    errors,
    isLoading,
    isOtpSent,
    updateField,
    requestOtp,
    verifyOtp,
    resetOtp,
  };
};
