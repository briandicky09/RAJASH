import React from 'react';

export default function FilterDropdown({
  id,
  label,
  value,
  onChange,
  options = [],
  ariaLabel
}) {
  return (
    <div className="d-flex flex-column" style={{ flex: '1 1 150px', minWidth: 0 }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--rj-text-secondary)',
            marginBottom: '4px'
          }}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel || label || 'Filter data'}
        className="rj-form-select"
        style={{ fontSize: '0.85rem' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

