import React from 'react';
import { Drop } from '@phosphor-icons/react';

export default function BrandLogo({ size = 32, showSubtitle = true, inverted = false }) {
  return (
    <div className="d-inline-flex align-items-center gap-2 text-decoration-none" style={{ userSelect: 'none' }}>
      <div
        className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '8px',
          backgroundColor: inverted ? '#FFFFFF' : 'var(--wl-brand-100)',
          color: inverted ? 'var(--wl-brand-100)' : '#FFFFFF'
        }}
      >
        <Drop size={Math.round(size * 0.58)} weight="fill" />
      </div>
      <div className="d-flex flex-column" style={{ lineHeight: 1 }}>
        <span
          style={{
            fontFamily: 'var(--wl-display-font)',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.04em',
            color: inverted ? '#FFFFFF' : 'var(--wl-grey-100)',
            lineHeight: 1
          }}
        >
          rajash
        </span>
        {showSubtitle && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: inverted ? 'rgba(249, 248, 246, 0.72)' : 'var(--wl-grey-60)',
              lineHeight: 1.1,
              marginTop: '2px'
            }}
          >
            Keuangan &amp; Piutang
          </span>
        )}
      </div>
    </div>
  );
}
