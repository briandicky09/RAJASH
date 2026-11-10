import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  Notebook,
  ChartBar,
  SquaresFour,
  Wallet,
  BellRinging,
  Warning,
  Drop,
  GasPump,
  Wrench,
  Truck,
  Receipt,
  CalendarCheck,
  ShieldCheck,
  Sparkle
} from '@phosphor-icons/react';
import LandingNavbar from '../components/layout/LandingNavbar';
import LandingFooter from '../components/layout/LandingFooter';
import Accordion from '../components/common/Accordion';
import { useAuth } from '../context/AuthContext';

const HERO_MARQUEE_ITEMS = [
  'PENCATATAN PEMASUKAN',
  'PENGELUARAN OPERASIONAL',
  'MANAJEMEN PIUTANG',
  'STATUS LUNAS & BELUM LUNAS',
  'REKAP HARIAN & BULANAN',
  'KEUNTUNGAN BERSIH',
  'DETEKSI TRANSAKSI DUPLIKAT',
  'PENGINGAT PIUTANG APLIKASI'
];

const ORBIT_NODES = [
  { label: 'BBM Becak', icon: GasPump, top: '4%', left: '50%', transform: 'translate(-50%, 0)' },
  { label: 'Pasokan Air', icon: Drop, top: '18%', left: '84%', transform: 'translate(-50%, -50%)' },
  { label: 'Servis Becak', icon: Wrench, top: '50%', left: '96%', transform: 'translate(-100%, -50%)' },
  { label: 'Ganti Oli', icon: Truck, top: '82%', left: '84%', transform: 'translate(-50%, -50%)' },
  { label: 'Perbaikan Ban', icon: ShieldCheck, top: '96%', left: '50%', transform: 'translate(-50%, -100%)' },
  { label: 'Biaya Lainnya', icon: Receipt, top: '82%', left: '16%', transform: 'translate(-50%, -50%)' },
  { label: 'Kas Tunai', icon: Wallet, top: '50%', left: '4%', transform: 'translate(0, -50%)' },
  { label: 'Piutang Kredit', icon: Notebook, top: '18%', left: '16%', transform: 'translate(-50%, -50%)' }
];

const CAPABILITY_CARDS = [
  {
    id: 'dashboard',
    title: 'Dashboard Keuangan',
    icon: SquaresFour,
    badge: '4 Ringkasan Utama',
    metricLabel: 'Keuntungan Bersih Kas',
    metricValue: 'Rp 1.085.000',
    subText: 'Kas Masuk Rp 1.880.000 · Beban Rp 795.000',
    description:
      'Menampilkan total pemasukan, total pengeluaran, keuntungan bersih, total piutang, grafik keuangan, dan transaksi terbaru dalam satu tampilan.'
  },
  {
    id: 'pemasukan',
    title: 'Pencatatan Pemasukan',
    icon: ArrowDownLeft,
    badge: 'Tunai & Kredit',
    metricLabel: 'Penjualan Hari Ini',
    metricValue: 'Rp 390.000',
    subText: 'Tunai (Lunas) & Kredit (Belum Lunas)',
    description:
      'Mencatat penjualan air minum isi ulang baik pembayaran tunai maupun kredit, lengkap dengan peringatan kemungkinan transaksi duplikat.'
  },
  {
    id: 'pengeluaran',
    title: 'Pencatatan Pengeluaran',
    icon: ArrowUpRight,
    badge: '6 Kategori Baku',
    metricLabel: 'Total Beban Operasional',
    metricValue: 'Rp 795.000',
    subText: 'BBM Becak, Pasokan Air, Servis, Oli, Ban, Lainnya',
    description:
      'Mendokumentasikan biaya rutin operasional depot sesuai kategori yang telah ditetapkan agar perhitungan keuntungan bersih akurat.'
  },
  {
    id: 'piutang',
    title: 'Pengelolaan Piutang',
    icon: Notebook,
    badge: 'Status Pembayaran',
    metricLabel: 'Total Piutang Aktif',
    metricValue: 'Rp 505.000',
    subText: '4 pelanggan berstatus Belum Lunas',
    description:
      'Memantau daftar pelanggan yang masih memiliki utang, memeriksa tanggal transaksi, serta memperbarui status dari Belum Lunas menjadi Lunas.'
  },
  {
    id: 'rekapitulasi',
    title: 'Rekapitulasi Keuangan',
    icon: ChartBar,
    badge: 'Harian & Bulanan',
    metricLabel: 'Periode Rekapitulasi',
    metricValue: 'Harian / Bulanan',
    subText: 'Ekspor CSV & Cetak Laporan Pembukuan',
    description:
      'Menyajikan rekapitulasi pemasukan, pengeluaran, piutang, dan perhitungan keuntungan bersih berdasarkan periode harian maupun bulanan.'
  },
  {
    id: 'pengingat',
    title: 'Pengingat Piutang Aplikasi',
    icon: BellRinging,
    badge: 'Pantauan Tagihan',
    metricLabel: 'Tagihan Perlu Tindak Lanjut',
    metricValue: '2 Pelanggan > 5 Hari',
    subText: 'Urutkan dari piutang terlama atau terbesar',
    description:
      'Memberikan pengingat di dalam aplikasi bagi pemilik usaha terhadap piutang pelanggan yang belum dilunasi tanpa memerlukan integrasi eksternal.'
  }
];

