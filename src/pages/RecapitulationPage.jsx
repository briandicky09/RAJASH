import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Notebook,
  Info,
  Drop,
  Printer
} from '@phosphor-icons/react';
import PageContainer from '../components/layout/PageContainer';
import SummaryCard from '../components/common/SummaryCard';
import FinancialBarChart from '../components/common/FinancialBarChart';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { fetchRecapitulation } from '../services/financeService';
import {
  formatRupiah,
  formatTanggalIndonesia,
  formatBulanIndonesia
} from '../utils/formatters';

export default function RecapitulationPage() {
  const [periodType, setPeriodType] = useState('monthly'); // 'daily' | 'monthly'
  const [selectedDate, setSelectedDate] = useState('2026-11-10');
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [activeLedgerTab, setActiveLedgerTab] = useState('ALL');

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecap = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fetchRecapitulation({
        periodType,
        date: selectedDate,
        month: selectedMonth
      });
      setData(result);
    } catch (err) {
      setError(err.message || 'Gagal memuat rekapitulasi keuangan.');
    } finally {
      setIsLoading(false);
    }
  }, [periodType, selectedDate, selectedMonth]);

  useEffect(() => {
    loadRecap();
  }, [loadRecap]);

  useEffect(() => {
    const handleReset = () => loadRecap();
    window.addEventListener('rajash:data-reset', handleReset);
    return () => window.removeEventListener('rajash:data-reset', handleReset);
  }, [loadRecap]);

  const periodDisplayLabel =
    periodType === 'daily'
      ? `Rekap Harian: ${formatTanggalIndonesia(selectedDate)}`
      : `Rekap Bulanan: ${formatBulanIndonesia(selectedMonth)}`;

  const summary = data?.summary || {
    cashSales: 0,
    creditSales: 0,
    totalSalesTransaction: 0,
    receivablePaymentsReceived: 0,
    actualCashReceived: 0,
    totalExpenses: 0,
    netCashProfit: 0,
    netTransactionProfit: 0,
    periodUnpaidReceivables: 0,
    waterBreakdown: {
      mineralSales: 0,
      roSales: 0,
      mineralGalonCount: 0,
      roGalonCount: 0
    }
  };

  const waterBreakdown = summary.waterBreakdown || {
    mineralSales: 0,
    roSales: 0,
    mineralGalonCount: 0,
    roGalonCount: 0
  };

  const ledgerRows = useMemo(() => {
    if (!data) return [];

    const incomeRows = (data.periodIncomes || []).map((inc) => ({
      id: inc.id,
      date: inc.date,
      category: `Penjualan ${inc.water_type || 'Galon'} (${inc.payment_method})`,
      description: `${inc.customer_name || 'Pelanggan'} - ${inc.quantity || 1} galon @ ${formatRupiah(inc.unit_price || 6000)}`,
      amount: inc.amount,
      status: inc.payment_method === 'Tunai' ? 'Kas Masuk' : 'Piutang Tempo',
      rowType: 'INCOME'
    }));

    const paymentRows = (data.periodReceivablePayments || []).map((pay) => ({
      id: pay.id,
      date: pay.date,
      category: 'Pelunasan / Cicilan Piutang',
      description: `${pay.customer_name} - ${pay.note || 'Pelunasan piutang pelanggan'}`,
      amount: pay.amount,
      status: 'Kas Masuk',
      rowType: 'RECEIVABLE_PAY'
    }));

    const expenseRows = (data.periodExpenses || []).map((exp) => ({
      id: exp.id,
      date: exp.date,
      category: `Biaya: ${exp.category}`,
      description: exp.description || exp.category,
      amount: exp.amount,
      status: 'Kas Keluar',
      rowType: 'EXPENSE'
    }));

    const combined = [...incomeRows, ...paymentRows, ...expenseRows].sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    if (activeLedgerTab === 'ALL') return combined;
    return combined.filter((r) => r.rowType === activeLedgerTab);
  }, [data, activeLedgerTab]);

  const ledgerColumns = [
    {
      key: 'date',
      header: 'Tanggal',
      render: (row) => (
        <span style={{ whiteSpace: 'nowrap' }}>{formatTanggalIndonesia(row.date)}</span>
      )
    },
    {
      key: 'category',
      header: 'Jenis Transaksi',
      render: (row) => <span className="fw-semibold">{row.category}</span>
    },
    {
      key: 'description',
      header: 'Keterangan',
      render: (row) => (
        <span style={{ color: 'var(--rj-text-secondary)' }}>{row.description}</span>
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
      key: 'status',
      header: 'Arus Kas',
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={
            row.status === 'Kas Masuk'
              ? 'success'
              : row.status === 'Piutang Tempo'
    ? 'warning'
    : 'neutral'
}
        />
      )
    }
  ];

