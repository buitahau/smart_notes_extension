import { UserPlus } from 'lucide-react';

export function SignupHeader() {
  return (
    <div className="signup-header">
      <div className="signup-icon-container">
        <UserPlus className="signup-icon" />
      </div>
      <h2 className="signup-title">Create your account</h2>
      <p className="signup-subtitle">Join us and start your journey</p>
    </div>
  );
}
