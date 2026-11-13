import React from 'react';
import { formatRupiah } from '../../utils/formatters';

/**
 * SummaryCard - Kartu metrik ringkasan keuangan yang minimalis dan konsisten
 * Sesuai Bagian 7.3.C Master Prompt:
 * - Tidak menggunakan warna berbeda-beda untuk setiap kartu
 * - Desain konsisten, putih dominan, border halus, nominal Rupiah tabular
 */
export default function SummaryCard({
  label,
  amount,
  isCurrency = true,
  periodNote,
  subDetail,
  icon: Icon,
  highlightPrimary = false
}) {
  return (
    <div
      className="rj-card h-100 p-3 p-md-4 d-flex flex-column justify-content-between"
      style={{
        borderColor: highlightPrimary ? 'var(--rj-primary-border)' : 'var(--rj-border)',
        backgroundColor: 'var(--rj-white)'
      }}
    >
      <div>
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--rj-text-secondary)',
              minWidth: 0
            }}
          >
            {label}
          </span>
          {Icon && (
            <span
              className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: highlightPrimary ? 'var(--rj-primary-subtle)' : 'var(--rj-bg)',
                color: highlightPrimary ? 'var(--rj-primary)' : 'var(--rj-text-secondary)',
                border: '1px solid var(--rj-border)'
              }}
            >
              <Icon size={17} weight="regular" />
            </span>
          )}
        </div>
        <div
          className="font-tabular"
          style={{
            fontSize: 'clamp(1.1rem, 0.95rem + 0.9vw, 1.5rem)',
            fontWeight: 700,
            color: 'var(--rj-text-primary)',
            lineHeight: 1.25,
            overflowWrap: 'anywhere'
          }}
        >
          {isCurrency ? formatRupiah(amount) : amount}
        </div>
      </div>

      {(periodNote || subDetail) && (
        <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--rj-border-subtle)' }}>
          {subDetail && (
            <div
              style={{
                fontSize: '0.775rem',
                fontWeight: 500,
                color: 'var(--rj-text-primary)'
              }}
            >
              {subDetail}
            </div>
          )}
          {periodNote && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--rj-text-secondary)'
              }}
            >
              {periodNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

