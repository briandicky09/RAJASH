import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellRinging, ArrowRight, CheckCircle, SortAscending } from '@phosphor-icons/react';
import { formatRupiah, formatTanggalIndonesia, getDaysElapsed } from '../../utils/formatters';
import StatusBadge from './StatusBadge';

/**
 * ReceivableReminderCard - Komponen Pengingat Piutang di dalam aplikasi (SRS 4.10: FR-RMD-01 s.d. 04)
 * - Menampilkan total piutang, tanggal tertua, dan lama tertunggak (FR-RMD-01)
 * - Mendukung pengurutan dari piutang terlama atau nominal terbesar (FR-RMD-03)
 * - Tanpa WhatsApp Gateway atau SMS otomatis (FR-RMD-04)
 */
export default function ReceivableReminderCard({
  activeReceivables = [],
  onSelectPay,
  compact = false,
  reminderHour = '21:00'
}) {
  const [sortBy, setSortBy] = useState('oldest'); // 'oldest' | 'largest'

  const unpaidList = activeReceivables
    .filter((r) => r.status === 'Belum Lunas' && Number(r.remaining_amount) > 0)
    .sort((a, b) => {
      if (sortBy === 'largest') {
        return Number(b.remaining_amount) - Number(a.remaining_amount);
      }
      return String(a.transaction_date).localeCompare(String(b.transaction_date));
    });

  if (unpaidList.length === 0) {
    return (
      <div className="rj-card p-3 p-md-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--rj-status-success-bg)',
              color: 'var(--rj-status-success-text)'
            }}
          >
            <CheckCircle size={20} weight="fill" />
          </div>
          <div>
            <h3 className="mb-0" style={{ fontSize: '0.925rem', fontWeight: 600 }}>
              Tidak Ada Pengingat Tagihan Aktif
            </h3>
            <p className="mb-0 mt-1" style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}>
              Seluruh piutang pelanggan saat ini telah lunas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalRemaining = unpaidList.reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0);
  const displayItems = compact ? unpaidList.slice(0, 3) : unpaidList;

  return (
    <div
      className="rj-card p-3 p-md-4"
      style={{ borderColor: 'var(--rj-primary-border)', backgroundColor: 'var(--rj-white)' }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-start align-items-sm-center gap-2" style={{ flex: '1 1 240px', minWidth: 0 }}>
          <span
            className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--rj-primary-subtle)',
              color: 'var(--rj-primary)'
            }}
          >
            <BellRinging size={18} weight="fill" />
          </span>
          <div style={{ minWidth: 0 }}>
            <h3 className="mb-0" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Pengingat Pemeriksaan Piutang Harian
            </h3>
            <p className="mb-0" style={{ fontSize: '0.78rem', color: 'var(--rj-text-secondary)' }}>
              Terdapat {unpaidList.length} tagihan belum lunas senilai total{' '}
              <strong className="font-tabular text-dark">{formatRupiah(totalRemaining)}</strong>{' '}
              (Jadwal evaluasi menjelang tutup operasional pukul {reminderHour} WIB).
            </p>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* FR-RMD-03: Urutkan dari piutang terlama atau terbesar */}
          <div
            className="d-inline-flex align-items-center gap-1 p-1"
            style={{
              backgroundColor: 'var(--rj-bg)',
              border: '1px solid var(--rj-border)',
              borderRadius: '8px'
            }}
          >
            <SortAscending size={14} className="ms-1 text-secondary" />
            <button
              type="button"
              onClick={() => setSortBy('oldest')}
              className={sortBy === 'oldest' ? 'btn-rj-primary py-1 px-2' : 'btn-rj-ghost py-1 px-2'}
              style={{ fontSize: '0.73rem' }}
            >
              Terlama
            </button>
            <button
              type="button"
              onClick={() => setSortBy('largest')}
              className={sortBy === 'largest' ? 'btn-rj-primary py-1 px-2' : 'btn-rj-ghost py-1 px-2'}
              style={{ fontSize: '0.73rem' }}
            >
              Terbesar
            </button>
          </div>

          {compact && (
            <Link to="/piutang" className="btn-rj-secondary py-1 px-3" style={{ fontSize: '0.78rem' }}>
              <span>Kelola Piutang</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      <div className="d-flex flex-column gap-2">
        {displayItems.map((rcv) => {
          const daysOld = getDaysElapsed(rcv.transaction_date);
          return (
            <div
              key={rcv.id}
              className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-2 px-3"
              style={{
                backgroundColor: 'var(--rj-bg)',
                border: '1px solid var(--rj-border)',
                borderRadius: '8px'
              }}
            >
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--rj-text-primary)' }}>
                  {rcv.customer_name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--rj-text-secondary)' }}>
                  Transaksi {formatTanggalIndonesia(rcv.transaction_date)}{' '}
                  <span className="fw-medium text-dark">
                    ({daysOld > 0 ? `Tertunggak ${daysOld} hari` : 'Hari ini'})
                  </span>
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-sm-end gap-2 gap-sm-3 ms-auto">
                <div className="text-sm-end">
                  <div style={{ fontSize: '0.72rem', color: 'var(--rj-text-secondary)' }}>
                    Sisa Tagihan
                  </div>
                  <div
                    className="font-tabular fw-bold"
                    style={{ fontSize: '0.875rem', color: 'var(--rj-text-primary)' }}
                  >
                    {formatRupiah(rcv.remaining_amount)}
                  </div>
                </div>

                <StatusBadge status={rcv.status} />

                {onSelectPay && (
                  <button
                    type="button"
                    onClick={() => onSelectPay(rcv)}
                    className="btn-rj-primary py-1 px-2"
                    style={{ fontSize: '0.775rem' }}
                  >
                    Catat Bayar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
