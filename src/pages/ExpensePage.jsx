import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  ArrowUpRight,
  Tag,
  Trash,
  Receipt
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
  fetchExpenses,
  checkDuplicateExpense,
  createExpense,
  deleteExpense
} from '../services/financeService';
import { EXPENSE_CATEGORIES } from '../mocks/demoData';
import { formatRupiah, formatTanggalIndonesia } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const CATEGORY_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Semua Kategori Biaya' },
  ...EXPENSE_CATEGORIES.map((cat) => ({ value: cat, label: cat }))
];

const INITIAL_EXPENSE_FORM = {
  date: '2026-11-10',
  category: 'BBM Becak',
  amount: 0,
  description: ''
};

export default function ExpensePage() {
  const { showToast } = useToast();

  // State Data & Filter
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Tambah Pengeluaran
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_EXPENSE_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Dialog Peringatan Duplikasi & Hapus
  const [duplicateAlert, setDuplicateAlert] = useState({ isOpen: false, matches: [] });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fetchExpenses({
        startDate,
        endDate,
        category: categoryFilter,
        search: searchQuery
      });
      setItems(result.items || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat riwayat pengeluaran.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, categoryFilter, searchQuery]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    const handleReset = () => loadExpenses();
    window.addEventListener('rajash:data-reset', handleReset);
    return () => window.removeEventListener('rajash:data-reset', handleReset);
  }, [loadExpenses]);

  const metrics = useMemo(() => {
    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    // Cari kategori dengan pengeluaran terbesar
    const byCat = {};
    items.forEach((item) => {
      byCat[item.category] = (byCat[item.category] || 0) + Number(item.amount || 0);
    });
    let topCategory = '-';
    let topCategoryAmount = 0;
    Object.entries(byCat).forEach(([cat, amt]) => {
      if (amt > topCategoryAmount) {
        topCategory = cat;
        topCategoryAmount = amt;
      }
    });

    return {
      totalAmount,
      count: items.length,
      topCategory,
      topCategoryAmount
    };
  }, [items]);

  const handleOpenAddModal = () => {
    setFormData(INITIAL_EXPENSE_FORM);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateExpenseForm = () => {
    const errs = {};
    if (!formData.date) {
      errs.date = 'Tanggal pengeluaran wajib diisi.';
    }
    if (!formData.category) {
      errs.category = 'Kategori biaya operasional wajib dipilih.';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Nominal pengeluaran harus lebih besar dari Rp0.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const executeSaveExpense = async () => {
    setIsSubmitting(true);
    try {
      await createExpense(formData);
      setDuplicateAlert({ isOpen: false, matches: [] });
      setIsFormOpen(false);

      showToast({
        title: 'Pengeluaran Berhasil Dicatat',
        message: `Biaya ${formData.category} sebesar ${formatRupiah(formData.amount)} telah disimpan.`,
        type: 'success'
      });

      await loadExpenses();
    } catch (err) {
      showToast({
        title: 'Gagal Menyimpan Pengeluaran',
        message: err.message || 'Terjadi kendala saat menyimpan pengeluaran.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateExpenseForm()) return;

    setIsSubmitting(true);
    try {
      const dupCheck = await checkDuplicateExpense(formData);
      if (dupCheck.isDuplicate && dupCheck.matches.length > 0) {
        setIsSubmitting(false);
        setDuplicateAlert({
          isOpen: true,
          matches: dupCheck.matches
        });
        return;
      }
      await executeSaveExpense();
    } catch (err) {
      setIsSubmitting(false);
      showToast({
        title: 'Gagal Memproses Pengeluaran',
        message: err.message,
        type: 'error'
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteExpense(deleteTarget.id);
      showToast({
        title: 'Catatan Pengeluaran Dihapus',
        message: `Pengeluaran ${deleteTarget.category} (${formatRupiah(deleteTarget.amount)}) telah dihapus.`,
        type: 'info'
      });
      setDeleteTarget(null);
      await loadExpenses();
    } catch (err) {
      showToast({
        title: 'Gagal Menghapus',
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
      key: 'category',
      header: 'Kategori',
      render: (row) => <StatusBadge status={row.category} variant="neutral" />
    },
    {
      key: 'description',
      header: 'Keterangan',
      render: (row) => (
        <span style={{ color: 'var(--rj-text-primary)' }}>{row.description || '-'}</span>
      )
    },
    {
      key: 'amount',
      header: 'Nominal',
      align: 'right',
      isNumeric: true,
      render: (row) => <span className="fw-semibold">{formatRupiah(row.amount)}</span>
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
          aria-label={`Hapus pengeluaran ${row.category}`}
        >
          <Trash size={14} />
          <span>Hapus</span>
        </button>
      )
    }
  ];

  return (
    <PageContainer
      title="Pencatatan Pengeluaran Operasional"
      subtitle="Catat seluruh biaya operasional Depot Air Minum RAJASH untuk menghitung laba bersih secara akurat."
      headerActions={
        <button type="button" onClick={handleOpenAddModal} className="btn-rj-primary">
          <Plus size={17} weight="bold" />
          <span>Tambah Pengeluaran</span>
        </button>
      }
    >
      {/* Ringkasan Pengeluaran */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <SummaryCard
            label="Total Pengeluaran Tercatat"
            amount={metrics.totalAmount}
            icon={ArrowUpRight}
            highlightPrimary={true}
            periodNote="Mengurangi laba bersih operasional"
          />
        </div>
        <div className="col-12 col-md-4">
          <SummaryCard
            label="Kategori Biaya Terbesar"
            amount={metrics.topCategoryAmount}
            icon={Tag}
            subDetail={`Kategori: ${metrics.topCategory}`}
            periodNote="Berdasarkan daftar terfilter"
          />
        </div>
        <div className="col-12 col-md-4">
          <SummaryCard
            label="Jumlah Transaksi Pengeluaran"
            amount={`${metrics.count} Catatan`}
            isCurrency={false}
            icon={Receipt}
            periodNote="Tersimpan pada buku pengeluaran"
          />
        </div>
      </div>

      {/* Filter & Pencarian */}
      <div className="rj-card p-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-4">
            <label
              htmlFor="expense-search"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--rj-text-secondary)',
                marginBottom: '4px'
              }}
            >
              Cari Keterangan / Kategori
            </label>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Contoh: Pertalite, tangki air, ganti oli..."
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <FilterDropdown
              id="filter-expense-category"
              label="Kategori Pengeluaran"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={CATEGORY_FILTER_OPTIONS}
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

      {/* Tabel Riwayat Pengeluaran */}
      {isLoading ? (
        <LoadingState rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadExpenses} />
      ) : (
        <div className="rj-card">
          <DataTable
            columns={columns}
            data={items}
            emptyTitle="Belum Ada Catatan Pengeluaran"
            emptyDescription="Tidak ditemukan biaya operasional yang sesuai dengan kriteria filter Anda."
            emptyActionLabel="Tambah Pengeluaran Baru"
            onEmptyAction={handleOpenAddModal}
            renderMobileCard={(row) => (
              <div>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <span style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                    {formatTanggalIndonesia(row.date)}
                  </span>
                  <StatusBadge status={row.category} variant="neutral" />
                </div>
                <div className="fw-medium mb-2" style={{ fontSize: '0.875rem' }}>
                  {row.description || '-'}
                </div>
                <div
                  className="d-flex justify-content-between align-items-center pt-2"
                  style={{ borderTop: '1px solid var(--rj-border-subtle)' }}
                >
                  <span className="font-tabular fw-bold" style={{ fontSize: '0.925rem' }}>
                    {formatRupiah(row.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(row)}
                    className="btn-rj-danger-outline py-1 px-2"
                  >
                    <Trash size={14} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Modal Form Tambah Pengeluaran */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !isSubmitting && setIsFormOpen(false)}
        title="Tambah Pengeluaran Operasional"
        subtitle="Catat biaya operasional Depot Air Minum RAJASH"
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
              form="form-add-expense"
              disabled={isSubmitting}
              className="btn-rj-primary"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Pengeluaran'}
            </button>
          </>
        }
      >
        <form id="form-add-expense" onSubmit={handleFormSubmit} noValidate>
          <FormInput
            id="expense-date"
            label="Tanggal Pengeluaran"
            type="date"
            required={true}
            value={formData.date}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, date: e.target.value }));
              if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: '' }));
            }}
            error={formErrors.date}
          />

          <FormInput
            id="expense-category"
            label="Kategori Biaya"
            as="select"
            required={true}
            value={formData.category}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, category: e.target.value }));
              if (formErrors.category) setFormErrors((prev) => ({ ...prev, category: '' }));
            }}
            error={formErrors.category}
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </FormInput>

          <CurrencyInput
            id="expense-amount"
            label="Nominal Pengeluaran"
            required={true}
            value={formData.amount}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, amount: val }));
              if (formErrors.amount) setFormErrors((prev) => ({ ...prev, amount: '' }));
            }}
            quickAmounts={[25000, 35000, 55000, 95000, 250000]}
            error={formErrors.amount}
          />

          <FormInput
            id="expense-description"
            label="Keterangan Tambahan (Opsional)"
            as="textarea"
            rows={2}
            placeholder="Contoh: Pengisian BBM Pertalite becak pengantar pagi"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </form>
      </Modal>

      {/* Dialog Peringatan Potensi Duplikasi Pengeluaran (FR-06) */}
      <ConfirmationDialog
        isOpen={duplicateAlert.isOpen}
        onClose={() => setDuplicateAlert({ isOpen: false, matches: [] })}
        onConfirm={executeSaveExpense}
        isSubmitting={isSubmitting}
        title="Peringatan Potensi Pengeluaran Ganda"
        message="Terdapat catatan pengeluaran dengan tanggal, kategori, dan nominal yang sama persis. Apakah Anda tetap ingin menyimpan catatan ini?"
        details={duplicateAlert.matches.map(
          (m) =>
            `${formatTanggalIndonesia(m.date)} | ${m.category} | ${formatRupiah(m.amount)} (${
              m.description || '-'
            })`
        )}
        confirmLabel="Tetap Simpan"
        cancelLabel="Periksa Kembali"
      />

      {/* Dialog Konfirmasi Hapus Pengeluaran */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmitting}
        title="Hapus Catatan Pengeluaran"
        message={
          deleteTarget
            ? `Apakah Anda yakin ingin menghapus pengeluaran ${deleteTarget.category} sebesar ${formatRupiah(
                deleteTarget.amount
              )} pada tanggal ${formatTanggalIndonesia(deleteTarget.date)}?`
            : ''
        }
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
      />
    </PageContainer>
  );
}

