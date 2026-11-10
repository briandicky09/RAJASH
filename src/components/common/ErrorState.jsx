import React from 'react';
import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react';

export default function ErrorState({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kendala saat mengambil data. Silakan periksa koneksi atau coba lagi.',
  onRetry
}) {
  return (
    <div
      className="rj-card p-4 text-center my-3"
      role="alert"
      style={{ borderColor: 'var(--rj-status-danger-border)' }}
    >
      <div
        className="d-inline-flex align-items-center justify-content-center mb-3"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: 'var(--rj-status-danger-bg)',
          color: 'var(--rj-status-danger-text)'
        }}
      >
        <WarningCircle size={22} weight="fill" />
      </div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }}>{title}</h3>
      <p
        className="mx-auto mb-3"
        style={{ fontSize: '0.85rem', color: 'var(--rj-text-secondary)', maxWidth: '420px' }}
      >
        {message}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-rj-secondary">
          <ArrowClockwise size={16} />
          <span>Muat Ulang Data</span>
        </button>
      )}
    </div>
  );
}

