import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

export const FieldWrapper = ({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
}: FieldWrapperProps) => {
  return (
    <div className="field">
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
};

export type TextInputType = 'text' | 'number' | 'date' | 'month' | 'email' | 'tel';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  inputType?: TextInputType;
}

export const TextInput = ({
  label,
  hint,
  error,
  required = false,
  inputType = 'text',
  id,
  className = '',
  ...rest
}: TextInputProps) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const classes = [
    'field__input',
    error ? 'field__input--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <input
        id={inputId}
        type={inputType === 'number' ? 'number' : inputType}
        className={classes}
        aria-invalid={!!error}
        required={required}
        {...rest}
      />
    </FieldWrapper>
  );
};

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const TextArea = ({
  label,
  hint,
  error,
  required = false,
  id,
  className = '',
  ...rest
}: TextAreaProps) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const classes = ['field__textarea', error ? 'field__input--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
      <textarea
        id={inputId}
        className={classes}
        aria-invalid={!!error}
        required={required}
        rows={3}
        {...rest}
      />
    </FieldWrapper>
  );
};