const FAQ_ITEMS = [
  {
    question: 'Apa itu RAJASH?',
    answer:
      'RAJASH adalah sistem pengelolaan keuangan dan piutang berbasis web yang dirancang untuk membantu pemilik usaha Depot Air Minum Isi Ulang RAJASH di Ulee Kareng, Banda Aceh dalam mencatat pemasukan, pengeluaran operasional, piutang pelanggan, serta melihat laporan rekapitulasi keuangan.'
  },
  {
    question: 'Apa saja yang dapat dicatat melalui RAJASH?',
    answer:
      'Melalui RAJASH, pemilik usaha dapat mencatat transaksi pemasukan penjualan air minum isi ulang (tunai maupun kredit), mencatat pengeluaran operasional (BBM Becak, Servis Kendaraan, Penggantian Oli, Perbaikan Ban, Pembelian Pasokan Air, dan Lainnya), serta memperbarui pembayaran piutang pelanggan.'
  },
  {
    question: 'Apakah RAJASH dapat mencatat transaksi kredit?',
    answer:
      'Ya. Saat mencatat pemasukan, pemilik dapat memilih jenis pembayaran Kredit. Transaksi kredit otomatis diberi status Belum Lunas dan masuk ke daftar piutang pelanggan tanpa langsung dihitung sebagai kas masuk sebelum dilunasi.'
  },
  {
    question: 'Bagaimana cara memantau piutang pelanggan?',
    answer:
      'Pemilik dapat membuka halaman Piutang atau melihat ringkasan pada Dashboard. Sistem menampilkan nama pelanggan, tanggal transaksi, nominal tagihan, sisa piutang, status Lunas/Belum Lunas, serta pengingat piutang di dalam aplikasi.'
  },
  {
    question: 'Apakah RAJASH menyediakan rekapitulasi keuangan?',
    answer:
      'Ya. Halaman Rekapitulasi menyediakan ringkasan keuangan berdasarkan periode harian dan bulanan yang mencakup total pemasukan kas, total pengeluaran per kategori, daftar piutang, serta perhitungan keuntungan bersih.'
  },
  {
    question: 'Apakah RAJASH dapat digunakan melalui perangkat mobile?',
    answer:
      'Ya. Seluruh halaman RAJASH dirancang dengan tata letak responsif sehingga dapat digunakan dengan nyaman melalui desktop, laptop, tablet, maupun smartphone.'
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [selectedCapabilityFilter, setSelectedCapabilityFilter] = useState('all');

  const visibleCapabilities =
    selectedCapabilityFilter === 'all'
      ? CAPABILITY_CARDS
      : CAPABILITY_CARDS.filter((c) => c.id === selectedCapabilityFilter);

  return (
    <div style={{ backgroundColor: 'var(--wl-true-white)', minHeight: '100dvh' }}>
      {/* NAVBAR (.navbar_component) */}
      <LandingNavbar />

      <main id="main-content">
        {/* ====================================================================
            SECTION 1: HERO SECTION (Exact Workleap Officevibe 2-Column Blueprint)
            ==================================================================== */}
        <section id="beranda" className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2 is-hero">
                {/* Left Column: Eyebrow + H1 with Martina Italic Serif + Lead + CTA + Marquee */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.5rem' }}>
                  <div className="wl-eyebrow">
                    Sistem Pengelolaan Keuangan &amp; Piutang UMKM
                  </div>

                  <h1 className="wl-heading-h1">
                    Kelola keuangan usaha dengan lebih mudah,{' '}
                    <span className="wl-serif-italic">kini terpusat di RAJASH</span>
                  </h1>

                  <div style={{ maxWidth: '36rem' }}>
                    <p className="wl-body-lead mb-0">
                      Catat pemasukan, pantau pengeluaran, kelola piutang pelanggan, dan lihat
                      laporan keuangan usaha dalam satu tempat.
                    </p>
                  </div>

                  <div className="wl-button-group mt-1">
                    <Link
                      to={isAuthenticated ? '/dashboard' : '/login'}
                      className="wl-button"
                    >
                      Masuk ke Dashboard
                    </Link>
                    <a href="#fitur" className="wl-button is-secondary">
                      Pelajari Fitur
                    </a>
                  </div>

                  {/* Workleap Hero Bottom Masked Marquee Strip (.logos_slider-wrapper) */}
                  <div className="mt-3 pt-2 w-100">
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--wl-grey-60)',
                        marginBottom: '0.65rem',
                        letterSpacing: '0.02em'
                      }}
                    >
                      3 Nilai Utama: Pencatatan lebih terstruktur · Pemantauan piutang lebih mudah · Rekap keuangan lebih praktis
                    </div>
                    <div className="wl-marquee-mask" aria-label="Fitur utama sistem RAJASH">
                      <div className="wl-marquee-track">
                        {[...HERO_MARQUEE_ITEMS, ...HERO_MARQUEE_ITEMS].map((item, idx) => (
                          <span key={`${item}-${idx}`} className="wl-marquee-item">
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--wl-brand-100)',
                                display: 'inline-block'
                              }}
                            />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Layered UI Signal & Dashboard Composition (Mirroring Team-health.avif) */}
                <div className="position-relative">
                  <div className="wl-mockup-stage tone-blue">
                    {/* Top Floating Signal Card (Mirrors Workleap's "Team Performance Signal" Card) */}
                    <div
                      className="wl-mockup-window p-3 p-sm-4 mb-3"
                      style={{
                        borderLeft: '4px solid var(--wl-brand-100)'
                      }}
                    >
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="d-inline-flex align-items-center justify-content-center"
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--wl-warning-20)',
                              color: 'var(--wl-warning-120)'
                            }}
                          >
                            <BellRinging size={16} weight="fill" />
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--wl-display-font)',
                              fontWeight: 600,
                              fontSize: '0.88rem',
                              color: 'var(--wl-grey-100)'
                            }}
                          >
                            Sinyal Pemantauan Piutang &amp; Kas
                          </span>
                        </div>
                        <span className="rj-badge rj-badge-info">
                          Ilustrasi Produk · Data Contoh
                        </span>
                      </div>

                      <p
                        className="mb-3"
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--wl-grey-80)',
                          lineHeight: 1.5
                        }}
                      >
                        Terdapat <strong className="text-dark">4 tagihan kredit pelanggan</strong>{' '}
                        berstatus <strong className="text-dark">Belum Lunas</strong> senilai{' '}
                        <strong className="font-tabular text-dark">Rp 505.000</strong>. Sebanyak 2
                        tagihan telah melewati 5 hari sejak tanggal transaksi.
                      </p>

                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2" style={{ borderTop: '1px solid var(--wl-grey-20)' }}>
                        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.76rem' }}>
                          <span className="rj-badge rj-badge-warning">Belum Lunas: Rp 505.000</span>
                          <span className="rj-badge rj-badge-success">Kas Bersih: Rp 1.085.000</span>
                        </div>
                        <Link
                          to={isAuthenticated ? '/piutang' : '/login'}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--wl-brand-100)',
                            textDecoration: 'none'
                          }}
                        >
                          Periksa Piutang &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Main Dashboard Preview Window */}
                    <div className="wl-mockup-window p-3 p-sm-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <div
                            style={{
                              fontSize: '0.74rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              color: 'var(--wl-grey-60)'
                            }}
                          >
                            Ringkasan Keuangan Depot RAJASH
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--wl-display-font)',
                              fontSize: '1.05rem',
                              fontWeight: 600
                            }}
                          >
                            Kondisi Arus Kas &amp; Piutang Bulan Berjalan
                          </div>
                        </div>
                        <span className="rj-badge rj-badge-neutral">November 2026</span>
                      </div>

                      {/* 4 Key Metrics Grid */}
                      <div className="row g-2 mb-3">
                        {[
                          {
                            label: 'Total Pemasukan',
                            val: 'Rp 1.880.000',
                            sub: 'Kas diterima',
                            bg: '#EEF2FF',
                            color: 'var(--wl-brand-100)'
                          },
                          {
                            label: 'Total Pengeluaran',
                            val: 'Rp 795.000',
                            sub: '6 kategori beban',
                            bg: 'var(--wl-soft-20)',
                            color: 'var(--wl-grey-100)'
                          },
                          {
                            label: 'Keuntungan Bersih',
                            val: 'Rp 1.085.000',
                            sub: 'Kas - Pengeluaran',
                            bg: 'var(--wl-success-20)',
                            color: 'var(--wl-success-120)'
                          },
                          {
                            label: 'Total Piutang',
                            val: 'Rp 505.000',
                            sub: '4 belum lunas',
                            bg: 'var(--wl-warning-20)',
                            color: 'var(--wl-warning-120)'
                          }
                        ].map((m) => (
                          <div key={m.label} className="col-6">
                            <div
                              className="p-2 px-3 h-100"
                              style={{
                                backgroundColor: m.bg,
                                borderRadius: '12px',
                                border: '1px solid rgba(23, 20, 23, 0.06)'
                              }}
                            >
                              <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-80)' }}>
                                {m.label}
                              </div>
                              <div
                                className="font-tabular fw-bold mt-1"
                                style={{ fontSize: '0.98rem', color: m.color }}
                              >
                                {m.val}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--wl-grey-60)' }}>
                                {m.sub}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live Transaction Status Rows */}
                      <div className="d-flex flex-column gap-2">
                        <div
                          className="p-2 px-3 d-flex align-items-center justify-content-between"
                          style={{
                            backgroundColor: 'var(--wl-soft-20)',
                            borderRadius: '10px',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div>
                            <span className="fw-semibold">Warkop Kupi Aceh</span>
                            <span style={{ color: 'var(--wl-grey-60)', marginLeft: '6px' }}>
                              · 35 Galon (Kredit)
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="font-tabular fw-bold">Rp 175.000</span>
                            <span className="rj-badge rj-badge-warning">Belum Lunas</span>
                          </div>
                        </div>

                        <div
                          className="p-2 px-3 d-flex align-items-center justify-content-between"
                          style={{
                            backgroundColor: 'var(--wl-soft-20)',
                            borderRadius: '10px',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div>
                            <span className="fw-semibold">Penjualan Depot Harian</span>
                            <span style={{ color: 'var(--wl-grey-60)', marginLeft: '6px' }}>
                              · 48 Galon (Tunai)
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="font-tabular fw-bold">Rp 240.000</span>
                            <span className="rj-badge rj-badge-success">Lunas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 2: HOW IT WORKS (.capability-container.cc-how-it-works)
            ==================================================================== */}
        <section id="cara-kerja" className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-capability-container">
                <div
                  className="d-flex flex-column align-items-center text-center mx-auto"
                  style={{ maxWidth: '46rem', marginBottom: '3rem' }}
                >
                  <div className="wl-eyebrow mb-3">Cara Kerja Sistem</div>
                  <h2 className="wl-heading-h2 mb-3">
                    Catatan terstruktur. Piutang terpantau. Laporan lebih praktis dalam{' '}
                    <span className="wl-serif-italic">3 langkah mudah.</span>
                  </h2>
                  <p className="wl-body-lead mb-0">
                    RAJASH dirancang khusus untuk menggantikan pencatatan buku manual di depot air
                    minum isi ulang; mudah digunakan setiap hari, memisahkan transaksi tunai dan
                    kredit, serta menghitung keuntungan bersih secara otomatis.
                  </p>
                </div>

                {/* 3-Column Illustrated Step Cards (Mirrors Workleap's 3-column How It Works) */}
                <div className="wl-grid-3 text-center">
                  {/* Card 1 */}
                  <div className="d-flex flex-column align-items-center">
                    <div className="wl-how-step-visual">
                      <div className="wl-mockup-window p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--wl-grey-80)' }}>
                            Input Transaksi Baru
                          </span>
                          <span className="rj-badge rj-badge-info">Tahap 1</span>
                        </div>
                        <div
                          className="p-2 mb-2 rounded"
                          style={{ backgroundColor: 'var(--wl-soft-20)', fontSize: '0.75rem' }}
                        >
                          <div className="d-flex justify-content-between">
                            <span>Penjualan 30 Galon</span>
                            <strong className="font-tabular">Rp 150.000</strong>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <span className="rj-badge rj-badge-success w-50 justify-content-center">
                            Tunai · Lunas
                          </span>
                          <span className="rj-badge rj-badge-warning w-50 justify-content-center">
                            Kredit · Piutang
                          </span>
                        </div>
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Pencatatan lebih terstruktur</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Catat pemasukan tunai, penjualan kredit, dan 6 kategori pengeluaran depot.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="wl-how-step-visual"
                      style={{
                        background: 'linear-gradient(155deg, #EDE9FE 0%, #DBF3FF 100%)'
                      }}
                    >
                      <div className="wl-mockup-window p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--wl-grey-80)' }}>
                            Pemantauan Piutang
                          </span>
                          <span className="rj-badge rj-badge-warning">4 Belum Lunas</span>
                        </div>
                        <div
                          className="p-2 mb-2 rounded d-flex justify-content-between align-items-center"
                          style={{ backgroundColor: 'var(--wl-soft-20)', fontSize: '0.75rem' }}
                        >
                          <span>Warkop Kupi Aceh</span>
                          <strong className="font-tabular">Rp 175.000</strong>
                        </div>
                        <div
                          className="p-1 px-2 rounded text-center"
                          style={{
                            backgroundColor: 'var(--wl-brand-100)',
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: 500
                          }}
                        >
                          Pengingat Aplikasi Aktif
                        </div>
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Pemantauan piutang lebih mudah</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Ketahui pelanggan yang masih berutang dan perbarui status saat lunas.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="wl-how-step-visual"
                      style={{
                        background: 'linear-gradient(155deg, #E1F5EB 0%, #DBF3FF 100%)'
                      }}
                    >
                      <div className="wl-mockup-window p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--wl-grey-80)' }}>
                            Rekapitulasi &amp; Laba Bersih
                          </span>
                          <span className="rj-badge rj-badge-success">Otomatis</span>
                        </div>
                        <div
                          className="p-2 mb-2 rounded d-flex justify-content-between"
                          style={{ backgroundColor: 'var(--wl-soft-20)', fontSize: '0.75rem' }}
                        >
                          <span>Keuntungan Bersih</span>
                          <strong
                            className="font-tabular"
                            style={{ color: 'var(--wl-success-120)' }}
                          >
                            Rp 1.085.000
                          </strong>
                        </div>
                        <div className="d-flex gap-1 align-items-end" style={{ height: '24px' }}>
                          {[55, 75, 60, 90, 80, 100].map((h, i) => (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: `${h}%`,
                                backgroundColor:
                                  i % 2 === 0 ? 'var(--wl-brand-100)' : '#93C5FD',
                                borderRadius: '3px 3px 0 0'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Rekap keuangan lebih praktis</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Lihat laporan harian dan bulanan beserta keuntungan bersih tanpa hitung manual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 3: STEP 1 DEEP DIVE (Mirrors Workleap "Get the real information")
            ==================================================================== */}
        <section id="fitur" className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Text Column */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow">Tahap 1 · Catat Transaksi</div>
                  <h2 className="wl-heading-h2">
                    Catat Pemasukan dan Pengeluaran{' '}
                    <span className="wl-serif-italic">Tanpa Ribet</span>
                  </h2>
                  <p className="wl-body-lead mb-0">
                    Pencatatan transaksi harian baik pembayaran tunai maupun kredit, serta
                    pengeluaran operasional usaha dalam satu formulir terstruktur yang mencegah
                    pencatatan terlewat atau ganda.
                  </p>

                  <ul className="wl-checkmarks-list">
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Pencatatan pemasukan penjualan dengan jenis pembayaran{' '}
                        <strong>Tunai (Lunas)</strong> maupun <strong>Kredit (Belum Lunas)</strong>
                      </div>
                    </li>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Enam kategori pengeluaran operasional: <strong>BBM Becak</strong>,{' '}
                        <strong>Servis Kendaraan</strong>, <strong>Penggantian Oli</strong>,{' '}
                        <strong>Perbaikan Ban</strong>, <strong>Pembelian Pasokan Air</strong>, dan{' '}
                        <strong>Lainnya</strong>
                      </div>
                    </li>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Peringatan kemungkinan transaksi duplikat saat rincian dan nominal serupa
                        diinput pada tanggal yang sama
                      </div>
                    </li>
                  </ul>

                  <div className="wl-button-group pt-2">
                    <Link
                      to={isAuthenticated ? '/pemasukan' : '/login'}
                      className="wl-button"
                    >
                      Catat Transaksi
                    </Link>
                    <a href="#modul" className="wl-button is-secondary">
                      Jelajahi Modul
                    </a>
                  </div>
                </div>

                {/* Right UI Mockup Column (Mirrors OV_Step1_EN.avif) */}
                <div className="wl-mockup-stage tone-blue">
                  <div className="wl-mockup-window p-3 p-sm-4">
                    <div className="d-flex align-items-center justify-content-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--wl-grey-20)' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase' }}>
                          Formulir Pencatatan Harian
                        </div>
                        <div style={{ fontFamily: 'var(--wl-display-font)', fontWeight: 600, fontSize: '1rem' }}>
                          Input Transaksi Pemasukan &amp; Pengeluaran
                        </div>
                      </div>
                      <span className="rj-badge rj-badge-info">Ilustrasi UI</span>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-12 col-sm-6">
                        <div className="p-2 px-3 rounded" style={{ backgroundColor: 'var(--wl-soft-20)', border: '1px solid var(--wl-grey-20)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--wl-grey-60)' }}>Keterangan / Pelanggan</div>
                          <div className="fw-semibold" style={{ fontSize: '0.84rem' }}>
                            Pesanan 35 Galon - Warkop Kupi Aceh
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="p-2 px-3 rounded" style={{ backgroundColor: 'var(--wl-soft-20)', border: '1px solid var(--wl-grey-20)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--wl-grey-60)' }}>Nominal</div>
                          <div className="font-tabular fw-bold" style={{ fontSize: '0.84rem' }}>
                            Rp 175.000
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="p-2 px-3 rounded" style={{ backgroundColor: 'var(--wl-warning-20)', border: '1px solid var(--wl-warning-60)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--wl-warning-120)' }}>Pembayaran</div>
                          <div className="fw-bold" style={{ fontSize: '0.84rem', color: 'var(--wl-warning-120)' }}>
                            Kredit
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Pills */}
                    <div className="mb-3">
                      <div style={{ fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--wl-grey-80)' }}>
                        Kategori Pengeluaran Operasional Depot:
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {[
                          'BBM Becak',
                          'Servis Kendaraan',
                          'Penggantian Oli',
                          'Perbaikan Ban',
                          'Pembelian Pasokan Air',
                          'Lainnya'
                        ].map((cat, idx) => (
                          <span
                            key={cat}
                            style={{
                              padding: '0.28rem 0.7rem',
                              borderRadius: '100px',
                              fontSize: '0.72rem',
                              fontWeight: 500,
                              backgroundColor: idx === 0 || idx === 4 ? 'var(--wl-brand-100)' : 'var(--wl-soft-20)',
                              color: idx === 0 || idx === 4 ? '#FFFFFF' : 'var(--wl-grey-80)',
                              border: '1px solid var(--wl-grey-20)'
                            }}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Duplicate Warning Callout */}
                    <div
                      className="p-3 rounded-3 d-flex align-items-start gap-2"
                      style={{
                        backgroundColor: 'var(--wl-warning-20)',
                        border: '1px solid var(--wl-warning-60)',
                        fontSize: '0.78rem',
                        color: 'var(--wl-warning-120)'
                      }}
                    >
                      <Warning size={18} weight="fill" className="flex-shrink-0 mt-1" />
                      <div>
                        <strong>Peringatan Kemungkinan Transaksi Duplikat:</strong> Ditemukan catatan
                        serupa pada tanggal yang sama. Periksa kembali sebelum menyimpan agar tidak
                        tercatat dua kali.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 4: STEP 2 DEEP DIVE (Mirrors Workleap "Get a clear picture" - Reversed)
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left UI Mockup Column (Mirrors OV_Step2_EN.avif Report & Trend Card) */}
                <div className="wl-mockup-stage tone-lilac order-2 order-lg-1">
                  <div className="wl-mockup-window p-3 p-sm-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase' }}>
                          Ringkasan &amp; Grafik Keuangan
                        </div>
                        <div style={{ fontFamily: 'var(--wl-display-font)', fontWeight: 600, fontSize: '1rem' }}>
                          Laporan Keuntungan Bersih &amp; Arus Kas
                        </div>
                      </div>
                      <span className="rj-badge rj-badge-success">Kas Positif</span>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-12 col-sm-5">
                        <div
                          className="p-3 h-100 d-flex flex-column justify-content-between"
                          style={{
                            backgroundColor: 'var(--wl-brand-100)',
                            color: '#FFFFFF',
                            borderRadius: '14px'
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>
                            Keuntungan Bersih Kas
                          </div>
                          <div className="font-tabular my-1" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                            Rp 1.085.000
                          </div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>
                            Kas Diterima - Pengeluaran
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-sm-7">
                        <div
                          className="p-3 h-100"
                          style={{
                            backgroundColor: 'var(--wl-soft-20)',
                            border: '1px solid var(--wl-grey-20)',
                            borderRadius: '14px'
                          }}
                        >
                          <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.75rem' }}>
                            <span style={{ color: 'var(--wl-grey-80)' }}>Pemasukan Kas Tunai:</span>
                            <strong className="font-tabular">Rp 1.560.000</strong>
                          </div>
                          <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.75rem' }}>
                            <span style={{ color: 'var(--wl-grey-80)' }}>Pelunasan Piutang Masuk:</span>
                            <strong className="font-tabular">Rp 320.000</strong>
                          </div>
                          <div className="d-flex justify-content-between pt-2 border-top" style={{ fontSize: '0.75rem' }}>
                            <span style={{ color: 'var(--wl-grey-80)' }}>Total Pengeluaran Depot:</span>
                            <strong className="font-tabular" style={{ color: 'var(--wl-danger-120)' }}>
                              - Rp 795.000
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Trend Chart */}
                    <div
                      className="p-3"
                      style={{
                        backgroundColor: 'var(--wl-true-white)',
                        border: '1px solid var(--wl-grey-20)',
                        borderRadius: '14px'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.74rem' }}>
                        <span className="fw-semibold">Tren Pemasukan Kas vs Pengeluaran (7 Hari)</span>
                        <span style={{ color: 'var(--wl-brand-100)', fontWeight: 600 }}>Rekap Harian &amp; Bulanan</span>
                      </div>
                      <div className="d-flex align-items-end justify-content-between gap-2 pt-2" style={{ height: '90px' }}>
                        {[
                          { label: '04 Nov', inH: '65%', outH: '30%' },
                          { label: '05 Nov', inH: '80%', outH: '25%' },
                          { label: '06 Nov', inH: '58%', outH: '50%' },
                          { label: '07 Nov', inH: '88%', outH: '28%' },
                          { label: '08 Nov', inH: '74%', outH: '34%' },
                          { label: '09 Nov', inH: '92%', outH: '38%' },
                          { label: '10 Nov', inH: '85%', outH: '22%' }
                        ].map((d) => (
                          <div key={d.label} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                            <div className="d-flex align-items-end gap-1 w-100 justify-content-center h-100">
                              <div style={{ width: '9px', height: d.inH, backgroundColor: 'var(--wl-brand-100)', borderRadius: '3px 3px 0 0' }} />
                              <div style={{ width: '9px', height: d.outH, backgroundColor: '#CBD5E1', borderRadius: '3px 3px 0 0' }} />
                            </div>
                            <span style={{ fontSize: '0.62rem', color: 'var(--wl-grey-60)', marginTop: '4px' }}>{d.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Text Column */}
                <div className="d-flex flex-column align-items-start order-1 order-lg-2" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow">Tahap 2 · Pantau Keuangan</div>
                  <h2 className="wl-heading-h2">
                    Lihat Kondisi Keuangan Usaha{' '}
                    <span className="wl-serif-italic">Secara Jelas</span>
                  </h2>
                  <p className="wl-body-lead mb-0">
                    Ringkasan pemasukan, pengeluaran, keuntungan bersih, dan grafik keuangan dalam
                    satu tampilan. Tidak perlu lagi menghitung buku besar secara manual untuk
                    mengetahui laba bersih depot.
                  </p>

                  <ul className="wl-checkmarks-list">
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Rekapitulasi keuangan harian dan bulanan yang memisahkan kas tunai diterima
                        dan piutang pelanggan
                      </div>
                    </li>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Perhitungan keuntungan bersih otomatis berdasarkan aturan pencatatan yang
                        disepakati
                      </div>
                    </li>
                  </ul>

                  <div className="pt-2">
                    <Link
                      to={isAuthenticated ? '/rekapitulasi' : '/login'}
                      className="wl-button"
                    >
                      Lihat Laporan Rekapitulasi
                    </Link>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 5: STEP 3 DEEP DIVE (Mirrors Workleap "Act with an AI coach")
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Text Column */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow">Tahap 3 · Kelola Piutang</div>
                  <h2 className="wl-heading-h2">
                    Pantau Pelanggan yang Masih{' '}
                    <span className="wl-serif-italic">Memiliki Utang</span>
                  </h2>
                  <p className="wl-body-lead mb-0">
                    Daftar piutang pelanggan, status pembayaran lunas dan belum lunas, serta
                    pengingat piutang di dalam aplikasi memudahkan pemilik menindaklanjuti tagihan
                    kredit tepat waktu.
                  </p>

                  <ul className="wl-checkmarks-list">
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Daftar piutang terpusat berisi nama pelanggan, tanggal transaksi, nominal
                        piutang, dan status pembayaran
                      </div>
                    </li>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Pengingat piutang di dalam aplikasi dan kemudahan mengubah status pembayaran
                        dari <strong>Belum Lunas</strong> menjadi <strong>Lunas</strong>
                      </div>
                    </li>
                  </ul>

                  <div className="pt-2">
                    <Link
                      to={isAuthenticated ? '/piutang' : '/login'}
                      className="wl-button"
                    >
                      Kelola Piutang Pelanggan
                    </Link>
                  </div>
                </div>

                {/* Right UI Mockup Column (Mirrors OV_Step3_EN.avif) */}
                <div className="wl-mockup-stage tone-sand">
                  <div className="wl-mockup-window p-3 p-sm-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span style={{ fontFamily: 'var(--wl-display-font)', fontWeight: 600, fontSize: '0.95rem' }}>
                        Manajemen Piutang &amp; Pengingat Aplikasi
                      </span>
                      <span className="rj-badge rj-badge-warning">4 Tagihan Aktif</span>
                    </div>

                    <div className="d-flex flex-column gap-2 mb-3">
                      {[
                        {
                          name: 'Warkop Kupi Aceh (Ulee Kareng)',
                          meta: '05 Nov 2026 · Tertunggak 5 hari',
                          amount: 'Rp 175.000',
                          status: 'Belum Lunas',
                          paid: false
                        },
                        {
                          name: 'Kantin Kampus Darussalam',
                          meta: '03 Nov 2026 · Sisa cicilan',
                          amount: 'Rp 90.000',
                          status: 'Belum Lunas',
                          paid: false
                        },
                        {
                          name: 'Warung Mie Aceh Seulawah',
                          meta: '07 Nov 2026 · Dilunasi 09 Nov',
                          amount: 'Rp 100.000',
                          status: 'Lunas',
                          paid: true
                        }
                      ].map((r) => (
                        <div
                          key={r.name}
                          className="p-3 rounded-3 d-flex align-items-center justify-content-between gap-2"
                          style={{
                            backgroundColor: 'var(--wl-soft-20)',
                            border: '1px solid var(--wl-grey-20)'
                          }}
                        >
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '0.84rem' }}>{r.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)' }}>{r.meta}</div>
                          </div>
                          <div className="text-end">
                            <div className="font-tabular fw-bold" style={{ fontSize: '0.86rem' }}>{r.amount}</div>
                            <span className={`rj-badge ${r.paid ? 'rj-badge-success' : 'rj-badge-warning'}`}>
                              {r.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className="p-3 rounded-3 d-flex align-items-center justify-content-between gap-2"
                      style={{
                        backgroundColor: '#EEF2FF',
                        border: '1px solid var(--wl-blue-05)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <span style={{ color: 'var(--wl-brand-deep)' }}>
                        <strong>Tindakan Cepat:</strong> Tandai pembayaran lunas saat pelanggan membayar tagihan.
                      </span>
                      <span className="rj-badge rj-badge-info">Update Status</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 6: BENEFIT SECTION (Mirrors Workleap "Easy engagement win: Make your people feel seen")
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Visual Composition (Mirrors Hero_Good-vibes.avif) */}
                <div className="wl-mockup-stage tone-mint order-2 order-lg-1">
                  <div className="d-flex flex-column gap-3">
                    {[
                      {
                        num: '01',
                        title: 'Mengurangi risiko pencatatan terlewat atau ganda',
                        desc: 'Transaksi tersimpan rapi berdasarkan tanggal dan memiliki deteksi kemiripan transaksi.'
                      },
                      {
                        num: '02',
                        title: 'Mempermudah perhitungan keuntungan bersih',
                        desc: 'Keuntungan bersih dihitung otomatis dari kas masuk aktual dikurangi total pengeluaran.'
                      },
                      {
                        num: '03',
                        title: 'Membantu memantau transaksi kredit pelanggan',
                        desc: 'Tagihan kredit tercatat terpisah sebagai piutang sampai pelanggan melunasinya.'
                      },
                      {
                        num: '04',
                        title: 'Mempercepat pembuatan rekap harian dan bulanan',
                        desc: 'Laporan siap dilihat, dicetak, atau diekspor kapan saja tanpa rekap manual.'
                      }
                    ].map((b) => (
                      <div key={b.num} className="wl-mockup-window p-3 d-flex align-items-start gap-3">
                        <span
                          className="font-tabular fw-bold d-inline-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--wl-brand-100)',
                            color: '#FFFFFF',
                            fontSize: '0.82rem'
                          }}
                        >
                          {b.num}
                        </span>
                        <div>
                          <div style={{ fontFamily: 'var(--wl-display-font)', fontWeight: 600, fontSize: '0.92rem' }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--wl-grey-80)', marginTop: '2px' }}>
                            {b.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Editorial Copy */}
                <div className="d-flex flex-column align-items-start order-1 order-lg-2" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow">Manfaat Utama Sistem</div>
                  <h2 className="wl-heading-h2">
                    Semua Catatan Keuangan dalam{' '}
                    <span className="wl-serif-italic">Satu Tempat</span>
                  </h2>
                  <p className="wl-body-lead mb-0">
                    Menjaga ketertiban pencatatan setiap hari adalah kunci untuk mengetahui kondisi
                    kesehatan usaha depot air minum isi ulang secara akurat. Dengan menyatukan
                    catatan pemasukan, pengeluaran, dan piutang, pemilik usaha memiliki kendali
                    penuh atas arus kas harian.
                  </p>
                  <p className="wl-body-lead mb-0">
                    Jadi catat setiap penjualan tunai. Pantau setiap pesanan kredit pelanggan.
                    Periksa rekapitulasi harian dan bulanan dengan tenang.
                  </p>
                  <div className="pt-2">
                    <Link
                      to={isAuthenticated ? '/dashboard' : '/login'}
                      className="wl-button is-secondary"
                    >
                      Buka Sistem RAJASH
                    </Link>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 7: ORBIT ECOSYSTEM ON SOFT-LIGHT BG (Mirrors Workleap Section 7)
            ==================================================================== */}
        <section className="wl-section bg-soft-light">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xhuge" />

              <div className="wl-grid-2">
                {/* Left Column: Concentric Orbit Circle Graphic (.u-logo-rotation-container) */}
                <div>
                  <div className="wl-orbit-stage" aria-label="Diagram kategori pencatatan RAJASH">
                    <div className="wl-orbit-ring ring-outer" />
                    <div className="wl-orbit-ring ring-inner" />

                    <div className="wl-orbit-center">
                      <Drop size={28} weight="fill" />
                      <span
                        style={{
                          fontFamily: 'var(--wl-display-font)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          letterSpacing: '-0.02em',
                          marginTop: '2px'
                        }}
                      >
                        RAJASH
                      </span>
                    </div>

                    {ORBIT_NODES.map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.label}
                          className="wl-orbit-node"
                          style={{
                            top: node.top,
                            left: node.left,
                            transform: node.transform
                          }}
                        >
                          <Icon size={20} weight="duotone" style={{ color: 'var(--wl-brand-100)' }} />
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 600,
                              color: 'var(--wl-grey-100)',
                              lineHeight: 1.15,
                              marginTop: '4px'
                            }}
                          >
                            {node.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Eyebrow + H2 + Copy + Button */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow">Struktur Kategori Operasional</div>
                  <h2 className="wl-heading-h2">
                    Selaras dengan aktivitas harian{' '}
                    <span className="wl-serif-italic">depot air minum</span>
                  </h2>
                  <p className="wl-body-lead mb-0">
                    RAJASH tidak menggunakan akun akuntansi yang rumit. Seluruh kategori pemasukan
                    dan pengeluaran dirancang sesuai kegiatan operasional nyata usaha depot air
                    minum isi ulang, mulai dari pembelian pasokan air hingga perawatan becak
                    pengantaran.
                  </p>
                  <div className="pt-2">
                    <Link
                      to={isAuthenticated ? '/pengeluaran' : '/login'}
                      className="wl-button is-secondary"
                    >
                      Lihat Kategori Pengeluaran
                    </Link>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xhuge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 8: CREDIBILITY / OPERATIONAL CONTEXT (Mirrors Workleap Section 8 .trust-carousel)
            ==================================================================== */}
        <section id="tentang-sistem" className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div style={{ maxWidth: '54rem', marginBottom: '3.5rem' }}>
                <div className="wl-eyebrow mb-3">Konteks Operasional Usaha</div>
                <h2 className="wl-heading-h1">
                  Dirancang untuk Membantu Pengelolaan Keuangan{' '}
                  <span className="wl-highlight">RAJASH</span>.
                </h2>
              </div>

              {/* 3-Column Vertical-Border Grid (Mirrors Workleap's .trust-carousel) */}
              <div className="wl-grid-3">
                <div className="wl-trust-card">
                  <div>
                    <div className="wl-eyebrow mb-3" style={{ color: 'var(--wl-brand-100)' }}>
                      Latar Belakang Usaha
                    </div>
                    <div className="wl-trust-quote-mark" aria-hidden="true">01</div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--wl-grey-100)', lineHeight: 1.6 }}>
                      RAJASH merupakan usaha depot air minum isi ulang yang beroperasi sejak tahun
                      2016 di Ulee Kareng, Banda Aceh dan melayani pembelian tunai maupun kredit.
                    </p>
                  </div>
                  <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--wl-grey-20)' }}>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>
                      Depot Air Minum Isi Ulang RAJASH
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--wl-grey-60)' }}>
                      Ulee Kareng, Banda Aceh (Sejak 2016)
                    </div>
                  </div>
                </div>

                <div className="wl-trust-card">
                  <div>
                    <div className="wl-eyebrow mb-3" style={{ color: 'var(--wl-brand-100)' }}>
                      Solusi Atas Buku Manual
                    </div>
                    <div className="wl-trust-quote-mark" aria-hidden="true">02</div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--wl-grey-100)', lineHeight: 1.6 }}>
                      Menggantikan pencatatan buku manual yang berisiko terlewat atau tercatat dua
                      kali, sehingga informasi pemasukan, pengeluaran, dan piutang tersusun secara
                      terpusat.
                    </p>
                  </div>
                  <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--wl-grey-20)' }}>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>
                      Pencatatan Keuangan Terpusat
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--wl-grey-60)' }}>
                      Pemasukan, Pengeluaran, Piutang &amp; Rekapitulasi
                    </div>
                  </div>
                </div>

                <div className="wl-trust-card">
                  <div>
                    <div className="wl-eyebrow mb-3" style={{ color: 'var(--wl-brand-100)' }}>
                      Pengguna Utama Sistem
                    </div>
                    <div className="wl-trust-quote-mark" aria-hidden="true">03</div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--wl-grey-100)', lineHeight: 1.6 }}>
                      Difokuskan untuk membantu pemilik usaha memantau pelanggan yang masih memiliki
                      utang serta menghitung keuntungan bersih harian dan bulanan secara praktis.
                    </p>
                  </div>
                  <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--wl-grey-20)' }}>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>
                      Dedy Darmansyah
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--wl-grey-60)' }}>
                      Pemilik Usaha (Owner) RAJASH
                    </div>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 9: PRODUCT SHOWCASE / CAPABILITIES CARDS (Mirrors Workleap Section 9)
            ==================================================================== */}
        <section id="modul" className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="d-flex flex-column align-items-center text-center mb-4">
                <div className="wl-eyebrow mb-2">Pratinjau Modul &amp; Kapabilitas</div>
                <h2 className="wl-heading-h2 mb-3">
                  Ubah pembukuan harian menjadi{' '}
                  <span className="wl-serif-italic">lebih terarah</span>
                </h2>

                {/* Interactive Filter Pills */}
                <div
                  className="d-flex flex-wrap justify-content-center gap-2 mt-2"
                  role="tablist"
                  aria-label="Filter modul sistem RAJASH"
                >
                  {[
                    { id: 'all', label: 'Semua Modul' },
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'pemasukan', label: 'Pemasukan' },
                    { id: 'pengeluaran', label: 'Pengeluaran' },
                    { id: 'piutang', label: 'Piutang' },
                    { id: 'rekapitulasi', label: 'Rekapitulasi' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selectedCapabilityFilter === tab.id}
                      onClick={() => setSelectedCapabilityFilter(tab.id)}
                      className={
                        selectedCapabilityFilter === tab.id
                          ? 'wl-button is-small'
                          : 'wl-button is-secondary is-small'
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workleap .capabilities-card.cc-hoverable Grid */}
              <div className="wl-grid-3 mt-4">
                {visibleCapabilities.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={card.id}
                      to={isAuthenticated ? '/dashboard' : '/login'}
                      className="wl-capabilities-card"
                    >
                      <div className="wl-capabilities-card-visual">
                        <div
                          className="p-3"
                          style={{
                            backgroundColor: 'var(--wl-true-white)',
                            border: '1px solid var(--wl-grey-20)',
                            borderRadius: '16px'
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: 'var(--wl-grey-60)',
                                textTransform: 'uppercase'
                              }}
                            >
                              Ilustrasi Modul
                            </span>
                            <span className="rj-badge rj-badge-info">{card.badge}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--wl-grey-80)' }}>
                            {card.metricLabel}
                          </div>
                          <div
                            className="font-tabular fw-bold my-1"
                            style={{ fontSize: '1.1rem', color: 'var(--wl-grey-100)' }}
                          >
                            {card.metricValue}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)' }}>
                            {card.subText}
                          </div>
                        </div>
                      </div>

                      <div className="wl-capabilities-card-content">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(37, 69, 255, 0.1)',
                                color: 'var(--wl-brand-100)'
                              }}
                            >
                              <Icon size={18} weight="bold" />
                            </span>
                            <h5 className="wl-heading-h5">{card.title}</h5>
                          </div>
                          <ArrowUpRight size={18} weight="bold" />
                        </div>

                        <div style={{ fontSize: '0.9rem', color: 'var(--wl-grey-80)', lineHeight: 1.5 }}>
                          {card.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 10: CLOSING CTA CARD (Mirrors Workleap Section 10 .lp-cta-section & .cta_card)
            ==================================================================== */}
        <section className="wl-section" style={{ paddingBottom: '3.75rem' }}>
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-cta-card">
                <div style={{ maxWidth: '54rem' }}>
                  <h2 className="wl-heading-h0" style={{ color: '#FFFFFF' }}>
                    Mulai Kelola Keuangan Usaha{' '}
                    <span className="wl-highlight-inverted">dengan Lebih Teratur</span>.
                  </h2>
                </div>

                <div className="wl-button-group justify-content-center">
                  <Link
                    to={isAuthenticated ? '/dashboard' : '/login'}
                    className="wl-button is-alternate"
                  >
                    Masuk ke RAJASH
                  </Link>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 11: TWO-COLUMN FAQ SECTION ON #F9F8F6 (Mirrors Workleap Section 11)
            ==================================================================== */}
        <section id="faq" className="wl-section wl-faq-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2 is-faq">
                {/* Left Column: Eyebrow + H3 with Large Martina Italic Serif Lead Word */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1rem' }}>
                  <div className="wl-eyebrow">Pertanyaan Umum (FAQ)</div>
                  <h3 className="wl-heading-h3">
                    <span
                      className="wl-serif-italic"
                      style={{ fontSize: '1.32em', display: 'block', marginBottom: '0.1em' }}
                    >
                      Semua
                    </span>{' '}
                    yang perlu Anda ketahui tentang sistem pengelolaan keuangan RAJASH
                  </h3>
                </div>

                {/* Right Column: Minimalist Horizontal Divider Accordion */}
                <div>
                  <Accordion items={FAQ_ITEMS} defaultOpenIndex={0} />
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER (.footer_main in #0C1754 Boardroom Navy) */}
      <LandingFooter />
    </div>
  );
}
