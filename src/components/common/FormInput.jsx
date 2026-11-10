import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';

/**
 * FormInput - Input formulir dengan label di atas input dan pesan validasi di bawah
 */
export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  as = 'input',
  rows = 3,
  children,
  ...rest
}) {
  const inputId = id || `field-${String(label || '').toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className="rj-form-label">
          {label}
          {required && (
            <span style={{ color: 'var(--rj-primary)', marginLeft: '3px' }} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={inputId}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`rj-form-control ${error ? 'is-invalid' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...rest}
        />
      ) : as === 'select' ? (
        <select
          id={inputId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`rj-form-select ${error ? 'is-invalid' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...rest}
        >
          {children}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`rj-form-control ${error ? 'is-invalid' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...rest}
        />
      )}

      {error ? (
        <div id={`${inputId}-error`} className="rj-form-error" role="alert">
          <WarningCircle size={14} weight="fill" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div id={`${inputId}-helper`} className="rj-form-helper">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}

