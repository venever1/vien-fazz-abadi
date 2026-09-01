import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: readonly SelectOption[];
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const Select = ({
  label,
  options,
  hint,
  error,
  required = false,
  placeholder,
  id,
  className = '',
  ...rest
}: SelectProps) => {
  const inputId = id || `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const classes = [
    'field__select',
    error ? 'field__select--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
        {required ? ' *' : ''}
      </label>
      <div className="field__select-wrapper">
        <select
          id={inputId}
          className={classes}
          aria-invalid={!!error}
          required={required}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
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
