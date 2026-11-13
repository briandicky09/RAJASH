import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  ArrowDownLeft,
  Notebook,
  Receipt,
  Info,
  Trash,
  Drop
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
import Modal from '../components/common/Modal';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import {
  fetchIncomes,
  checkDuplicateIncome,
  createIncome,
  deleteIncome
} from '../services/financeService';
import { WATER_TYPES } from '../mocks/demoData';
import { formatRupiah, formatTanggalIndonesia } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const PAYMENT_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Semua Pembayaran' },
  { value: 'Tunai', label: 'Tunai (Kas Langsung)' },
  { value: 'Kredit', label: 'Kredit (Piutang Tempo)' }
];

const INITIAL_FORM = {
  date: '2026-11-10',
  water_type: 'Air Mineral',
  quantity: 1,
  unit_price: 6000,
  amount: 6000,
  payment_method: 'Tunai',
  customer_name: '',
  description: ''
};

export default function IncomePage() {
  const { showToast } = useToast();

  // State Data & Filter
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Tambah Pemasukan
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Dialog Peringatan Duplikasi & Hapus Transaksi (FR-DUP & FR-HIS)
  const [duplicateAlert, setDuplicateAlert] = useState({ isOpen: false, matches: [] });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadIncomes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fetchIncomes({
        startDate,
        endDate,
        paymentMethod: paymentFilter,
        search: searchQuery
      });
      setItems(result.items || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pemasukan.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, paymentFilter, searchQuery]);

  useEffect(() => {
    loadIncomes();
  }, [loadIncomes]);

  useEffect(() => {
    const handleReset = () => loadIncomes();
    window.addEventListener('rajash:data-reset', handleReset);
    return () => window.removeEventListener('rajash:data-reset', handleReset);
  }, [loadIncomes]);

  // Kalkulasi Ringkasan
  const metrics = useMemo(() => {
    const cashReceived = items
      .filter((i) => i.payment_method === 'Tunai')
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const creditTotal = items
      .filter((i) => i.payment_method === 'Kredit')
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    let mineralGalon = 0;
    let roGalon = 0;
    items.forEach((i) => {
      const isRO = (i.water_type || '').includes('RO');
      const q = Number(i.quantity || 1);
      if (isRO) roGalon += q;
      else mineralGalon += q;
    });

    return {
      cashReceived,
      creditTotal,
      totalTransactions: cashReceived + creditTotal,
      count: items.length,
      mineralGalon,
      roGalon
    };
  }, [items]);

  const handleOpenAddModal = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Kalkulasi Otomatis Total: kuantitas * harga satuan (FR-INC-02, BR-01)
  const updateQuantityOrPrice = (newQty, newPrice) => {
    const qty = parseInt(newQty, 10) || 1;
    const price = Number(newPrice) || 0;
    setFormData((prev) => ({
      ...prev,
      quantity: qty,
      unit_price: price,
      amount: qty * price
    }));
  };

  const handleWaterTypeChange = (typeId) => {
    const selected = WATER_TYPES.find((w) => w.id === typeId) || WATER_TYPES[0];
    const qty = formData.quantity || 1;
    setFormData((prev) => ({
      ...prev,
      water_type: selected.label,
      unit_price: selected.defaultPrice,
      amount: qty * selected.defaultPrice
    }));
  };

  const validateIncomeForm = () => {
    const errs = {};
    if (!formData.date) {
      errs.date = 'Tanggal transaksi wajib diisi.';
    }
    if (!formData.quantity || formData.quantity <= 0) {
      errs.quantity = 'Kuantitas galon minimal 1.';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Nominal transaksi wajib lebih besar dari Rp0.';
    }
    if (!['Tunai', 'Kredit'].includes(formData.payment_method)) {
      errs.payment_method = 'Pilih jenis pembayaran Tunai atau Kredit.';
    }
    if (formData.payment_method === 'Kredit' && !formData.customer_name.trim()) {
      errs.customer_name = 'Nama pelanggan wajib diisi untuk penjualan tempo/kredit (piutang).';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const executeSaveIncome = async () => {
    setIsSubmitting(true);
    try {
      await createIncome(formData);
      setDuplicateAlert({ isOpen: false, matches: [] });
      setIsFormOpen(false);

      showToast({
        title: 'Pemasukan Berhasil Disimpan',
        message:
          formData.payment_method === 'Kredit'
            ? `Transaksi tempo ${formData.quantity} galon (${formatRupiah(formData.amount)}) dicatat ke daftar piutang ${formData.customer_name}.`
        : `Pemasukan tunai ${formData.quantity} galon (${formatRupiah(formData.amount)}) berhasil ditambahkan ke kas.`,
        type: 'success'
      });

    await loadIncomes();
  } catch (err) {
    showToast({
      title: 'Gagal Menyimpan Pemasukan',
      message: err.message || 'Terjadi kesalahan saat menyimpan transaksi.',
      type: 'error'
    });
  } finally {
    setIsSubmitting(false);
  }
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!validateIncomeForm()) return;

  setIsSubmitting(true);
  try {
    const dupCheck = await checkDuplicateIncome(formData);
    if (dupCheck.isDuplicate && dupCheck.matches.length > 0) {
      setIsSubmitting(false);
      setDuplicateAlert({
        isOpen: true,
        matches: dupCheck.matches
      });
      return;
    }
    await executeSaveIncome();
  } catch (err) {
    setIsSubmitting(false);
    showToast({
      title: 'Gagal Memproses Transaksi',
      message: err.message,
      type: 'error'
    });
  }
};

const handleConfirmDelete = async () => {
  if (!deleteTarget) return;
  setIsSubmitting(true);
  try {
    await deleteIncome(deleteTarget.id);
    showToast({
      title: 'Transaksi Dibatalkan',
      message: `Transaksi pemasukan ${deleteTarget.customer_name} (${formatRupiah(deleteTarget.amount)}) telah dihapus.`,
      type: 'info'
    });
    setDeleteTarget(null);
    await loadIncomes();
  } catch (err) {
    showToast({
      title: 'Gagal Membatalkan Transaksi',
      message: err.message,
      type: 'error'
    });
  } finally {
    setIsSubmitting(false);
  }
};

const columns = [
  {
    key: 'date',
    header: 'Tanggal',
    render: (row) => (
      <span style={{ whiteSpace: 'nowrap' }}>{formatTanggalIndonesia(row.date)}</span>
    )
  },
  {
    key: 'customer_name',
    header: 'Pelanggan',
    render: (row) => (
        <div>
          <div className="fw-semibold">{row.customer_name || 'Pelanggan Depot Langsung'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
            {row.description || '-'}
          </div>
        </div>
    )
  },
  {
    key: 'water_type',
    header: 'Jenis Air & Qty',
    render: (row) => (
        <div>
          <span className="fw-medium">{row.water_type || 'Air Mineral'}</span>
          <div className="font-tabular" style={{ fontSize: '0.76rem', color: 'var(--rj-text-secondary)' }}>
            {row.quantity || 1} galon @ {formatRupiah(row.unit_price || 6000)}
          </div>
        </div>
    )
  },
  {
    key: 'amount',
    header: 'Total Nominal',
    align: 'right',
    isNumeric: true,
      render: (row) => <span className="fw-bold">{formatRupiah(row.amount)}</span>
  },
  {
    key: 'payment_method',
    header: 'Pembayaran',
    render: (row) => <StatusBadge status={row.payment_method} />
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => {
      if (row.payment_method === 'Tunai') {
        return <StatusBadge status="Tunai Diterima" variant="success" />;
      }
      return (
        <StatusBadge
          status={row.status === 'Lunas' ? 'Kredit Lunas' : 'Piutang Aktif'}
          variant={row.status === 'Lunas' ? 'success' : 'warning'}
        />
      );
    }
  },
  {
    key: 'actions',
    header: 'Aksi',
    align: 'right',
    render: (row) => (
      <button
        type="button"
        onClick={() => setDeleteTarget(row)}
        className="btn-rj-danger-outline py-1 px-2"
        aria-label={`Batalkan transaksi ${row.customer_name}`}
      >
        <Trash size={14} />
        <span>Batal</span>
      </button>
    )
  }
];

return (
  <PageContainer
    title="Pencatatan Pemasukan Penjualan Air Galon"
    subtitle="Catat penjualan air galon (Mineral & RO), hitung total kuantitas secara otomatis, dan kelola penjualan tunai maupun tempo."
    headerActions={
      <button type="button" onClick={handleOpenAddModal} className="btn-rj-primary">
        <Plus size={17} weight="bold" />
        <span>Tambah Penjualan Galon</span>
      </button>
    }
  >
    {/* Ringkasan Pemasukan Sesuai Filter */}
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <SummaryCard
          label="Pemasukan Tunai (Kas Diterima)"
          amount={metrics.cashReceived}
          icon={ArrowDownLeft}
          highlightPrimary={true}
          periodNote="Langsung masuk ke kas operasional"
        />
      </div>
      <div className="col-12 col-md-4">
        <SummaryCard
          label="Penjualan Kredit (Piutang Tempo)"
          amount={metrics.creditTotal}
          icon={Notebook}
          periodNote="Tercatat sebagai saldo piutang pelanggan"
        />
      </div>
      <div className="col-12 col-md-4">
        <SummaryCard
          label="Volume Penjualan Galon"
          amount={`${metrics.mineralGalon + metrics.roGalon} Galon`}
          isCurrency={false}
          icon={Drop}
          subDetail={`Mineral: ${metrics.mineralGalon} | RO: ${metrics.roGalon}`}
          periodNote={`Total Nilai: ${formatRupiah(metrics.totalTransactions)}`}
        />
      </div>
    </div>

    {/* Filter & Pencarian */}
    <div className="rj-card p-3 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-12 col-lg-4">
          <label
            htmlFor="income-search"
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--rj-text-secondary)',
              marginBottom: '4px'
            }}
          >
            Cari Pelanggan / Keterangan / Jenis Air
          </label>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Contoh: Warkop, Asrama, Air RO..."
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <FilterDropdown
            id="filter-payment-method"
            label="Jenis Pembayaran"
            value={paymentFilter}
            onChange={setPaymentFilter}
            options={PAYMENT_FILTER_OPTIONS}
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

    {/* Tabel Riwayat Transaksi Pemasukan */}
    {isLoading ? (
      <LoadingState rows={5} />
    ) : error ? (
      <ErrorState message={error} onRetry={loadIncomes} />
    ) : (
      <div className="rj-card">
        <DataTable
          columns={columns}
          data={items}
          emptyTitle="Belum Ada Catatan Pemasukan"
          emptyDescription="Tidak ditemukan transaksi penjualan yang sesuai dengan filter pencarian Anda."
          emptyActionLabel="Tambah Penjualan Baru"
          onEmptyAction={handleOpenAddModal}
          renderMobileCard={(row) => (
            <div>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-1">
                <span style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                  {formatTanggalIndonesia(row.date)}
                </span>
                <div className="d-flex flex-wrap gap-1 justify-content-end">
                  <StatusBadge status={row.payment_method} />
                  <StatusBadge
                    status={
                      row.payment_method === 'Tunai'
                        ? 'Tunai Diterima'
                        : row.status === 'Lunas'
                          ? 'Kredit Lunas'
                          : 'Piutang Aktif'
                    }
                  />
                </div>
              </div>
              <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                {row.customer_name || 'Pelanggan Depot Langsung'}
              </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--rj-text-secondary)' }}>
                  {row.water_type || 'Air Mineral'} - {row.quantity || 1} galon @ {formatRupiah(row.unit_price || 6000)}
                </div>
                {row.description && (
                  <div className="mt-1" style={{ fontSize: '0.76rem', color: 'var(--rj-text-secondary)' }}>
                    {row.description}
                  </div>
                )}
                <div
                  className="d-flex justify-content-between align-items-center pt-2 mt-2"
                  style={{ borderTop: '1px solid var(--rj-border-subtle)' }}
                >
                    <span className="font-tabular fw-bold" style={{ fontSize: '0.95rem' }}>
                      {formatRupiah(row.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(row)}
                      className="btn-rj-danger-outline py-1 px-2"
                    >
                      <Trash size={14} />
                      <span>Batal</span>
                    </button>
                </div>
              </div>
            )}
          />
            </div>
          )}

          {/* Modal Form Tambah Penjualan Galon Sesuai SRS (FR-INC-01 s.d. FR-INC-04) */}
      <Modal
          isOpen={isFormOpen}
          onClose={() => !isSubmitting && setIsFormOpen(false)}
          title="Formulir Penjualan Air Galon"
          subtitle="Mendukung jenis air Mineral / RO, kuantitas, harga satuan, dan kalkulasi otomatis."
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
                className="btn-rj-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                form="form-add-income"
                disabled={isSubmitting}
                className="btn-rj-primary"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Penjualan'}
              </button>
            </>
          }
        >
          <form id="form-add-income" onSubmit={handleFormSubmit} noValidate>
            <FormInput
              id="income-date"
              label="Tanggal Transaksi"
              type="date"
              required={true}
              value={formData.date}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, date: e.target.value }));
                if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: '' }));
              }}
              error={formErrors.date}
            />

            {/* Pemilihan Jenis Air (FR-MST-03) */}
            <div className="mb-3">
              <label className="rj-form-label">
                Jenis Air Galon <span style={{ color: 'var(--rj-primary)' }}>*</span>
              </label>
              <div className="row g-2">
                {WATER_TYPES.map((w) => {
                  const isSelected = formData.water_type.includes(w.id);
                  return (
                    <div key={w.id} className="col-12 col-sm-6">
                      <button
                        type="button"
                        onClick={() => handleWaterTypeChange(w.id)}
                        className="w-100 p-2 px-3 text-start"
                        style={{
                          backgroundColor: isSelected ? 'var(--rj-primary-subtle)' : 'var(--rj-white)',
                          border: isSelected ? '1.5px solid var(--rj-primary)' : '1px solid var(--rj-border)',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                          {w.label}
                        </div>
                        <div className="font-tabular" style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                          Default: {formatRupiah(w.defaultPrice)} / galon
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kuantitas Galon dan Harga Satuan (FR-INC-01 & FR-INC-02) */}
            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-6">
                <label htmlFor="income-quantity" className="rj-form-label">
                  Kuantitas Galon <span style={{ color: 'var(--rj-primary)' }}>*</span>
                </label>
                <input
                  id="income-quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => updateQuantityOrPrice(e.target.value, formData.unit_price)}
                  className={`rj-form-control font-tabular ${formErrors.quantity ? 'is-invalid' : ''}`}
                />
                {/* Shortcut Kuantitas Cepat */}
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {[1, 5, 10, 15, 25].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => updateQuantityOrPrice(q, formData.unit_price)}
                      className="btn-rj-secondary p-1 px-2 font-tabular"
                      style={{ fontSize: '0.72rem' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <label htmlFor="income-unit-price" className="rj-form-label">
                  Harga Satuan (Rp) <span style={{ color: 'var(--rj-primary)' }}>*</span>
                </label>
                <input
                  id="income-unit-price"
                  type="number"
                  step="500"
                  min="1000"
                  value={formData.unit_price}
                  onChange={(e) => updateQuantityOrPrice(formData.quantity, e.target.value)}
                  className="rj-form-control font-tabular"
                />
              </div>
            </div>

            {/* Total Terhitung Otomatis (FR-INC-02, BR-01) */}
            <div
              className="p-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2"
              style={{
                backgroundColor: 'var(--rj-bg)',
                border: '1px solid var(--rj-border)',
                borderRadius: '8px'
              }}
            >
              <div style={{ minWidth: 0, flex: '1 1 160px' }}>
                <div className="fw-semibold" style={{ fontSize: '0.825rem' }}>
                  Total Transaksi ({formData.quantity} × {formatRupiah(formData.unit_price)})
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--rj-text-secondary)' }}>
                  Dihitung otomatis sesuai kuantitas & harga satuan
                </div>
              </div>
              <div className="font-tabular fw-bold" style={{ fontSize: '1.2rem', color: 'var(--rj-primary)' }}>
                {formatRupiah(formData.amount)}
              </div>
            </div>

            {/* Pilihan Tunai vs Kredit */}
            <div className="mb-3">
              <label className="rj-form-label">
                Metode Pembayaran <span style={{ color: 'var(--rj-primary)' }}>*</span>
              </label>
              <div className="row g-2">
                {['Tunai', 'Kredit'].map((method) => {
                  const isSelected = formData.payment_method === method;
                  return (
                    <div key={method} className="col-12 col-sm-6">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, payment_method: method }));
                          if (formErrors.customer_name && method === 'Tunai') {
                            setFormErrors((prev) => ({ ...prev, customer_name: '' }));
                          }
                        }}
                        className="w-100 p-2 px-3 text-start"
                        style={{
                          backgroundColor: isSelected ? 'var(--rj-primary-subtle)' : 'var(--rj-white)',
                          border: isSelected ? '1.5px solid var(--rj-primary)' : '1px solid var(--rj-border)',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                          <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                            {method === 'Tunai' ? 'Tunai (Kas Langsung)' : 'Kredit (Piutang Tempo)'}
                          </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {formData.payment_method === 'Kredit' && (
              <div
                className="p-3 mb-3 d-flex align-items-start gap-2"
                style={{
                  backgroundColor: 'var(--rj-status-warning-bg)',
                  border: '1px solid var(--rj-status-warning-border)',
                  color: 'var(--rj-status-warning-text)',
                  borderRadius: '8px',
                  fontSize: '0.8rem'
                }}
              >
                <Info size={18} weight="fill" className="flex-shrink-0 mt-1" />
                <div>
                  <strong>Penjualan Tempo/Kredit:</strong> Tagihan sebesar{' '}
                  <strong>{formatRupiah(formData.amount)}</strong> akan tercatat pada modul Piutang
                  Pelanggan dan tidak dihitung sebagai uang kas sampai dilunasi.
                </div>
              </div>
            )}

            <FormInput
              id="income-customer"
              label={
                formData.payment_method === 'Kredit'
                  ? 'Nama Pelanggan (Wajib untuk Piutang)'
                : 'Nama Pelanggan (Opsional)'
            }
            required={formData.payment_method === 'Kredit'}
            placeholder="Contoh: Warkop Kupi Khop / Kedai Mie Aceh"
            value={formData.customer_name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, customer_name: e.target.value }));
              if (formErrors.customer_name) {
                setFormErrors((prev) => ({ ...prev, customer_name: '' }));
              }
            }}
            error={formErrors.customer_name}
          />

            <FormInput
              id="income-description"
              label="Catatan Pengantaran / Pesanan (Opsional)"
              as="textarea"
              rows={2}
              placeholder="Contoh: Pesanan WhatsApp via becak pagi"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </form>
        </Modal>

        {/* Dialog Peringatan Potensi Duplikasi (FR-DUP-01 s.d. FR-DUP-04) */}
        <ConfirmationDialog
          isOpen={duplicateAlert.isOpen}
          onClose={() => setDuplicateAlert({ isOpen: false, matches: [] })}
          onConfirm={executeSaveIncome}
          isSubmitting={isSubmitting}
          title="Peringatan Potensi Transaksi Ganda"
          message="Sistem mendeteksi transaksi dengan tanggal, nominal, dan pelanggan yang serupa. Apakah ini transaksi penjualan baru atau pencatatan berulang?"
          details={duplicateAlert.matches.map(
            (m) =>
                `${formatTanggalIndonesia(m.date)} | ${m.customer_name} | ${formatRupiah(m.amount)} (${m.water_type || m.payment_method
                })`
          )}
          confirmLabel="Tetap Simpan Transaksi"
          cancelLabel="Batal / Periksa Kembali"
        />

        {/* Dialog Konfirmasi Pembatalan Transaksi (FR-HIS-02) */}
        <ConfirmationDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isSubmitting={isSubmitting}
          title="Batalkan Catatan Penjualan"
          message={
            deleteTarget
              ? `Apakah Anda yakin ingin membatalkan transaksi penjualan ${deleteTarget.customer_name} senilai ${formatRupiah(
                deleteTarget.amount
              )} pada tanggal ${formatTanggalIndonesia(deleteTarget.date)}?`
              : ''
          }
          confirmLabel="Ya, Batalkan Transaksi"
          cancelLabel="Kembali"
        />
      </PageContainer>
    );
}
