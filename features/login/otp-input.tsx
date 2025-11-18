import { useRef } from 'react';

interface OtpInputProps {
  values: string[];
  length?: number;
  onChange: (index: number, value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const OtpInput = ({ values, length = 6, onChange, disabled, error }: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, rawValue: string) => {
    if (disabled) {
      return;
    }

    const value = rawValue.replace(/[^0-9]/g, '').slice(-1);
    onChange(index, value);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    event.preventDefault();
    const pasted = event.clipboardData.getData('text') || '';
    const digits = pasted.replace(/[^0-9]/g, '');

    if (!digits) {
      return;
    }

    for (let offset = 0; offset < digits.length; offset += 1) {
      const targetIndex = index + offset;
      if (targetIndex >= length) {
        break;
      }
      onChange(targetIndex, digits[offset]);
    }

    const focusIndex = Math.min(index + digits.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === 'Backspace' && !values[index] && index > 0) {
      onChange(index - 1, '');
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="login-otp-field">
      <label className="login-label">Verification code</label>
      <div className="login-otp-inputs">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={`login-otp-input ${error ? 'login-input-error' : ''}`}
            value={values[index] ?? ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            disabled={disabled}
          />
        ))}
      </div>
      {error && <p className="login-field-error">{error}</p>}
    </div>
  );
};
