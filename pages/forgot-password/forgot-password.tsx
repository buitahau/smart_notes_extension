import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { InputField, NotificationMessage } from '@features/login';
import { useMiniRouter } from '@context/router-context';
import { NotificationMessageProps } from '@types/login';
import '../login/login.css';
import './forgot-password.css';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function ForgotPassword() {
  const { navigate } = useMiniRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationMessageProps | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('Email is required');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError(undefined);
    setNotification(null);
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setNotification({
      type: 'success',
      message: `If an account exists for ${trimmedEmail}, you'll receive reset instructions shortly.`,
    });
  };

  return (
    <div className="forgot-password-wrapper">
      <button className="forgot-password-back" onClick={() => navigate('login')}>
        <ArrowLeft className="forgot-password-back-icon" />
        Back to login
      </button>

      <div className="login-container forgot-password-card">
        <div className="forgot-password-header">
          <div className="forgot-password-icon">
            <Mail className="forgot-password-icon-svg" />
          </div>
          <h2>Reset your password</h2>
          <p>Enter the email associated with your account and we&apos;ll send you a reset link.</p>
        </div>

        {notification && (
          <NotificationMessage type={notification.type} message={notification.message} />
        )}

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <InputField
            id="forgot-password-email"
            name="email"
            type="email"
            label="Email"
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            icon={<Mail className="login-input-icon-svg" />}
            error={emailError}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
