import React, { useState } from 'react';
import { formatRupiah, formatTanggalIndonesia } from '../../utils/formatters';

/**
 * FinancialBarChart - Grafik perbandingan Pemasukan Kas, Penjualan Kredit, dan Pengeluaran
 * Menggunakan warna Primary Blue (#2563EB), Deep Blue (#1D4ED8), dan Neutral Slate (#94A3B8)
 * Dilengkapi tooltip informatif yang aksesibel.
 */
export default function FinancialBarChart({ series = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!series || series.length === 0) {
    return (
      <div
        className="text-center py-5"
        style={{ fontSize: '0.85rem', color: 'var(--rj-text-secondary)' }}
      >
        Belum ada data transaksi pada periode ini untuk ditampilkan pada grafik.
      </div>
    );
  }

  const maxValue = Math.max(
    100000,
    ...series.map((d) => Math.max(Number(d.cashIn || 0) + Number(d.creditSales || 0), Number(d.expense || 0)))
  );

  return (
    <div>
      {/* Legenda Grafik */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex flex-wrap align-items-center gap-3" style={{ fontSize: '0.78rem' }}>
          <div className="d-inline-flex align-items-center gap-2">
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                backgroundColor: '#2563EB',
                display: 'inline-block'
              }}
            />
            <span style={{ color: 'var(--rj-text-secondary)', fontWeight: 500 }}>
              Kas Diterima (Tunai + Cicilan)
            </span>
          </div>
          <div className="d-inline-flex align-items-center gap-2">
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                backgroundColor: '#93C5FD',
                display: 'inline-block'
              }}
            />
            <span style={{ color: 'var(--rj-text-secondary)', fontWeight: 500 }}>
              Penjualan Kredit (Piutang Baru)
            </span>
          </div>
          <div className="d-inline-flex align-items-center gap-2">
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                backgroundColor: '#475569',
                display: 'inline-block'
              }}
            />
            <span style={{ color: 'var(--rj-text-secondary)', fontWeight: 500 }}>
              Pengeluaran Operasional
            </span>
          </div>
        </div>
      </div>

      {/* Tooltip / Info Bar Aktif */}
      <div
        className="px-3 py-2 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2"
        style={{
          backgroundColor: 'var(--rj-bg)',
          border: '1px solid var(--rj-border)',
          borderRadius: '8px',
          minHeight: '42px',
          fontSize: '0.8rem'
        }}
      >
        {hoveredIdx !== null && series[hoveredIdx] ? (
          <>
            <span className="fw-semibold" style={{ color: 'var(--rj-text-primary)' }}>
              {formatTanggalIndonesia(series[hoveredIdx].date)}
            </span>
            <div className="d-flex flex-wrap gap-3 font-tabular">
              <span>
                Kas Diterima:{' '}
                <strong style={{ color: '#2563EB' }}>
                  {formatRupiah(series[hoveredIdx].cashIn)}
                </strong>
              </span>
              <span>
                Kredit:{' '}
                <strong style={{ color: '#1D4ED8' }}>
                  {formatRupiah(series[hoveredIdx].creditSales)}
                </strong>
              </span>
              <span>
                Pengeluaran:{' '}
                <strong style={{ color: '#111827' }}>
                  {formatRupiah(series[hoveredIdx].expense)}
                </strong>
              </span>
            </div>
          </>
        ) : (
          <span style={{ color: 'var(--rj-text-secondary)' }}>
            Arahkan kursor atau ketuk batang grafik untuk melihat rincian nominal per tanggal.
          </span>
        )}
      </div>

      {/* Area Batang Grafik */}
      <div
        className="d-flex align-items-end justify-content-between gap-2 pt-3 pb-2 px-2"
        style={{
          height: '220px',
          borderBottom: '1px solid var(--rj-border)'
        }}
      >
        {series.map((item, idx) => {
          const cashHeight = Math.max(4, Math.round((Number(item.cashIn || 0) / maxValue) * 160));
          const creditHeight =
            Number(item.creditSales || 0) > 0
              ? Math.max(4, Math.round((Number(item.creditSales || 0) / maxValue) * 160))
              : 0;
          const expenseHeight =
            Number(item.expense || 0) > 0
              ? Math.max(4, Math.round((Number(item.expense || 0) / maxValue) * 160))
              : 4;

          const isSelected = hoveredIdx === idx;

          return (
            <div
              key={item.date}
              tabIndex={0}
              role="button"
              aria-label={`Data tanggal ${formatTanggalIndonesia(item.date)}: Kas diterima ${formatRupiah(item.cashIn)}, Penjualan kredit ${formatRupiah(item.creditSales)}, Pengeluaran ${formatRupiah(item.expense)}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(idx)}
              onBlur={() => setHoveredIdx(null)}
              onClick={() => setHoveredIdx(idx)}
              className="d-flex flex-column align-items-center justify-content-end h-100"
              style={{
                flex: 1,
                cursor: 'pointer',
                backgroundColor: isSelected ? 'var(--rj-primary-subtle)' : 'transparent',
                borderRadius: '8px',
                padding: '4px 2px',
                transition: 'background-color 150ms ease'
              }}
            >
              <div className="d-flex align-items-end justify-content-center gap-1 w-100" style={{ height: '168px' }}>
                {/* Batang Pemasukan (Kas + Kredit bertumpuk) */}
                <div
                  className="d-flex flex-column justify-content-end"
                  style={{ width: '16px', maxWidth: '35%' }}
                >
                  {creditHeight > 0 && (
                    <div
                      title={`Kredit: ${formatRupiah(item.creditSales)}`}
                      style={{
                        height: `${creditHeight}px`,
                        backgroundColor: '#93C5FD',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px'
                      }}
                    />
                  )}
                  <div
                    title={`Kas Diterima: ${formatRupiah(item.cashIn)}`}
                    style={{
                      height: `${cashHeight}px`,
                      backgroundColor: '#2563EB',
                      borderTopLeftRadius: creditHeight === 0 ? '4px' : '0',
                      borderTopRightRadius: creditHeight === 0 ? '4px' : '0'
                    }}
                  />
                </div>

                {/* Batang Pengeluaran */}
                <div
                  title={`Pengeluaran: ${formatRupiah(item.expense)}`}
                  style={{
                    width: '16px',
                    maxWidth: '35%',
                    height: `${expenseHeight}px`,
                    backgroundColor: Number(item.expense || 0) > 0 ? '#475569' : '#E2E8F0',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px'
                  }}
                />
              </div>

              <span
                className="mt-2 font-tabular text-truncate"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'var(--rj-primary)' : 'var(--rj-text-secondary)'
                }}
              >
                {formatTanggalIndonesia(item.date, { shortMonth: true }).replace(' 2026', '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

