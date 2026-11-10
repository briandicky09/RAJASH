import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-3"
      style={{ borderTop: '1px solid var(--rj-border)' }}
    >
      <div style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}>
        Menampilkan <span className="fw-semibold text-dark">{startItem}</span> sampai{' '}
        <span className="fw-semibold text-dark">{endItem}</span> dari{' '}
        <span className="fw-semibold text-dark">{totalItems}</span> data
      </div>

      <div className="d-flex align-items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-rj-secondary py-1 px-2"
          aria-label="Halaman sebelumnya"
        >
          <CaretLeft size={15} />
          <span className="d-none d-sm-inline">Sebelumnya</span>
        </button>

        <span
          className="px-2 font-tabular"
          style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}
        >
          Hal. {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-rj-secondary py-1 px-2"
          aria-label="Halaman berikutnya"
        >
          <span className="d-none d-sm-inline">Berikutnya</span>
          <CaretRight size={15} />
        </button>
      </div>
    </div>
  );
}

