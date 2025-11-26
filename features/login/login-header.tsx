import { Lock } from 'lucide-react';

export const LoginHeader = () => {
  return (
    <div className="login-header">
      <div className="login-icon-container">
        <Lock className="login-icon" />
      </div>
      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">Sign in to access your account</p>
    </div>
  );
};
