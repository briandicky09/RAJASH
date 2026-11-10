import React from 'react';
import { Warning } from '@phosphor-icons/react';
import Modal from './Modal';

/**
 * ConfirmationDialog - Dialog konfirmasi untuk tindakan penting atau peringatan potensi duplikasi (FR-06)
 */
export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message,
  details = [],
  confirmLabel = 'Lanjutkan',
  cancelLabel = 'Batal',
  isSubmitting = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="480px"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-rj-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="btn-rj-primary"
          >
            {isSubmitting ? 'Memproses...' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="d-flex align-items-start gap-3">
        <div
          className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--rj-status-warning-bg)',
            color: 'var(--rj-status-warning-text)',
            border: '1px solid var(--rj-status-warning-border)'
          }}
        >
          <Warning size={20} weight="fill" />
        </div>
        <div style={{ flex: 1 }}>
          <p className="mb-2" style={{ fontSize: '0.9rem', color: 'var(--rj-text-primary)' }}>
            {message}
          </p>
          {details.length > 0 && (
            <div
              className="p-3 mt-2"
              style={{
                backgroundColor: 'var(--rj-bg)',
                border: '1px solid var(--rj-border)',
                borderRadius: '8px',
                fontSize: '0.8125rem'
              }}
            >
              <div className="fw-semibold mb-1" style={{ color: 'var(--rj-text-primary)' }}>
                Transaksi Serupa yang Ditemukan:
              </div>
              {details.map((item, idx) => (
                <div
                  key={idx}
                  className="py-1"
                  style={{
                    color: 'var(--rj-text-secondary)',
                    borderTop: idx > 0 ? '1px solid var(--rj-border)' : 'none'
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

