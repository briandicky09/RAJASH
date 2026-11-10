import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import { formatThousandDigits, parseRupiahInput } from '../../utils/formatters';

/**
 * CurrencyInput - Input khusus mata uang Rupiah (Rp) dengan pemisah titik ribuan otomatis
 */
export default function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = '0',
  error,
  helperText,
  required = false,
  disabled = false,
  quickAmounts = []
}) {
  const inputId = id || `currency-${String(label || '').toLowerCase().replace(/\s+/g, '-')}`;
  const displayValue = formatThousandDigits(value);

  const handleInputChange = (e) => {
    const rawNumeric = parseRupiahInput(e.target.value);
    onChange(rawNumeric);
  };

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

      <div className="position-relative d-flex align-items-center">
        <span
          className="position-absolute font-tabular"
          style={{
            left: '12px',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: 'var(--rj-text-secondary)',
            pointerEvents: 'none'
          }}
        >
          Rp
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`rj-form-control font-tabular ${error ? 'is-invalid' : ''}`}
          style={{ paddingLeft: '38px' }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        />
      </div>

      {quickAmounts.length > 0 && !disabled && (
        <div className="d-flex flex-wrap gap-1 mt-2">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onChange(amt)}
              className="btn-rj-secondary py-1 px-2 font-tabular"
              style={{ fontSize: '0.75rem' }}
            >
              Rp{formatThousandDigits(amt)}
            </button>
          ))}
        </div>
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

