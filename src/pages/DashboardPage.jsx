import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Notebook,
  Plus,
  ArrowRight,
  Sparkle
} from '@phosphor-icons/react';
import PageContainer from '../components/layout/PageContainer';
import SummaryCard from '../components/common/SummaryCard';
import FinancialBarChart from '../components/common/FinancialBarChart';
import ReceivableReminderCard from '../components/common/ReceivableReminderCard';
import AIInsightCard from '../components/common/AIInsightCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { fetchDashboardData } from '../services/financeService';
import {
  formatRupiah,
  formatTanggalIndonesia,
  formatBulanIndonesia
} from '../utils/formatters';

export default function DashboardPage() {
  const [periodType, setPeriodType] = useState('monthly'); // 'monthly' | 'all'
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fetchDashboardData({
        periodType,
        month: selectedMonth
      });
      setData(result);
    } catch (err) {
      setError(err.message || 'Gagal memuat ringkasan dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, [periodType, selectedMonth]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const handleReset = () => loadDashboard();
    window.addEventListener('rajash:data-reset', handleReset);
    return () => window.removeEventListener('rajash:data-reset', handleReset);
  }, [loadDashboard]);

  const periodLabel =
    periodType === 'monthly'
      ?`Bulan ${formatBulanIndonesia(selectedMonth)}`
      : 'Seluruh Periode';

  const summary = data?.summary || {
    actualCashReceived: 0,
    totalSalesTransaction: 0,
    cashSales: 0,
    creditSales: 0,
    receivablePaymentsReceived: 0,
    totalExpenses: 0,
    netCashProfit: 0,
    netTransactionProfit: 0,
    totalUnpaidReceivables: 0,
    activeReceivablesCount: 0
  };

  const todaySummary = data?.todaySummary || {
    actualCashReceived: 0,
    totalExpenses: 0,
    netCashProfit: 0
  };

  return (
    <PageContainer
      title="Dashboard Arus Kas & Piutang RAJASH"
      subtitle="Ringkasan pemasukan kas, pengeluaran operasional, laba bersih, piutang pelanggan, dan proyeksi AI."
      headerActions={
        <div className="d-flex flex-wrap align-items-center gap-2">
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
              onClick={() => setPeriodType('monthly')}
              className={periodType === 'monthly' ? 'btn-rj-primary py-1 px-2' : 'btn-rj-ghost py-1 px-2'}
              style={{ fontSize: '0.8rem' }}
            >
              Bulan Ini
            </button>
            <button
              type="button"
              onClick={() => setPeriodType('all')}
              className={periodType === 'all' ? 'btn-rj-primary py-1 px-2' : 'btn-rj-ghost py-1 px-2'}
              style={{ fontSize: '0.8rem' }}
            >
              Semua Waktu
            </button>
          </div>

          {periodType === 'monthly' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value || '2026-11')}
              aria-label="Pilih bulan ringkasan"
              className="rj-form-control"
              style={{ width: 'auto', fontSize: '0.825rem', padding: '0.45rem 0.7rem' }}
            />
          )}

          <Link to="/pemasukan" className="btn-rj-primary">
            <Plus size={16} weight="bold" />
            <span>Catat Penjualan</span>
          </Link>
        </div>
      }
    >
      {isLoading ? (
        <LoadingState rows={5} showCards={true} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDashboard} />
      ) : (
        <div className="d-flex flex-column gap-4">
          {/* FR-DSH-01: Ringkasan Hari Ini & Bulan Ini */}
          <section aria-label="Metrik utama keuangan">
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-xl-3">
                <SummaryCard
                  label="Pemasukan Kas Diterima"
                  amount={summary.actualCashReceived}
                  icon={ArrowDownLeft}
                  highlightPrimary={true}
                  subDetail={`Hari ini: ${formatRupiah(todaySummary.actualCashReceived)}`}
                  periodNote={`Tunai: ${formatRupiah(summary.cashSales)} | Pelunasan Piutang: ${formatRupiah(summary.receivablePaymentsReceived)}`}
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <SummaryCard
                  label="Pengeluaran Operasional"
                  amount={summary.totalExpenses}
                  icon={ArrowUpRight}
                  subDetail={`Hari ini: ${formatRupiah(todaySummary.totalExpenses)}`}
                  periodNote={`${summary.expenseCount || 0} catatan operasional (${periodLabel})`}
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <SummaryCard
                  label="Laba Bersih Kas"
                  amount={summary.netCashProfit}
                  icon={Wallet}
                  subDetail={`Hari ini: ${formatRupiah(todaySummary.netCashProfit)}`}
                  periodNote="Rumus: Kas Diterima - Pengeluaran"
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <SummaryCard
                  label="Total Piutang Belum Lunas"
                  amount={summary.totalUnpaidReceivables}
                  icon={Notebook}
                  subDetail={`${summary.activeReceivablesCount} tagihan pelanggan aktif`}
                  periodNote="Belum termasuk uang kas yang diterima"
                />
              </div>
            </div>
          </section>

          {/* FR-DSH-05 & FR-AIE: Modul Kecerdasan Buatan (Proyeksi Prediksi & Generative AI) */}
          <section aria-label="Insight kecerdasan buatan">
            <AIInsightCard insightData={data?.aiInsight} onRefresh={loadDashboard} />
          </section>

          {/* FR-RMD: Pengingat Piutang Ringkas di Dalam Aplikasi */}
          <section aria-label="Pengingat piutang">
            <ReceivableReminderCard
              activeReceivables={data?.allActiveReceivables || []}
              compact={true}
            />
          </section>

          {/* Grafik & Daftar Piutang */}
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <div className="rj-card h-100 p-3 p-md-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <div>
                    <h3 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600 }}>
                      Grafik Arus Kas Harian
                    </h3>
                    <p className="mb-0 mt-1" style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}>
                      Perbandingan kas diterima, piutang tempo, dan pengeluaran harian ({periodLabel}).
                    </p>
                  </div>
                  <Link
                    to="/rekapitulasi"
                    className="btn-rj-ghost py-1 px-2 text-decoration-none"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <span>Rekap Lengkap</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <FinancialBarChart series={data?.chartSeries || []} />
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="rj-card h-100 p-3 p-md-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                    <div>
                      <h3 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600 }}>
                        Daftar Piutang Pelanggan
                      </h3>
                      <p className="mb-0 mt-1" style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}>
                        Tagihan penjualan tempo yang belum lunas.
                      </p>
                    </div>
                    <Link
                      to="/piutang"
                      className="btn-rj-secondary py-1 px-2 text-decoration-none"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <span>Semua Piutang</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  {!data?.outstandingReceivables || data.outstandingReceivables.length === 0 ? (
                    <EmptyState
                      title="Tidak Ada Piutang Aktif"
                      description="Seluruh tagihan pelanggan saat ini telah lunas."
                    />
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {data.outstandingReceivables.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 d-flex align-items-center justify-content-between gap-2"
                          style={{
                            backgroundColor: 'var(--rj-bg)',
                            border: '1px solid var(--rj-border)',
                            borderRadius: '8px'
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div
                              className="fw-semibold text-truncate"
                              style={{ fontSize: '0.85rem', color: 'var(--rj-text-primary)' }}
                            >
                              {item.customer_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                              Transaksi {formatTanggalIndonesia(item.transaction_date)}
                            </div>
                          </div>

                          <div className="text-end flex-shrink-0">
                            <div
                              className="font-tabular fw-bold"
                              style={{ fontSize: '0.875rem', color: 'var(--rj-text-primary)' }}
                            >
                              {formatRupiah(item.remaining_amount)}
                            </div>
                            <StatusBadge status={item.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="mt-3 pt-3 d-flex align-items-center justify-content-between"
                  style={{ borderTop: '1px solid var(--rj-border)', fontSize: '0.8rem' }}
                >
                  <span style={{ color: 'var(--rj-text-secondary)' }}>
                    Total Sisa Tagihan Aktif:
                  </span>
                  <strong className="font-tabular" style={{ fontSize: '0.9rem' }}>
                    {formatRupiah(summary.totalUnpaidReceivables)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Transaksi Terbaru (FR-HIS) */}
          <section aria-label="Transaksi terbaru">
            <div className="rj-card">
              <div
                className="p-3 p-md-4 d-flex flex-wrap align-items-center justify-content-between gap-2"
                style={{ borderBottom: '1px solid var(--rj-border)' }}
              >
                <div>
                  <h3 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Riwayat Transaksi Terbaru
                  </h3>
                  <p className="mb-0 mt-1" style={{ fontSize: '0.8rem', color: 'var(--rj-text-secondary)' }}>
                    6 aktivitas pemasukan dan pengeluaran terakhir yang tercatat di depot.
                  </p>
                </div>

                <div className="d-flex gap-2">
                  <Link to="/pemasukan" className="btn-rj-secondary py-1 px-2" style={{ fontSize: '0.8rem' }}>
                    Riwayat Pemasukan
                  </Link>
                  <Link to="/pengeluaran" className="btn-rj-secondary py-1 px-2" style={{ fontSize: '0.8rem' }}>
                    Riwayat Pengeluaran
                  </Link>
                </div>
              </div>

              {!data?.recentTransactions || data.recentTransactions.length === 0 ? (
                <EmptyState
                  title="Belum Ada Transaksi"
                  description="Transaksi pemasukan dan pengeluaran yang baru dicatat akan muncul di sini."
                />
              ) : (
                <>
                  <div className="d-md-none d-flex flex-column gap-2 p-3">
                    {data.recentTransactions.map((trx) => (
                      <div
                        key={trx.id}
                        className="p-3"
                        style={{
                          backgroundColor: 'var(--rj-white)',
                          border: '1px solid var(--rj-border)',
                          borderRadius: '10px'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                          <span style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                            {formatTanggalIndonesia(trx.date)}
                          </span>
                          <StatusBadge status={trx.status} />
                        </div>
                        <div className="fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>
                          {trx.description}
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid var(--rj-border-subtle)' }}>
                          <span style={{ fontSize: '0.775rem', color: 'var(--rj-text-secondary)' }}>
                            {trx.type} ({trx.subType})
                          </span>
                          <span className="font-tabular fw-bold" style={{ fontSize: '0.9rem' }}>
                            {formatRupiah(trx.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-none d-md-block rj-table-wrapper">
                    <table className="rj-table">
                      <thead>
                        <tr>
                          <th>Tanggal</th>
                          <th>Rincian Transaksi</th>
                          <th>Tipe / Kategori</th>
                          <th style={{ textAlign: 'right' }}>Nominal</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentTransactions.map((trx) => (
                          <tr key={trx.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              {formatTanggalIndonesia(trx.date)}
                            </td>
                            <td>
                              <div className="fw-medium">{trx.description}</div>
                            </td>
                            <td>
                              <span className="fw-medium">{trx.type}</span>{' '}
                              <span style={{ color: 'var(--rj-text-secondary)', fontSize: '0.8rem' }}>
                                ({trx.subType})
                              </span>
                            </td>
                            <td data-numeric="true" style={{ textAlign: 'right', fontWeight: 600 }}>
                              {formatRupiah(trx.amount)}
                            </td>
                            <td>
                              <StatusBadge status={trx.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </PageContainer>
  );
}
