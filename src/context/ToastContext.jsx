import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, type = 'success', duration = 4000 }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          marginLeft: 'auto',
          zIndex: 1090,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((t) => {
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';
          const borderColor = isError
            ? 'var(--rj-status-danger-border)'
            : isWarning
            ? 'var(--rj-status-warning-border)'
            : 'var(--rj-border)';
          const iconColor = isError
            ? 'var(--rj-status-danger-text)'
            : isWarning
            ? 'var(--rj-status-warning-text)'
            : 'var(--rj-primary)';

          return (
            <div
              key={t.id}
              role="status"
              className="rj-card p-3"
              style={{
                pointerEvents: 'auto',
                backgroundColor: 'var(--rj-white)',
                borderColor,
                boxShadow: 'var(--rj-shadow-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{ color: iconColor, marginTop: '2px', flexShrink: 0 }}>
                {isError ? (
                  <WarningCircle size={20} weight="fill" />
                ) : isWarning ? (
                  <Info size={20} weight="fill" />
                ) : (
                  <CheckCircle size={20} weight="fill" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {t.title && (
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: 'var(--rj-text-primary)',
                      marginBottom: t.message ? '2px' : 0
                    }}
                  >
                    {t.title}
                  </div>
                )}
                {t.message && (
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--rj-text-secondary)',
                      lineHeight: 1.45
                    }}
                  >
                    {t.message}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="btn-rj-ghost p-1"
                aria-label="Tutup notifikasi"
                style={{ marginTop: '-2px', marginRight: '-4px' }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast harus digunakan di dalam ToastProvider');
  }
  return ctx;
}

