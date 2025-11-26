import { ReactNode } from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  icon: ReactNode;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({
  id,
  name,
  type,
  label,
  value,
  placeholder,
  autoComplete,
  icon,
  error,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="login-field">
      <label htmlFor={id} className="login-label">
        {label}
      </label>
      <div className="login-input-container">
        <div className="login-input-icon">{icon}</div>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`login-input ${error ? 'login-input-error' : ''}`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="login-field-error">{error}</p>}
    </div>
  );
};
