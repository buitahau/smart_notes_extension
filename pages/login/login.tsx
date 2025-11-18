import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { useLoginForm } from '@features/login';
import { LoginHeader, InputField, ErrorMessage, NotificationMessage, OtpInput } from '@features/login';
import './login.css';
import { useMiniRouter } from '@context/router-context';
import { signInWithOtp, verifyOtp as verifyOtpRequest } from '@services/auth-service';
import { NotificationMessageProps } from '@types/login';

export function Login() {
  const { params } = useMiniRouter();
  const { formData, errors, isLoading, isOtpSent, updateField, requestOtp, verifyOtp, resetOtp } =
    useLoginForm();
  const [notification, setNotification] = useState<NotificationMessageProps | null>(null);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));

  // Handle notification params
  useEffect(() => {
    if (params?.notification) {
      showNotification(params.notification);
    }
  }, [params]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      const sent = await requestOtp(signInWithOtp);
      if (sent) {
        setOtpValues(Array(6).fill(''));
        resetOtp();
      }
      return;
    }

    await verifyOtp(verifyOtpRequest);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);
  };

  const handleOtpChange = (index: number, value: string) => {
    setOtpValues((prev) => {
      const next = [...prev];
      next[index] = value;
      updateField('otp', next.join(''));
      return next;
    });
  };

  // Function to show notification (can be called from signup or other components)
  const showNotification = (payload: NotificationMessageProps) => {
    setNotification(payload);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="login-container">
      <LoginHeader />

      {notification && (
        <NotificationMessage type={notification.type} message={notification.message} />
      )}

      {errors.general && <ErrorMessage message={errors.general} />}

      <form onSubmit={handleFormSubmit} className="login-form">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="login-input-icon-svg" />}
          error={errors.email}
          onChange={handleInputChange}
        />

        {isOtpSent && (
          <>
            <p className="login-otp-helper">Enter the 6-digit code sent to your email.</p>
            <OtpInput values={otpValues} onChange={handleOtpChange} disabled={isLoading} error={errors.otp} />
          </>
        )}

        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? 'Please wait...' : isOtpSent ? 'Verify code' : 'Send code'}
        </button>
      </form>

    </div>
  );
}
