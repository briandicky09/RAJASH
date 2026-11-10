import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Notebook,
  ChartBar,
  CheckCircle,
  ShieldCheck,
  ClockAfternoon
} from '@phosphor-icons/react';
import BrandLogo from '../components/layout/BrandLogo';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../utils/formatters';

const PREVIEW_TABS = [
  {
    id: 'ringkasan',
    label: 'Ringkasan Hari Ini',
    metrics: [
      { label: 'Kas Diterima (Tunai + Cicilan)', value: 282000, note: 'Uang tunai masuk hari ini' },
      { label: 'Pengeluaran Operasional', value: 35000, note: 'BBM becak pengantar' },
      { label: 'Laba Bersih Kas', value: 247000, note: 'Selisih kas masuk & biaya' },
      { label: 'Total Piutang Aktif', value: 450000, note: '4 pelanggan belum lunas' }
    ],
    rows: [
      {
        title: 'Warkop Kupi Khop Ulee Kareng',
        sub: '15 galon isi ulang - Tunai',
        amount: 90000,
        status: 'Tunai Diterima'
      },
      {
        title: 'RM Kari Kambing Pak Hasan',
        sub: '25 galon via WhatsApp - Kredit',
        amount: 150000,
        status: 'Piutang Kredit'
      },
      {
        title: 'BBM Becak Pengantar',
        sub: 'Pengeluaran Operasional',
        amount: 35000,
        status: 'Tercatat'
      }
    ]
  },
  {
    id: 'piutang',
    label: 'Pantauan Piutang',
    metrics: [
      { label: 'Total Tagihan Aktif', value: 450000, note: 'Dari 4 pelanggan' },
      { label: 'Cicilan Diterima Bulan Ini', value: 330000, note: 'Tercatat ke kas masuk' },
      { label: 'Tagihan Lunas Bulan Ini', value: 120000, note: 'Toko Kelontong Bang Joni' },
      { label: 'Pengingat Evaluasi', value: '22.00 WIB', isText: true, note: 'Sebelum tutup operasional' }
    ],
    rows: [
      {
        title: 'RM Kari Kambing Pak Hasan',
        sub: '10 Nov 2026 - Sisa dari Rp150.000',
        amount: 150000,
        status: 'Belum Lunas'
      },
      {
        title: 'Katering Ibu Cut Meutia',
        sub: '8 Nov 2026 - Sudah bayar Rp100.000',
        amount: 110000,
        status: 'Belum Lunas'
      },
      {
        title: 'Asrama Mahasiswa Darussalam',
        sub: '9 Nov 2026 - Sudah bayar Rp80.000',
        amount: 100000,
        status: 'Belum Lunas'
      }
    ]
  }
];

