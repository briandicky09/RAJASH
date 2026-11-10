import React from 'react';

/**
 * StatusBadge - Indikator status minimalis dan mudah dibedakan secara aksesibel
 */
export default function StatusBadge({ status, variant }) {
  const normalized = String(status || '').toLowerCase();

  let computedVariant = variant;
  if (!computedVariant) {
    if (
      normalized.includes('lunas') && !normalized.includes('belum') ||
      normalized === 'tunai' ||
      normalized === 'tunai diterima' ||
      normalized === 'kredit lunas'
    ) {
      computedVariant = 'success';
    } else if (
      normalized.includes('belum lunas') ||
      normalized.includes('piutang') ||
      normalized === 'kredit'
    ) {
      computedVariant = 'warning';
    } else if (normalized.includes('gagal') || normalized.includes('jatuh tempo')) {
      computedVariant = 'danger';
    } else if (normalized.includes('pemasukan')) {
      computedVariant = 'info';
    } else {
      computedVariant = 'neutral';
    }
  }

  return <span className={`rj-badge rj-badge-${computedVariant}`}>{status}</span>;
}

