import React from 'react';

export default function PageContainer({
  title,
  subtitle,
  headerActions,
  children
}) {
  return (
    <main id="main-content" className="rj-page-container">
      {(title || subtitle || headerActions) && (
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
          <div>
            {title && (
              <h2
                className="mb-1"
                style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)', fontWeight: 700 }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mb-0"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--rj-text-secondary)',
                  maxWidth: '64ch'
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && <div className="d-flex flex-wrap gap-2">{headerActions}</div>}
        </div>
      )}
      {children}
    </main>
  );
}

