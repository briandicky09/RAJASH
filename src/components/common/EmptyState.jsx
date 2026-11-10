import React from 'react';
import { FolderOpen } from '@phosphor-icons/react';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'Belum ada data tercatat',
  description = 'Data yang Anda tambahkan atau cari akan ditampilkan di sini.',
  actionLabel,
  onAction
}) {
  return (
    <div className="text-center py-5 px-3">
      <div
        className="d-inline-flex align-items-center justify-content-center mb-3"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'var(--rj-bg)',
          border: '1px solid var(--rj-border)',
          color: 'var(--rj-text-secondary)'
        }}
      >
        <Icon size={24} weight="regular" />
      </div>
      <h3 style={{ fontSize: '0.975rem', fontWeight: 600, marginBottom: '0.35rem' }}>
        {title}
      </h3>
      <p
        className="mx-auto mb-3"
        style={{
          fontSize: '0.85rem',
          color: 'var(--rj-text-secondary)',
          maxWidth: '400px'
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-rj-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

