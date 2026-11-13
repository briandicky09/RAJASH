import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';

/**
 * Modal - Komponen dialog aksesibel dengan dukungan tombol Escape dan klik latar
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '520px'
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="rj-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rj-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="rj-modal-dialog" style={{ maxWidth }}>
        <div className="rj-modal-header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2
              id="rj-modal-title"
              className="mb-0"
              style={{ fontSize: '1.05rem', fontWeight: 600, overflowWrap: 'break-word' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="mb-0 mt-1"
                style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-rj-ghost p-1 flex-shrink-0"
            aria-label="Tutup dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rj-modal-body">{children}</div>

        {footer && <div className="rj-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

