import React from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Cari pelanggan atau keterangan...',
  ariaLabel = 'Pencarian transaksi'
}) {
  return (
    <div className="position-relative w-100">
      <MagnifyingGlass
        size={16}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--rj-text-secondary)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="rj-form-control"
        style={{
          paddingLeft: '36px',
          paddingRight: value ? '32px' : '12px',
          fontSize: '0.85rem'
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Bersihkan pencarian"
          className="btn-rj-ghost p-1"
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

