import React from 'react';
import { Drop } from '@phosphor-icons/react';

export default function BrandLogo({ size = 34, showSubtitle = true }) {
  return (
    <div className="d-inline-flex align-items-center gap-2 text-decoration-none">
      <div
        className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '8px',
          backgroundColor: 'var(--rj-primary)',
          color: 'var(--rj-white)'
        }}
      >
        <Drop size={Math.round(size * 0.56)} weight="fill" />
      </div>
      <div className="d-flex flex-column">
        <span
          style={{
            fontWeight: 700,
            fontSize: '0.975rem',
            letterSpacing: '-0.02em',
            color: 'var(--rj-text-primary)',
            lineHeight: 1.15
          }}
        >
          RAJASH
        </span>
        {showSubtitle && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              color: 'var(--rj-text-secondary)',
              lineHeight: 1.2
            }}
          >
            Keuangan & Piutang
          </span>
        )}
      </div>
    </div>
  );
}