const CORE_FEATURES = [
  {
    icon: ArrowDownLeft,
    title: 'Pencatatan Transaksi',
    description:
      'Catat penjualan galon tunai maupun pesanan kredit via WhatsApp dengan cepat. Dilengkapi deteksi otomatis untuk mencegah pencatatan transaksi ganda.',
    highlight: 'Pisahkan uang tunai yang sudah diterima dari penjualan kredit secara akurat.'
  },
  {
    icon: ArrowUpRight,
    title: 'Pengelolaan Pengeluaran',
    description:
      'Dokumentasikan biaya operasional harian sesuai kebutuhan depot: BBM becak, servis kendaraan, penggantian oli, perbaikan ban, dan pasokan air.',
    highlight: '6 kategori operasional standar depot air minum.'
  },
  {
    icon: Notebook,
    title: 'Pemantauan Piutang',
    description:
      'Pantau daftar pelanggan yang belum lunas, catat pembayaran cicilan maupun pelunasan penuh, serta lihat pengingat tagihan sebelum operasional berakhir.',
    highlight: 'Sisa piutang diperbarui otomatis setiap kali pembayaran dicatat.'
  },
  {
    icon: ChartBar,
    title: 'Rekapitulasi Keuangan',
    description:
      'Lihat ringkasan pemasukan, pengeluaran operasional, dan perhitungan laba bersih secara otomatis berdasarkan periode harian maupun bulanan.',
    highlight: 'Laporan kas diterima dan nilai penjualan tersaji transparan.'
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [activePreviewTab, setActivePreviewTab] = useState('ringkasan');

  const currentPreview =
    PREVIEW_TABS.find((t) => t.id === activePreviewTab) || PREVIEW_TABS[0];

  const primaryCtaPath = isAuthenticated ? '/dashboard' : '/login';
  const primaryCtaLabel = isAuthenticated ? 'Buka Dashboard' : 'Masuk ke Aplikasi';

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--rj-bg)' }}>
      {/* A. Navbar Minimalis (Satu baris, tinggi terkontrol) */}
      <header
        style={{
          height: '68px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--rj-border)',
          position: 'sticky',
          top: 0,
          zIndex: 1020
        }}
      >
        <div
          className="h-100 d-flex align-items-center justify-content-between mx-auto px-3 px-md-4"
          style={{ maxWidth: '1240px' }}
        >
          <BrandLogo size={34} showSubtitle={true} />

          <nav className="d-none d-md-flex align-items-center gap-4" aria-label="Navigasi halaman depan">
            <a
              href="#fitur-utama"
              className="text-decoration-none"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--rj-text-secondary)'
              }}
            >
              Fitur Utama
            </a>
            <a
              href="#alur-pencatatan"
              className="text-decoration-none"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--rj-text-secondary)'
              }}
            >
              Prinsip Pencatatan
            </a>
          </nav>

          <div className="d-flex align-items-center gap-2">
            <Link to={primaryCtaPath} className="btn-rj-primary">
              <span>{primaryCtaLabel}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* B. Hero Section (Split Screen Asymmetric Layout) */}
      <section
        className="py-5"
        style={{
          backgroundColor: 'var(--rj-white)',
          borderBottom: '1px solid var(--rj-border)'
        }}
      >
        <div className="mx-auto px-3 px-md-4 py-md-3" style={{ maxWidth: '1240px' }}>
          <div className="row align-items-center g-4 g-lg-5">
            {/* Kolom Kiri: Headline, Deskripsi Singkat, dan CTA */}
            <div className="col-12 col-lg-5">
              <div className="mb-3">
                <span className="rj-badge rj-badge-info">
                  Depot Air Minum Isi Ulang RAJASH - Ulee Kareng
                </span>
              </div>

              <h1
                className="mb-3"
                style={{
                  fontSize: 'clamp(2rem, 3.6vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.12,
                  color: 'var(--rj-text-primary)'
                }}
              >
                Kelola Keuangan Usaha Lebih Mudah.
              </h1>

              <p
                className="mb-4"
                style={{
                  fontSize: '1.025rem',
                  color: 'var(--rj-text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '48ch'
                }}
              >
                Catat pemasukan, pantau pengeluaran, dan kelola piutang RAJASH dalam satu tempat.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <Link to={primaryCtaPath} className="btn-rj-primary px-4 py-2">
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight size={16} />
                </Link>
                <a href="#fitur-utama" className="btn-rj-secondary px-3 py-2">
                  Lihat Fungsi Sistem
                </a>
              </div>
            </div>

            {/* Kolom Kanan: Interactive Component Preview Dashboard Aplikasi */}
            <div className="col-12 col-lg-7">
              <div className="rj-shell-frame">
                <div className="rj-shell-inner p-3 p-md-4">
                  {/* Top Bar Pratinjau Interaktif */}
                  <div
                    className="d-flex flex-wrap align-items-center justify-content-between gap-2 pb-3 mb-3"
                    style={{ borderBottom: '1px solid var(--rj-border)' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--rj-primary)',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                        Pratinjau Buku Kas & Piutang RAJASH
                      </span>
                      <span className="rj-badge rj-badge-neutral" style={{ fontSize: '0.68rem' }}>
                        Data Simulasi
                      </span>
                    </div>

                    <div className="d-inline-flex gap-1 p-1" style={{ backgroundColor: 'var(--rj-bg)', borderRadius: '8px', border: '1px solid var(--rj-border)' }}>
                      {PREVIEW_TABS.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActivePreviewTab(tab.id)}
                          className={
                            activePreviewTab === tab.id ? 'btn-rj-primary py-1 px-2' : 'btn-rj-ghost py-1 px-2'
                          }
                          style={{ fontSize: '0.75rem' }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4 Metrik Ringkas di dalam Preview */}
                  <div className="row g-2 mb-3">
                    {currentPreview.metrics.map((m, idx) => (
                      <div key={idx} className="col-6 col-sm-3">
                        <div
                          className="p-2 px-3 h-100"
                          style={{
                            backgroundColor: 'var(--rj-bg)',
                            border: '1px solid var(--rj-border)',
                            borderRadius: '8px'
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: 'var(--rj-text-secondary)',
                              marginBottom: '4px'
                            }}
                          >
                            {m.label}
                          </div>
                          <div
                            className="font-tabular fw-bold"
                            style={{ fontSize: '0.95rem', color: 'var(--rj-text-primary)' }}
                          >
                            {m.isText ? m.value : formatRupiah(m.value)}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--rj-text-secondary)' }}>
                            {m.note}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Daftar Baris Transaksi / Piutang pada Preview */}
                  <div
                    className="p-2 px-3"
                    style={{
                      backgroundColor: 'var(--rj-white)',
                      border: '1px solid var(--rj-border)',
                      borderRadius: '8px'
                    }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center py-1 mb-1"
                      style={{
                        borderBottom: '1px solid var(--rj-border-subtle)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--rj-text-secondary)'
                      }}
                    >
                      <span>RINCIAN CATATAN</span>
                      <span>NOMINAL & STATUS</span>
                    </div>
                    {currentPreview.rows.map((row, idx) => (
                      <div
                        key={idx}
                        className="d-flex flex-wrap align-items-center justify-content-between gap-2 py-2"
                        style={{
                          borderBottom:
                            idx < currentPreview.rows.length - 1
                              ? '1px solid var(--rj-border-subtle)'
                              : 'none'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                            {row.title}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--rj-text-secondary)' }}>
                            {row.sub}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 ms-auto">
                          <span
                            className="font-tabular fw-semibold"
                            style={{ fontSize: '0.85rem' }}
                          >
                            {formatRupiah(row.amount)}
                          </span>
                          <StatusBadge status={row.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* C. Feature Highlights (Maksimal 4 Fitur Utama dalam Bento Grid 2x2) */}
      <section id="fitur-utama" className="py-5">
        <div className="mx-auto px-3 px-md-4 py-md-2" style={{ maxWidth: '1240px' }}>
          <div className="mb-4" style={{ maxWidth: '600px' }}>
            <h2
              className="mb-2"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 700 }}
            >
              Empat Modul Inti Pengelolaan Keuangan RAJASH
            </h2>
            <p className="mb-0" style={{ color: 'var(--rj-text-secondary)', fontSize: '0.925rem' }}>
              Dirancang khusus menggantikan pencatatan buku besar manual agar pemilik usaha dapat
              memantau arus kas dan tagihan pelanggan dengan cepat.
            </p>
          </div>

          <div className="row g-3 g-md-4">
            {CORE_FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="col-12 col-md-6">
                  <div className="rj-card h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div
                        className="d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--rj-primary-subtle)',
                          color: 'var(--rj-primary)',
                          border: '1px solid var(--rj-primary-border)'
                        }}
                      >
                        <Icon size={21} weight="regular" />
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {feat.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.885rem',
                          color: 'var(--rj-text-secondary)',
                          marginBottom: '1rem'
                        }}
                      >
                        {feat.description}
                      </p>
                    </div>

                    <div
                      className="d-flex align-items-center gap-2 pt-3"
                      style={{
                        borderTop: '1px solid var(--rj-border-subtle)',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: 'var(--rj-text-primary)'
                      }}
                    >
                      <CheckCircle
                        size={16}
                        weight="fill"
                        style={{ color: 'var(--rj-primary)', flexShrink: 0 }}
                      />
                      <span>{feat.highlight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ringkasan Prinsip Pencatatan (Ringkas & Fungsional) */}
      <section
        id="alur-pencatatan"
        className="py-4"
        style={{
          backgroundColor: 'var(--rj-white)',
          borderTop: '1px solid var(--rj-border)',
          borderBottom: '1px solid var(--rj-border)'
        }}
      >
        <div className="mx-auto px-3 px-md-4 py-2" style={{ maxWidth: '1240px' }}>
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-start gap-3">
                <ShieldCheck
                  size={24}
                  style={{ color: 'var(--rj-primary)', flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Pencegahan Transaksi Ganda
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}>
                    Peringatan otomatis saat terdapat kesamaan tanggal, pelanggan, dan nominal.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-start gap-3">
                <Notebook
                  size={24}
                  style={{ color: 'var(--rj-primary)', flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Pemisahan Tunai & Kredit
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}>
                    Penjualan kredit tercatat sebagai piutang hingga pembayaran benar-benar diterima.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-start gap-3">
                <ClockAfternoon
                  size={24}
                  style={{ color: 'var(--rj-primary)', flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Pengingat Piutang Harian
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}>
                    Ringkasan tagihan aktif di dalam aplikasi untuk dievaluasi setiap hari.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. Footer Sederhana */}
      <footer className="mt-auto py-4" style={{ backgroundColor: 'var(--rj-bg)' }}>
        <div
          className="mx-auto px-3 px-md-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{ maxWidth: '1240px', fontSize: '0.8125rem', color: 'var(--rj-text-secondary)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <BrandLogo size={26} showSubtitle={false} />
            <span>Depot Air Minum Isi Ulang RAJASH, Ulee Kareng, Banda Aceh.</span>
          </div>
          <div>
            Capstone Project Asah 2026 (Tim A26-CS148)
          </div>
        </div>
      </footer>
    </div>
  );
}