return (
  <PageContainer
    title="Rekapitulasi Keuangan & Laba Bersih"
    subtitle="Ringkasan pemasukan kas, penjualan per jenis air, pengeluaran operasional, dan penghitungan laba bersih."
    headerActions={
      <div className="d-flex flex-wrap align-items-center gap-2">
        {/* Filter Harian vs Bulanan (FR-REK-01) */}
        <div
          className="d-inline-flex p-1"
          style={{
            backgroundColor: 'var(--rj-white)',
            border: '1px solid var(--rj-border)',
            borderRadius: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => setPeriodType('daily')}
            className={periodType === 'daily' ? 'btn-rj-primary py-1 px-3' : 'btn-rj-ghost py-1 px-3'}
            style={{ fontSize: '0.825rem' }}
          >
            Harian
          </button>
          <button
            type="button"
            onClick={() => setPeriodType('monthly')}
            className={
              periodType === 'monthly' ? 'btn-rj-primary py-1 px-3' : 'btn-rj-ghost py-1 px-3'
            }
            style={{ fontSize: '0.825rem' }}
          >
            Bulanan
          </button>
        </div>

        {periodType === 'daily' ? (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value || '2026-11-10')}
            aria-label="Pilih tanggal rekap harian"
            className="rj-form-control"
            style={{ width: 'auto', fontSize: '0.85rem' }}
          />
        ) : (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value || '2026-11')}
            aria-label="Pilih bulan rekap bulanan"
            className="rj-form-control"
            style={{ width: 'auto', fontSize: '0.85rem' }}
          />
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="btn-rj-secondary"
          title="Cetak atau simpan rekapitulasi ke PDF"
        >
          <Printer size={16} />
          <span className="d-none d-sm-inline">Cetak Rekap</span>
        </button>
      </div>
    }
  >
    {isLoading ? (
      <LoadingState rows={5} showCards={true} />
    ) : error ? (
      <ErrorState message={error} onRetry={loadRecap} />
    ) : (
      <div className="d-flex flex-column gap-4">
        {/* Penjelasan Transparansi Logika Keuangan */}
        <div
          className="rj-card p-3 d-flex align-items-start gap-2"
          style={{
            backgroundColor: 'var(--rj-primary-subtle)',
            borderColor: 'var(--rj-primary-border)',
            fontSize: '0.8125rem'
          }}
        >
          <Info
            size={18}
            weight="fill"
            style={{ color: 'var(--rj-primary)', flexShrink: 0, marginTop: '2px' }}
          />
          <div>
            <strong style={{ color: 'var(--rj-text-primary)' }}>{periodDisplayLabel}:</strong>{' '}
            <span style={{ color: 'var(--rj-text-secondary)' }}>
              Sesuai aturan bisnis <strong>BR-02 & BR-04</strong>, uang kas masuk dihitung dari{' '}
              <strong>penjualan tunai</strong> ditambah <strong>pelunasan piutang yang diterima</strong>.
              Penjualan tempo (piutang baru) dicatat terpisah dan belum diperhitungkan sebagai kas.
            </span>
          </div>
        </div>

        {/* 4 Summary Cards Utama */}
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-xl-3">
            <SummaryCard
              label="Total Kas Masuk Aktual"
              amount={summary.actualCashReceived}
              icon={ArrowDownLeft}
              highlightPrimary={true}
              subDetail={`Tunai: ${formatRupiah(summary.cashSales)}`}
              periodNote={`+ Pelunasan Piutang: ${formatRupiah(summary.receivablePaymentsReceived)}`}
            />
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <SummaryCard
              label="Total Pengeluaran Operasional"
              amount={summary.totalExpenses}
              icon={ArrowUpRight}
              subDetail={`${summary.expenseCount || 0} catatan biaya`}
              periodNote={periodDisplayLabel}
            />
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <SummaryCard
              label="Laba Bersih Kas (BR-04)"
              amount={summary.netCashProfit}
              icon={Wallet}
              subDetail={`Laba Basis Transaksi: ${formatRupiah(summary.netTransactionProfit)}`}
              periodNote="Kas Masuk Aktual - Pengeluaran"
            />
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <SummaryCard
              label="Penjualan Tempo (Piutang Baru)"
              amount={summary.creditSales}
              icon={Notebook}
              subDetail={`Sisa Belum Lunas: ${formatRupiah(summary.periodUnpaidReceivables)}`}
              periodNote={`Total Nilai Penjualan: ${formatRupiah(summary.totalSalesTransaction)}`}
            />
          </div>
        </div>

        {/* Grafik & Rincian Air & Biaya */}
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="rj-card h-100 p-3 p-md-4">
              <h3 className="mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>
                Grafik Tren Arus Kas ({periodDisplayLabel})
              </h3>
              <p className="mb-3" style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}>
                Perbandingan kas diterima, piutang tempo baru, dan pengeluaran harian.
              </p>
              <FinancialBarChart series={data?.chartSeries || []} />
            </div>
          </div>

          <div className="col-12 col-lg-5">
              <div className="rj-card h-100 p-3 p-md-4 d-flex flex-column justify-content-between">
                <div>
                  {/* FR-REK-02: Rincian Pemasukan per Jenis Air (Air Mineral vs Air RO) */}
                  <h3 className="mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Penjualan Berdasarkan Jenis Air
                  </h3>
                  <p className="mb-3" style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}>
                    Rincian kuantitas galon dan omzet per jenis air minum.
                  </p>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div
                        className="p-3"
                        style={{
                          backgroundColor: 'var(--rj-bg)',
                          border: '1px solid var(--rj-border)',
                          borderRadius: '8px'
                        }}
                      >
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <Drop size={15} style={{ color: 'var(--rj-primary)' }} weight="fill" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Air Mineral</span>
                        </div>
                        <div className="font-tabular fw-bold" style={{ fontSize: '1.05rem' }}>
                          {formatRupiah(waterBreakdown.mineralSales)}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--rj-text-secondary)' }}>
                          {waterBreakdown.mineralGalonCount} galon terjual
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        className="p-3"
                        style={{
                          backgroundColor: 'var(--rj-bg)',
                          border: '1px solid var(--rj-border)',
                          borderRadius: '8px'
                        }}
                      >
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <Drop size={15} style={{ color: '#1D4ED8' }} weight="fill" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Air RO</span>
                        </div>
                        <div className="font-tabular fw-bold" style={{ fontSize: '1.05rem' }}>
                          {formatRupiah(waterBreakdown.roSales)}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--rj-text-secondary)' }}>
                          {waterBreakdown.roGalonCount} galon terjual
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rincian Komposisi Biaya Operasional */}
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Rincian Pengeluaran Operasional
                  </h4>
                  {!data?.expenseBreakdown || data.expenseBreakdown.length === 0 ? (
                    <div
                      className="p-3 text-center"
                      style={{
                        backgroundColor: 'var(--rj-bg)',
                        border: '1px solid var(--rj-border)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: 'var(--rj-text-secondary)'
                      }}
                    >
                      Tidak ada pengeluaran pada periode ini.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {data.expenseBreakdown.map((item) => (
                        <div
                          key={item.category}
                          className="d-flex align-items-center justify-content-between p-2 px-3"
                          style={{
                            backgroundColor: 'var(--rj-white)',
                            border: '1px solid var(--rj-border)',
                            borderRadius: '8px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <span className="fw-medium">{item.category}</span>
                          <div className="d-flex align-items-center gap-2 font-tabular">
                            <span style={{ color: 'var(--rj-text-secondary)' }}>
                              ({item.percentage}%)
                            </span>
                            <span className="fw-semibold">{formatRupiah(item.amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="mt-3 pt-2 d-flex justify-content-between align-items-center"
                  style={{ borderTop: '1px solid var(--rj-border)', fontSize: '0.8rem' }}
                >
                  <span style={{ color: 'var(--rj-text-secondary)' }}>Total Biaya Operasional:</span>
                  <strong className="font-tabular" style={{ fontSize: '0.95rem' }}>
                    {formatRupiah(summary.totalExpenses)}
                  </strong>
                </div>
              </div>
                </div>
              </div>

              {/* Tabel Buku Kas & Transaksi Periode */}
              <div className="rj-card">
                <div
                  className="p-3 p-md-4 d-flex flex-wrap align-items-center justify-content-between gap-2"
                  style={{ borderBottom: '1px solid var(--rj-border)' }}
                >
                  <div>
                    <h3 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600 }}>
                      Daftar Transaksi Periode ({periodDisplayLabel})
                    </h3>
                    <p className="mb-0 mt-1" style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}>
                      Rincian seluruh penjualan galon, pembayaran piutang, dan pengeluaran operasional.
                    </p>
                  </div>

                  <div
                    className="d-inline-flex flex-wrap gap-1 p-1"
                    style={{
                      backgroundColor: 'var(--rj-bg)',
                      border: '1px solid var(--rj-border)',
                      borderRadius: '8px'
                    }}
                  >
                    {[
                      { id: 'ALL', label: 'Semua' },
                      { id: 'INCOME', label: 'Penjualan' },
                      { id: 'RECEIVABLE_PAY', label: 'Pelunasan Piutang' },
                      { id: 'EXPENSE', label: 'Pengeluaran' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveLedgerTab(tab.id)}
                        className={
                          activeLedgerTab === tab.id
                            ? 'btn-rj-primary py-1 px-2'
                            : 'btn-rj-ghost py-1 px-2'
                        }
                        style={{ fontSize: '0.76rem' }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <DataTable
                  columns={ledgerColumns}
                  data={ledgerRows}
                  emptyTitle="Tidak Ada Transaksi pada Periode Ini"
                  emptyDescription="Pilih tanggal atau bulan lain untuk melihat rincian transaksi."
                  renderMobileCard={(row) => (
                    <div>
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                        <span style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                          {formatTanggalIndonesia(row.date)}
                        </span>
                        <StatusBadge
                          status={row.status}
                          variant={
                            row.status === 'Kas Masuk'
                              ? 'success'
                          : row.status === 'Piutang Tempo'
                        ? 'warning'
                        : 'neutral'
                      }
                    />
                      </div>
                      <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                        {row.category}
                      </div>
                      <div
                        className="mb-2"
                        style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}
                      >
                        {row.description}
                      </div>
                      <div
                        className="d-flex justify-content-between align-items-center pt-2"
                        style={{ borderTop: '1px solid var(--rj-border-subtle)' }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                          Nominal
                        </span>
                        <span className="font-tabular fw-bold" style={{ fontSize: '0.9rem' }}>
                          {formatRupiah(row.amount)}
                        </span>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
      )}
          </PageContainer>
          );
}
