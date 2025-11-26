interface SignupFooterProps {
  onSignIn?: () => void;
}

export function SignupFooter({ onSignIn }: SignupFooterProps) {
  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSignIn) {
      onSignIn();
    }
  };

  return (
    <div className="signup-footer">
      <p className="signup-footer-text">
        Already have an account?{' '}
        <a href="#" className="signup-signin-link" onClick={handleSignInClick}>
          Sign in
        </a>
      </p>
    </div>
  );
}
