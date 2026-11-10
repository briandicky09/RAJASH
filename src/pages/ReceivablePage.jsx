import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Notebook,
  CheckCircle,
  Clock,
  HandCoins,
  Eye
} from '@phosphor-icons/react';
import PageContainer from '../components/layout/PageContainer';
import SummaryCard from '../components/common/SummaryCard';
import DataTable from '../components/common/DataTable';
import SearchInput from '../components/common/SearchInput';
import FilterDropdown from '../components/common/FilterDropdown';
import DateFilter from '../components/common/DateFilter';
import FormInput from '../components/common/FormInput';
import CurrencyInput from '../components/common/CurrencyInput';
import StatusBadge from '../components/common/StatusBadge';
import ReceivableReminderCard from '../components/common/ReceivableReminderCard';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import {
  fetchReceivables,
  recordReceivablePayment
} from '../services/financeService';
import { formatRupiah, formatTanggalIndonesia } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Semua Status Tagihan' },
  { value: 'Belum Lunas', label: 'Belum Lunas (Tagihan Aktif)' },
  { value: 'Lunas', label: 'Lunas (Riwayat Selesai)' }
];

export default function ReceivablePage() {
  const { showToast } = useToast();

  // State Data & Filter
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Detail Piutang
  const [detailTarget, setDetailTarget] = useState(null);

  // State Modal Catat Pembayaran Piutang
  const [payTarget, setPayTarget] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payDate, setPayDate] = useState('2026-11-10');
  const [payNote, setPayNote] = useState('');
  const [payError, setPayError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReceivables = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fetchReceivables({
        status: statusFilter,
        startDate,
        endDate,
        search: searchQuery
      });
      setItems(result.items || []);
      setAllItems(result.allItems || result.items || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar piutang pelanggan.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, startDate, endDate, searchQuery]);

  useEffect(() => {
    loadReceivables();
  }, [loadReceivables]);

  useEffect(() => {
    const handleReset = () => loadReceivables();
    window.addEventListener('rajash:data-reset', handleReset);
    return () => window.removeEventListener('rajash:data-reset', handleReset);
  }, [loadReceivables]);

  // Ringkasan Piutang Keseluruhan
  const summary = useMemo(() => {
    const activeList = allItems.filter(
      (r) => r.status === 'Belum Lunas' && Number(r.remaining_amount) > 0
    );
    const totalUnpaidAmount = activeList.reduce(
      (sum, r) => sum + Number(r.remaining_amount || 0),
      0
    );
    const totalPaidCollected = allItems.reduce(
      (sum, r) => sum + Number(r.paid_amount || 0),
      0
    );

    return {
      totalUnpaidAmount,
      unpaidCount: activeList.length,
      totalPaidCollected,
      activeList
    };
  }, [allItems]);

  const handleOpenPayModal = (receivable) => {
    setPayTarget(receivable);
    setPayAmount(Number(receivable.remaining_amount || 0));
    setPayDate('2026-11-10');
    setPayNote('');
    setPayError('');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!payTarget) return;

    const numericPay = Number(payAmount || 0);
    const maxRemaining = Number(payTarget.remaining_amount || 0);

    if (!numericPay || numericPay <= 0) {
      setPayError('Masukkan nominal pembayaran lebih dari Rp0.');
      return;
    }

    if (numericPay > maxRemaining) {
      setPayError(
        `Nominal pembayaran tidak boleh melebihi sisa tagihan (${formatRupiah(maxRemaining)}).`
      );
      return;
    }

    if (!payDate) {
      setPayError('Tanggal pembayaran wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await recordReceivablePayment(payTarget.id, {
        amount: numericPay,
        paymentDate: payDate,
        note: payNote
      });

      const isNowPaidOff = res.data?.status === 'Lunas' || res.data?.remaining_amount === 0;

      showToast({
        title: isNowPaidOff ? 'Piutang Lunas' : 'Pembayaran Piutang Tercatat',
        message: isNowPaidOff
          ? `Tagihan ${payTarget.customer_name} telah lunas sepenuhnya (${formatRupiah(numericPay)}).`
          : `Pembayaran Rp${numericPay.toLocaleString('id-ID')} dari ${payTarget.customer_name} berhasil dicatat. Sisa tagihan: ${formatRupiah(res.data?.remaining_amount)}.`,
        type: 'success'
      });

      setPayTarget(null);
      await loadReceivables();
    } catch (err) {
      setPayError(err.message || 'Gagal menyimpan pembayaran piutang.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'customer_name',
      header: 'Pelanggan',
      render: (row) => (
        <div>
          <div className="fw-semibold">{row.customer_name}</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--rj-text-secondary)' }}>
            {row.description || 'Penjualan kredit galon'}
          </div>
        </div>
      )
    },
    {
      key: 'transaction_date',
      header: 'Tanggal Transaksi',
      render: (row) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {formatTanggalIndonesia(row.transaction_date)}
        </span>
      )
    },
    {
      key: 'total_amount',
      header: 'Nominal Tagihan',
      align: 'right',
      isNumeric: true,
      render: (row) => formatRupiah(row.total_amount)
    },
    {
      key: 'paid_amount',
      header: 'Jumlah Pembayaran',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span style={{ color: 'var(--rj-text-secondary)' }}>
          {formatRupiah(row.paid_amount)}
        </span>
      )
    },
    {
      key: 'remaining_amount',
      header: 'Sisa Piutang',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span
          className="fw-bold"
          style={{
            color:
              Number(row.remaining_amount) > 0
                ? 'var(--rj-text-primary)'
                : 'var(--rj-text-secondary)'
          }}
        >
          {formatRupiah(row.remaining_amount)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status Pembayaran',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'right',
      render: (row) => (
        <div className="d-inline-flex align-items-center gap-1 justify-content-end">
          <button
            type="button"
            onClick={() => setDetailTarget(row)}
            className="btn-rj-secondary py-1 px-2"
            style={{ fontSize: '0.78rem' }}
          >
            <Eye size={14} />
            <span>Detail</span>
          </button>
          {row.status === 'Belum Lunas' && Number(row.remaining_amount) > 0 && (
            <button
              type="button"
              onClick={() => handleOpenPayModal(row)}
              className="btn-rj-primary py-1 px-2"
              style={{ fontSize: '0.78rem' }}
            >
              <HandCoins size={14} />
              <span>Catat Bayar</span>
            </button>
          )}
        </div>
      )
    }
  ];

  const estimatedRemainingAfterPay = payTarget
    ? Math.max(0, Number(payTarget.remaining_amount || 0) - Number(payAmount || 0))
    : 0;

  return (
    <PageContainer
      title="Pengelolaan Piutang Pelanggan"
      subtitle="Pantau daftar tagihan penjualan kredit, catat pembayaran bertahap maupun pelunasan, dan evaluasi pengingat tagihan."
    >
      {/* Ringkasan Piutang */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <SummaryCard
            label="Total Piutang Aktif (Belum Lunas)"
            amount={summary.totalUnpaidAmount}
            icon={Notebook}
            highlightPrimary={true}
            periodNote="Tagihan yang masih harus dibayar pelanggan"
          />
        </div>
        <div className="col-12 col-md-4">
          <SummaryCard
            label="Jumlah Tagihan Belum Lunas"
            amount={`${summary.unpaidCount} Tagihan`}
            isCurrency={false}
            icon={Clock}
            periodNote="Piutang lunas otomatis keluar dari tagihan aktif"
          />
        </div>
        <div className="col-12 col-md-4">
          <SummaryCard
            label="Pembayaran Piutang Diterima"
            amount={summary.totalPaidCollected}
            icon={CheckCircle}
            periodNote="Telah masuk ke kas operasional RAJASH"
          />
        </div>
      </div>

      {/* Komponen Pengingat Piutang di dalam Aplikasi (Bagian 7.8) */}
      <div className="mb-4">
        <ReceivableReminderCard
          activeReceivables={summary.activeList}
          onSelectPay={handleOpenPayModal}
          compact={false}
        />
      </div>

      {/* Filter & Pencarian */}
      <div className="rj-card p-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-4">
            <label
              htmlFor="receivable-search"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--rj-text-secondary)',
                marginBottom: '4px'
              }}
            >
              Cari Nama Pelanggan / Keterangan
            </label>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Contoh: Pak Hasan, Ibu Cut Meutia, Asrama..."
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <FilterDropdown
              id="filter-receivable-status"
              label="Status Pembayaran"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-5">
            <DateFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onReset={() => {
                setStartDate('');
                setEndDate('');
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabel Daftar Piutang */}
      {isLoading ? (
        <LoadingState rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadReceivables} />
      ) : (
        <div className="rj-card">
          <DataTable
            columns={columns}
            data={items}
            emptyTitle="Tidak Ada Data Piutang"
            emptyDescription="Tidak ditemukan data piutang yang sesuai dengan filter status atau pencarian Anda."
            renderMobileCard={(row) => (
              <div>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                  <span style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                    Transaksi {formatTanggalIndonesia(row.transaction_date)}
                  </span>
                  <StatusBadge status={row.status} />
                </div>
                <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                  {row.customer_name}
                </div>
                <div
                  className="mb-2"
                  style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}
                >
                  {row.description}
                </div>

                <div
                  className="row g-2 py-2 my-1"
                  style={{
                    borderTop: '1px solid var(--rj-border-subtle)',
                    borderBottom: '1px solid var(--rj-border-subtle)',
                    fontSize: '0.78rem'
                  }}
                >
                  <div className="col-4">
                    <div style={{ color: 'var(--rj-text-secondary)' }}>Tagihan</div>
                    <div className="font-tabular fw-medium">{formatRupiah(row.total_amount)}</div>
                  </div>
                  <div className="col-4">
                    <div style={{ color: 'var(--rj-text-secondary)' }}>Dibayar</div>
                    <div className="font-tabular fw-medium">{formatRupiah(row.paid_amount)}</div>
                  </div>
                  <div className="col-4 text-end">
                    <div style={{ color: 'var(--rj-text-secondary)' }}>Sisa</div>
                    <div className="font-tabular fw-bold">{formatRupiah(row.remaining_amount)}</div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setDetailTarget(row)}
                    className="btn-rj-secondary py-1 px-2"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <Eye size={14} />
                    <span>Detail</span>
                  </button>
                  {row.status === 'Belum Lunas' && Number(row.remaining_amount) > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenPayModal(row)}
                      className="btn-rj-primary py-1 px-2"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <HandCoins size={14} />
                      <span>Catat Bayar</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Modal Detail Piutang & Riwayat Cicilan */}
      <Modal
        isOpen={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title="Rincian Tagihan Piutang"
        subtitle={detailTarget ? `Pelanggan: ${detailTarget.customer_name}` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDetailTarget(null)}
              className="btn-rj-secondary"
            >
              Tutup
            </button>
            {detailTarget?.status === 'Belum Lunas' && Number(detailTarget?.remaining_amount) > 0 && (
              <button
                type="button"
                onClick={() => {
                  const target = detailTarget;
                  setDetailTarget(null);
                  handleOpenPayModal(target);
                }}
                className="btn-rj-primary"
              >
                <HandCoins size={16} />
                <span>Catat Pembayaran</span>
              </button>
            )}
          </>
        }
      >
        {detailTarget && (
          <div className="d-flex flex-column gap-3" style={{ fontSize: '0.85rem' }}>
            <div
              className="p-3"
              style={{
                backgroundColor: 'var(--rj-bg)',
                border: '1px solid var(--rj-border)',
                borderRadius: '8px'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ color: 'var(--rj-text-secondary)' }}>Status Tagihan</span>
                <StatusBadge status={detailTarget.status} />
              </div>
              <div className="d-flex justify-content-between py-1">
                <span style={{ color: 'var(--rj-text-secondary)' }}>Tanggal Transaksi</span>
                <span className="fw-medium">
                  {formatTanggalIndonesia(detailTarget.transaction_date)}
                </span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span style={{ color: 'var(--rj-text-secondary)' }}>Keterangan Pesanan</span>
                <span className="fw-medium text-end">{detailTarget.description}</span>
              </div>
              <hr className="my-2" style={{ borderColor: 'var(--rj-border)' }} />
              <div className="d-flex justify-content-between py-1">
                <span style={{ color: 'var(--rj-text-secondary)' }}>Nominal Tagihan Awal</span>
                <span className="font-tabular fw-semibold">
                  {formatRupiah(detailTarget.total_amount)}
                </span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span style={{ color: 'var(--rj-text-secondary)' }}>Total Sudah Dibayar</span>
                <span className="font-tabular fw-semibold" style={{ color: 'var(--rj-primary)' }}>
                  {formatRupiah(detailTarget.paid_amount)}
                </span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span className="fw-semibold">Sisa Piutang Saat Ini</span>
                <span className="font-tabular fw-bold" style={{ fontSize: '0.95rem' }}>
                  {formatRupiah(detailTarget.remaining_amount)}
                </span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Riwayat Pembayaran ({detailTarget.payments?.length || 0})
              </h3>
              {!detailTarget.payments || detailTarget.payments.length === 0 ? (
                <div
                  className="p-3 text-center"
                  style={{
                    backgroundColor: 'var(--rj-bg)',
                    border: '1px solid var(--rj-border)',
                    borderRadius: '8px',
                    color: 'var(--rj-text-secondary)'
                  }}
                >
                  Belum ada pembayaran yang tercatat untuk tagihan ini.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {detailTarget.payments.map((pay) => (
                    <div
                      key={pay.id}
                      className="p-2 px-3 d-flex justify-content-between align-items-center"
                      style={{
                        backgroundColor: 'var(--rj-white)',
                        border: '1px solid var(--rj-border)',
                        borderRadius: '8px'
                      }}
                    >
                      <div>
                        <div className="fw-medium">{formatTanggalIndonesia(pay.date)}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--rj-text-secondary)' }}>
                          {pay.note || 'Pembayaran tagihan piutang'}
                        </div>
                      </div>
                      <div className="font-tabular fw-bold" style={{ color: 'var(--rj-primary)' }}>
                        +{formatRupiah(pay.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Pencatatan Pembayaran Piutang (Bagian 7.6) */}
      <Modal
        isOpen={Boolean(payTarget)}
        onClose={() => !isSubmitting && setPayTarget(null)}
        title="Catat Pembayaran Piutang"
        subtitle={payTarget ? `Pelanggan: ${payTarget.customer_name}` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setPayTarget(null)}
              disabled={isSubmitting}
              className="btn-rj-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              form="form-pay-receivable"
              disabled={isSubmitting}
              className="btn-rj-primary"
            >
              {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Pembayaran'}
            </button>
          </>
        }
      >
        {payTarget && (
          <form id="form-pay-receivable" onSubmit={handlePaymentSubmit} noValidate>
            {/* Ringkasan Sisa Tagihan Sebelum & Sesudah */}
            <div
              className="p-3 mb-3"
              style={{
                backgroundColor: 'var(--rj-bg)',
                border: '1px solid var(--rj-border)',
                borderRadius: '8px',
                fontSize: '0.825rem'
              }}
            >
              <div className="d-flex justify-content-between mb-1">
                <span style={{ color: 'var(--rj-text-secondary)' }}>Total Tagihan Awal:</span>
                <span className="font-tabular">{formatRupiah(payTarget.total_amount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span style={{ color: 'var(--rj-text-secondary)' }}>Sudah Dibayar:</span>
                <span className="font-tabular">{formatRupiah(payTarget.paid_amount)}</span>
              </div>
              <div
                className="d-flex justify-content-between pt-2 mt-2"
                style={{ borderTop: '1px solid var(--rj-border)' }}
              >
                <span className="fw-semibold">Sisa Tagihan Saat Ini:</span>
                <strong className="font-tabular" style={{ fontSize: '0.925rem' }}>
                  {formatRupiah(payTarget.remaining_amount)}
                </strong>
              </div>
            </div>

            <FormInput
              id="pay-date"
              label="Tanggal Pembayaran"
              type="date"
              required={true}
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
            />

            <CurrencyInput
              id="pay-amount"
              label="Nominal Pembayaran Diterima"
              required={true}
              value={payAmount}
              onChange={(val) => {
                setPayAmount(val);
                if (payError) setPayError('');
              }}
              quickAmounts={
                Number(payTarget.remaining_amount) > 50000
                  ? [50000, Number(payTarget.remaining_amount)]
                  : [Number(payTarget.remaining_amount)]
              }
              error={payError}
              helperText={`Maksimal pembayaran: ${formatRupiah(payTarget.remaining_amount)} (Tidak boleh melebihi sisa tagihan).`}
            />

            <FormInput
              id="pay-note"
              label="Catatan Pembayaran (Opsional)"
              placeholder="Contoh: Pembayaran tunai di depot / Pelunasan"
              value={payNote}
              onChange={(e) => setPayNote(e.target.value)}
            />

            {/* Pratinjau Hasil Setelah Pembayaran */}
            <div
              className="p-3 mt-2 d-flex align-items-center justify-content-between"
              style={{
                backgroundColor:
                  estimatedRemainingAfterPay === 0
                    ? 'var(--rj-status-success-bg)'
                    : 'var(--rj-primary-subtle)',
                border:
                  estimatedRemainingAfterPay === 0
                    ? '1px solid var(--rj-status-success-border)'
                    : '1px solid var(--rj-primary-border)',
                borderRadius: '8px',
                fontSize: '0.825rem'
              }}
            >
              <div>
                <div className="fw-semibold">Estimasi Sisa Tagihan Setelah Bayar:</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                  Status akan menjadi:{' '}
                  <strong>{estimatedRemainingAfterPay === 0 ? 'Lunas' : 'Belum Lunas'}</strong>
                </div>
              </div>
              <div className="font-tabular fw-bold" style={{ fontSize: '1rem' }}>
                {formatRupiah(estimatedRemainingAfterPay)}
              </div>
            </div>
          </form>
        )}
      </Modal>
    </PageContainer>
  );
}

