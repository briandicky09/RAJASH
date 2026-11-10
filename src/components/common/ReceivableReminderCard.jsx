import React from 'react';
import { Link } from 'react-router-dom';
import { BellRinging, ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { formatRupiah, formatTanggalIndonesia, getDaysElapsed } from '../../utils/formatters';
import StatusBadge from './StatusBadge';

/**
 * ReceivableReminderCard - Komponen Pengingat Piutang di dalam aplikasi (FR-08 & Bagian 7.3.G / 7.8)
 * Tanpa WhatsApp Gateway atau SMS otomatis (sesuai batasan ruang lingkup MVP).
 */
export default function ReceivableReminderCard({
  activeReceivables = [],
  onSelectPay,
  compact = false
}) {
  const unpaidList = activeReceivables.filter(
    (r) => r.status === 'Belum Lunas' && Number(r.remaining_amount) > 0
  );

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
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center"
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
          <div>
            <h3 className="mb-0" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Pengingat Pemeriksaan Piutang Harian
            </h3>
            <p className="mb-0" style={{ fontSize: '0.78rem', color: 'var(--rj-text-secondary)' }}>
              Terdapat {unpaidList.length} tagihan pelanggan belum lunas senilai total{' '}
              <strong className="font-tabular text-dark">{formatRupiah(totalRemaining)}</strong>{' '}
              (Evaluasi sebelum tutup buku operasional pukul 22.00 WIB).
            </p>
          </div>
        </div>

        {compact && (
          <Link to="/piutang" className="btn-rj-secondary py-1 px-3" style={{ fontSize: '0.8rem' }}>
            <span>Kelola Piutang</span>
            <ArrowRight size={14} />
          </Link>
        )}
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
              <div style={{ minWidth: '180px' }}>
                <div className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--rj-text-primary)' }}>
                  {rcv.customer_name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--rj-text-secondary)' }}>
                  Transaksi {formatTanggalIndonesia(rcv.transaction_date)}{' '}
                  {daysOld > 0 ? `(${daysOld} hari lalu)` : '(Hari ini)'}
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 ms-auto">
                <div className="text-end">
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

