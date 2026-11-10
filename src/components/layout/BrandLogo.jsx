import React from 'react';
import { Drop } from '@phosphor-icons/react';

export default function BrandLogo({ size = 36, showSubtitle = true, inverted = false }) {
  return (
    <div className="d-inline-flex align-items-center gap-2 text-decoration-none">
      <div
        className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '10px',
          backgroundColor: inverted ? '#FFFFFF' : 'var(--wl-brand-100)',
          color: inverted ? 'var(--wl-brand-100)' : '#FFFFFF'
        }}
      >
        <Drop size={Math.round(size * 0.56)} weight="fill" />
      </div>
      <div className="d-flex flex-column">
        <span
          style={{
            fontFamily: 'var(--wl-display-font)',
            fontWeight: 700,
            fontSize: '1.08rem',
            letterSpacing: '-0.03em',
            color: inverted ? '#FFFFFF' : 'var(--wl-grey-100)',
            lineHeight: 1.1
          }}
        >
          RAJASH
        </span>
        {showSubtitle && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              color: inverted ? 'rgba(249, 248, 246, 0.72)' : 'var(--wl-grey-80)',
              lineHeight: 1.2
            }}
          >
            Keuangan &amp; Piutang
          </span>
        )}
      </div>
    </div>
  );
}
