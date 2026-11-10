import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ArrowRight,
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
  ShieldCheck,
  Sparkle,
  Trophy,
  Target
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

const HERO_SIGNALS = [
  {
    id: 'piutang',
    tabLabel: 'Sinyal Piutang',
    dotX: 194,
    dotY: 30,
    topPill: {
      icon: Trophy,
      label: 'Piutang Pelanggan',
      badge: '↓ 4 Tagihan',
      badgeTone: 'peach'
    },
    title: 'Sinyal Keuangan & Piutang',
    copy: 'Terdapat 4 tagihan kredit pelanggan yang belum lunas, memengaruhi arus kas bersih depot minggu ini.',
    ctaLabel: 'Periksa piutang',
    ctaLink: '/piutang',
    bottomRightPill: {
      label: 'Tagihan kredit berjalan',
      badge: 'Rp 505.000',
      badgeTone: 'peach'
    },
    bottomLeftPill: {
      prefix: '2 tagihan > 5 hari ',
      boldText: 'perlu ditindaklanjuti.',
      badge: 'Belum Lunas',
      badgeTone: 'peach'
    }
  },
  {
    id: 'kas',
    tabLabel: 'Sinyal Kas Bersih',
    dotX: 274,
    dotY: 50,
    topPill: {
      icon: Wallet,
      label: 'Keuntungan Bersih',
      badge: '↑ Rp 1,08 Jt',
      badgeTone: 'mint'
    },
    title: 'Sinyal Arus Kas Bersih',
    copy: 'Pemasukan kas tunai dan pelunasan piutang minggu ini menjaga saldo keuntungan bersih depot tetap positif.',
    ctaLabel: 'Lihat rekapitulasi',
    ctaLink: '/rekapitulasi',
    bottomRightPill: {
      label: 'Pemasukan kas diterima',
      badge: 'Rp 1.880.000',
      badgeTone: 'mint'
    },
    bottomLeftPill: {
      prefix: 'Keuntungan bersih depot ',
      boldText: 'terhitung otomatis.',
      badge: 'Kas Positif',
      badgeTone: 'mint'
    }
  },
  {
    id: 'pengeluaran',
    tabLabel: 'Sinyal Beban Depot',
    dotX: 118,
    dotY: 44,
    topPill: {
      icon: GasPump,
      label: 'Beban Operasional',
      badge: '6 Kategori',
      badgeTone: 'blue'
    },
    title: 'Sinyal Pengeluaran & Duplikasi',
    copy: 'Pengeluaran pembelian pasokan air dan BBM becak tercatat rapi dengan pemeriksaan transaksi ganda otomatis.',
    ctaLabel: 'Catat pengeluaran',
    ctaLink: '/pengeluaran',
    bottomRightPill: {
      label: 'Total pengeluaran berjalan',
      badge: 'Rp 795.000',
      badgeTone: 'blue'
    },
    bottomLeftPill: {
      prefix: 'Pemeriksaan duplikasi ',
      boldText: 'aktif melindungi buku.',
      badge: 'Terlindungi',
      badgeTone: 'blue'
    }
  }
];

const EXPENSE_CATEGORIES_PREVIEW = [
  { name: 'BBM Becak', sample: 'Pengisian BBM Becak Pengantaran', nominal: 'Rp 45.000' },
  { name: 'Servis Kendaraan', sample: 'Servis Rutin Mesin Becak Depot', nominal: 'Rp 120.000' },
  { name: 'Penggantian Oli', sample: 'Ganti Oli Mesin Becak Operasional', nominal: 'Rp 65.000' },
  { name: 'Perbaikan Ban', sample: 'Tambal & Ganti Ban Dalam Becak', nominal: 'Rp 50.000' },
  { name: 'Pembelian Pasokan Air', sample: 'Pasokan Air Baku Tangki 8.000L', nominal: 'Rp 450.000' },
  { name: 'Lainnya', sample: 'Pembelian Tutup & Tisu Galon', nominal: 'Rp 65.000' }
];

const DAILY_TREND_DATA = [
  { label: '04 Nov', inVal: 'Rp 240.000', outVal: 'Rp 95.000', netVal: 'Rp 145.000', inH: '65%', outH: '30%' },
  { label: '05 Nov', inVal: 'Rp 295.000', outVal: 'Rp 80.000', netVal: 'Rp 215.000', inH: '80%', outH: '25%' },
  { label: '06 Nov', inVal: 'Rp 210.000', outVal: 'Rp 165.000', netVal: 'Rp 45.000', inH: '58%', outH: '50%' },
  { label: '07 Nov', inVal: 'Rp 325.000', outVal: 'Rp 90.000', netVal: 'Rp 235.000', inH: '88%', outH: '28%' },
  { label: '08 Nov', inVal: 'Rp 265.000', outVal: 'Rp 110.000', netVal: 'Rp 155.000', inH: '74%', outH: '34%' },
  { label: '09 Nov', inVal: 'Rp 340.000', outVal: 'Rp 145.000', netVal: 'Rp 195.000', inH: '92%', outH: '38%' },
  { label: '10 Nov', inVal: 'Rp 205.000', outVal: 'Rp 110.000', netVal: 'Rp 95.000', inH: '85%', outH: '22%' }
];

const INITIAL_DEMO_RECEIVABLES = [
  {
    id: 'r1',
    name: 'Warkop Kupi Aceh (Ulee Kareng)',
    meta: '05 Nov 2026 · 35 Galon (Kredit)',
    amountNum: 175000,
    amount: 'Rp 175.000',
    paid: false
  },
  {
    id: 'r2',
    name: 'Kantin Kampus Darussalam',
    meta: '06 Nov 2026 · 18 Galon (Kredit)',
    amountNum: 90000,
    amount: 'Rp 90.000',
    paid: false
  },
  {
    id: 'r3',
    name: 'Warung Mie Aceh Seulawah',
    meta: '08 Nov 2026 · 20 Galon (Kredit)',
    amountNum: 100000,
    amount: 'Rp 100.000',
    paid: true
  }
];

const ORBIT_NODES = [
  {
    label: 'BBM Becak',
    desc: 'Pencatatan biaya bahan bakar becak pengantaran galon harian.',
    icon: GasPump,
    top: '4%',
    left: '50%',
    transform: 'translate(-50%, 0)'
  },
  {
    label: 'Pasokan Air',
    desc: 'Pembelian pasokan air baku tangki untuk kebutuhan isi ulang depot.',
    icon: Drop,
    top: '18%',
    left: '84%',
    transform: 'translate(-50%, -50%)'
  },
  {
    label: 'Servis Becak',
    desc: 'Biaya perawatan rutin mesin kendaraan operasional pengantaran.',
    icon: Wrench,
    top: '50%',
    left: '96%',
    transform: 'translate(-100%, -50%)'
  },
  {
    label: 'Ganti Oli',
    desc: 'Penggantian oli berkala agar armada becak tetap prima.',
    icon: Truck,
    top: '82%',
    left: '84%',
    transform: 'translate(-50%, -50%)'
  },
  {
    label: 'Perbaikan Ban',
    desc: 'Pengeluaran tambal atau ganti ban kendaraan pengantaran.',
    icon: ShieldCheck,
    top: '96%',
    left: '50%',
    transform: 'translate(-50%, -100%)'
  },
  {
    label: 'Biaya Lainnya',
    desc: 'Kebutuhan pendukung depot seperti tutup galon, tisu, dan listrik.',
    icon: Receipt,
    top: '82%',
    left: '16%',
    transform: 'translate(-50%, -50%)'
  },
  {
    label: 'Kas Tunai',
    desc: 'Pemasukan penjualan galon tunai yang langsung berstatus Lunas.',
    icon: Wallet,
    top: '50%',
    left: '4%',
    transform: 'translate(0, -50%)'
  },
  {
    label: 'Piutang Kredit',
    desc: 'Penjualan galon kredit pelanggan yang dipantau hingga Lunas.',
    icon: Notebook,
    top: '18%',
    left: '16%',
    transform: 'translate(-50%, -50%)'
  }
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
  const [activeSignalIdx, setActiveSignalIdx] = useState(0);
  const [step1PaymentType, setStep1PaymentType] = useState('Kredit');
  const [selectedExpenseCatIdx, setSelectedExpenseCatIdx] = useState(4);
  const [activeTrendDayIdx, setActiveTrendDayIdx] = useState(5);
  const [demoReceivables, setDemoReceivables] = useState(INITIAL_DEMO_RECEIVABLES);
  const [activeOrbitIdx, setActiveOrbitIdx] = useState(0);
  const [selectedCapabilityFilter, setSelectedCapabilityFilter] = useState('all');

  const activeSignal = HERO_SIGNALS[activeSignalIdx];
  const TopPillIcon = activeSignal.topPill.icon;
  const activeExpenseCat = EXPENSE_CATEGORIES_PREVIEW[selectedExpenseCatIdx];
  const activeTrendDay = DAILY_TREND_DATA[activeTrendDayIdx];
  const activeOrbitNode = ORBIT_NODES[activeOrbitIdx];

  const unpaidReceivablesCount = demoReceivables.filter((r) => !r.paid).length;
  const unpaidReceivablesTotal = demoReceivables
    .filter((r) => !r.paid)
    .reduce((acc, item) => acc + item.amountNum, 0);

  const toggleDemoReceivable = (id) => {
    setDemoReceivables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, paid: !item.paid } : item))
    );
  };

  const visibleCapabilities =
    selectedCapabilityFilter === 'all'
      ? CAPABILITY_CARDS
      : CAPABILITY_CARDS.filter((c) => c.id === selectedCapabilityFilter);

  const getBadgeClass = (tone) => {
    if (tone === 'mint') return 'wl-pill-badge wl-pill-badge-mint';
    if (tone === 'blue') return 'wl-pill-badge wl-pill-badge-blue';
    return 'wl-pill-badge wl-pill-badge-peach';
  };

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
                {/* Left Column: Eyebrow + H1 + Lead + CTA + Marquee */}
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

                {/* Right Column: Exact Workleap Floating Signal & Pill Composition (Team-health.avif) */}
                <div className="wl-signal-canvas">
                  <div className="wl-signal-glow" />

                  {/* Top SVG Trend Curve + Top Floating Pill Card */}
                  <div className="wl-signal-top-track">
                    <svg
                      className="wl-signal-svg"
                      viewBox="0 0 500 115"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="wlCurveGrad" x1="20" y1="75" x2="355" y2="95" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#2545FF" stopOpacity="0" />
                          <stop offset="22%" stopColor="#2545FF" stopOpacity="0.48" />
                          <stop offset="55%" stopColor="#2545FF" stopOpacity="1" />
                          <stop offset="100%" stopColor="#2545FF" stopOpacity="1" />
                        </linearGradient>
                      </defs>

                      {/* Dashed secondary reference curve */}
                      <path
                        d="M 48 88 C 108 52, 148 56, 212 72 C 258 84, 302 52, 365 18"
                        stroke="#C5CBE3"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                      />

                      {/* Solid primary blue trend curve */}
                      <path
                        d="M 28 74 C 86 38, 142 14, 194 30 C 232 42, 248 62, 274 50 C 300 38, 326 78, 355 108"
                        stroke="url(#wlCurveGrad)"
                        strokeWidth="2.75"
                        strokeLinecap="round"
                      />

                      {/* Interactive curve points */}
                      {HERO_SIGNALS.map((sig, idx) => {
                        const isCurrent = idx === activeSignalIdx;
                        return (
                          <g
                            key={sig.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveSignalIdx(idx)}
                          >
                            {isCurrent && (
                              <circle
                                className="wl-curve-dot-pulse"
                                cx={sig.dotX}
                                cy={sig.dotY}
                                r="15"
                                fill="#2545FF"
                              />
                            )}
                            <circle
                              cx={sig.dotX}
                              cy={sig.dotY}
                              r={isCurrent ? '7' : '4.5'}
                              fill={isCurrent ? '#2545FF' : '#FFFFFF'}
                              stroke="#2545FF"
                              strokeWidth={isCurrent ? '3' : '2'}
                              style={{ transition: 'all 0.35s ease' }}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Top Floating Pill Card (Mirrors Workleap "Recognition ↓ 1.3pts" pill) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveSignalIdx((prev) => (prev + 1) % HERO_SIGNALS.length)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveSignalIdx((prev) => (prev + 1) % HERO_SIGNALS.length);
                        }
                      }}
                      className="wl-floating-pill wl-floating-pill-top"
                      title="Klik untuk mengganti sinyal keuangan"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <TopPillIcon size={20} weight="regular" style={{ color: '#171417' }} />
                        <span
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 500,
                            color: '#171417'
                          }}
                        >
                          {activeSignal.topPill.label}
                        </span>
                      </div>
                      <span className={getBadgeClass(activeSignal.topPill.badgeTone)}>
                        {activeSignal.topPill.badge}
                      </span>
                    </div>
                  </div>

                  {/* Center Main Signal Card (Mirrors Workleap "Team Performance signal" card) */}
                  <div className="wl-signal-main-card">
                    <div className="d-flex align-items-center gap-3">
                      <span className="wl-signal-sparkle-badge">
                        <Sparkle size={22} weight="fill" />
                      </span>
                      <h2 className="wl-signal-title">{activeSignal.title}</h2>
                    </div>

                    <div className="wl-signal-divider" />

                    <p className="wl-signal-copy">{activeSignal.copy}</p>

                    <Link
                      to={isAuthenticated ? activeSignal.ctaLink : '/login'}
                      className="wl-signal-action"
                    >
                      <span>{activeSignal.ctaLabel}</span>
                      <ArrowRight size={18} weight="regular" />
                    </Link>
                  </div>

                  {/* Bottom Staggered Overlapping Pill Cards (Mirrors "Completed task" & "Quarterly goals") */}
                  <div className="wl-signal-bottom-stack">
                    {/* Upper-Right Overlapping Pill */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveSignalIdx((prev) => (prev + 1) % HERO_SIGNALS.length)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveSignalIdx((prev) => (prev + 1) % HERO_SIGNALS.length);
                        }
                      }}
                      className="wl-floating-pill wl-floating-pill-bottom-right"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#F4F4F2',
                            color: 'var(--wl-brand-100)'
                          }}
                        >
                          <ArrowUpRight size={18} weight="bold" />
                        </span>
                        <span
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 500,
                            color: '#171417'
                          }}
                        >
                          {activeSignal.bottomRightPill.label}
                        </span>
                      </div>
                      <span className={`${getBadgeClass(activeSignal.bottomRightPill.badgeTone)} font-tabular`}>
                        {activeSignal.bottomRightPill.badge}
                      </span>
                    </div>

                    {/* Lower-Left Staggered Pill */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveSignalIdx((prev) => (prev + 1) % HERO_SIGNALS.length)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveSignalIdx((prev) => (prev + 1) % HERO_SIGNALS.length);
                        }
                      }}
                      className="wl-floating-pill wl-floating-pill-bottom-left"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Target size={22} weight="regular" style={{ color: '#171417', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: '#171417' }}>
                          {activeSignal.bottomLeftPill.prefix}
                          <strong style={{ fontWeight: 700 }}>{activeSignal.bottomLeftPill.boldText}</strong>
                        </span>
                      </div>
                      <span className={getBadgeClass(activeSignal.bottomLeftPill.badgeTone)}>
                        {activeSignal.bottomLeftPill.badge}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Signal Switcher Pills */}
                  <div className="wl-signal-switcher" role="tablist" aria-label="Pilih simulasi sinyal keuangan">
                    {HERO_SIGNALS.map((sig, idx) => (
                      <button
                        key={sig.id}
                        type="button"
                        role="tab"
                        aria-selected={activeSignalIdx === idx}
                        onClick={() => setActiveSignalIdx(idx)}
                        className={`wl-signal-switch-btn ${activeSignalIdx === idx ? 'is-active' : ''}`}
                      >
                        {sig.tabLabel}
                      </button>
                    ))}
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

                {/* 3-Column Illustrated Step Cards with Floating Pill Aesthetic */}
                <div className="wl-grid-3 text-center">
                  {/* Card 1 */}
                  <div className="d-flex flex-column align-items-center">
                    <div className="wl-how-step-visual">
                      <div className="d-flex flex-column gap-2">
                        <div className="wl-floating-pill w-100 py-2 px-3" style={{ cursor: 'default' }}>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--wl-brand-100)',
                                color: '#FFFFFF'
                              }}
                            >
                              <Sparkle size={14} weight="fill" />
                            </span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Penjualan 30 Galon</span>
                          </div>
                          <span className="wl-pill-badge wl-pill-badge-mint font-tabular">Rp 150.000</span>
                        </div>

                        <div className="wl-floating-pill w-100 py-2 px-3" style={{ cursor: 'default' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--wl-grey-80)' }}>
                            Jenis Pembayaran
                          </span>
                          <span className="wl-pill-badge wl-pill-badge-blue">Tunai / Kredit</span>
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
                      <div className="d-flex flex-column gap-2">
                        <div className="wl-floating-pill w-100 py-2 px-3" style={{ cursor: 'default' }}>
                          <div className="d-flex align-items-center gap-2">
                            <BellRinging size={18} weight="fill" style={{ color: 'var(--wl-brand-100)' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Warkop Kupi Aceh</span>
                          </div>
                          <span className="wl-pill-badge wl-pill-badge-peach">Belum Lunas</span>
                        </div>

                        <div className="wl-floating-pill w-100 py-2 px-3" style={{ cursor: 'default' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--wl-grey-80)' }}>
                            Pengingat Aplikasi
                          </span>
                          <span className="wl-pill-badge wl-pill-badge-peach font-tabular">Rp 175.000</span>
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
                      <div className="d-flex flex-column gap-2">
                        <div className="wl-floating-pill w-100 py-2 px-3" style={{ cursor: 'default' }}>
                          <div className="d-flex align-items-center gap-2">
                            <Trophy size={18} weight="regular" style={{ color: '#166638' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Keuntungan Bersih</span>
                          </div>
                          <span className="wl-pill-badge wl-pill-badge-mint font-tabular">Rp 1.085.000</span>
                        </div>

                        <div className="wl-floating-pill w-100 py-2 px-3" style={{ cursor: 'default' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--wl-grey-80)' }}>
                            Periode Laporan
                          </span>
                          <span className="wl-pill-badge wl-pill-badge-blue">Harian &amp; Bulanan</span>
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
            SECTION 3: STEP 1 DEEP DIVE (Interactive Transaction & Category Preview)
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

                {/* Right Interactive Layered Composition */}
                <div className="wl-signal-canvas">
                  <div className="wl-signal-glow" />

                  {/* Top Floating Pill */}
                  <div className="d-flex justify-content-end w-100 mb-2" style={{ maxWidth: '490px', zIndex: 4 }}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setStep1PaymentType((p) => (p === 'Kredit' ? 'Tunai' : 'Kredit'))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setStep1PaymentType((p) => (p === 'Kredit' ? 'Tunai' : 'Kredit'));
                        }
                      }}
                      className="wl-floating-pill"
                      style={{ animation: 'wlGentleFloat 5.5s ease-in-out infinite' }}
                      title="Klik untuk mengubah jenis pembayaran"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Wallet size={19} style={{ color: '#171417' }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                          Mode Pembayaran: <strong>{step1PaymentType}</strong>
                        </span>
                      </div>
                      <span
                        className={
                          step1PaymentType === 'Tunai'
                            ? 'wl-pill-badge wl-pill-badge-mint'
                            : 'wl-pill-badge wl-pill-badge-peach'
                        }
                      >
                        {step1PaymentType === 'Tunai' ? 'Otomatis Lunas' : 'Masuk Piutang'}
                      </span>
                    </div>
                  </div>

                  {/* Main Interactive Card */}
                  <div className="wl-signal-main-card">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="wl-signal-sparkle-badge">
                          <Sparkle size={20} weight="fill" />
                        </span>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Simulasi Pencatatan Interaktif
                          </div>
                          <h3 className="wl-signal-title" style={{ fontSize: '1.35rem' }}>
                            Input Pemasukan &amp; Beban
                          </h3>
                        </div>
                      </div>

                      {/* Payment Toggle Buttons */}
                      <div className="d-flex gap-1 p-1 rounded-pill" style={{ backgroundColor: 'var(--wl-soft-20)', border: '1px solid var(--wl-grey-20)' }}>
                        {['Tunai', 'Kredit'].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setStep1PaymentType(mode)}
                            style={{
                              border: 'none',
                              borderRadius: '100px',
                              padding: '0.25rem 0.7rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: step1PaymentType === mode ? 'var(--wl-brand-100)' : 'transparent',
                              color: step1PaymentType === mode ? '#FFFFFF' : 'var(--wl-grey-80)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="wl-signal-divider" />

                    {/* Selected Expense Category Preview */}
                    <div className="mb-3">
                      <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--wl-grey-80)', marginBottom: '0.5rem' }}>
                        Klik salah satu dari 6 kategori pengeluaran operasional:
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {EXPENSE_CATEGORIES_PREVIEW.map((cat, idx) => {
                          const isSelected = idx === selectedExpenseCatIdx;
                          return (
                            <button
                              key={cat.name}
                              type="button"
                              onClick={() => setSelectedExpenseCatIdx(idx)}
                              style={{
                                padding: '0.34rem 0.78rem',
                                borderRadius: '100px',
                                fontSize: '0.76rem',
                                fontWeight: 500,
                                backgroundColor: isSelected ? 'var(--wl-brand-100)' : 'var(--wl-soft-20)',
                                color: isSelected ? '#FFFFFF' : 'var(--wl-grey-100)',
                                border: isSelected ? '1px solid var(--wl-brand-100)' : '1px solid var(--wl-grey-20)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {cat.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className="p-3 rounded-4 d-flex align-items-center justify-content-between gap-2"
                      style={{
                        backgroundColor: 'var(--wl-soft-20)',
                        border: '1px solid var(--wl-grey-20)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)' }}>
                          Contoh Transaksi ({activeExpenseCat.name})
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--wl-grey-100)' }}>
                          {activeExpenseCat.sample}
                        </div>
                      </div>
                      <span className="wl-pill-badge wl-pill-badge-blue font-tabular">
                        {activeExpenseCat.nominal}
                      </span>
                    </div>
                  </div>

                  {/* Overlapping Bottom Duplicate Warning Pill */}
                  <div className="wl-signal-bottom-stack">
                    <div className="wl-floating-pill wl-floating-pill-bottom-left" style={{ cursor: 'default' }}>
                      <div className="d-flex align-items-center gap-2">
                        <Warning size={20} weight="fill" style={{ color: '#D9532F', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.84rem', color: '#171417' }}>
                          Cek otomatis bila nominal &amp; tanggal <strong>tercatat ganda.</strong>
                        </span>
                      </div>
                      <span className="wl-pill-badge wl-pill-badge-peach">Anti-Duplikat</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 4: STEP 2 DEEP DIVE (Interactive 7-Day Trend & Net Profit Signal)
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Interactive Layered Card Column */}
                <div className="wl-signal-canvas order-2 order-lg-1">
                  <div className="wl-signal-glow" />

                  {/* Top Floating Pill showing Selected Day's Net Profit */}
                  <div className="d-flex justify-content-end w-100 mb-2" style={{ maxWidth: '490px', zIndex: 4 }}>
                    <div
                      className="wl-floating-pill"
                      style={{ animation: 'wlGentleFloat 5.8s ease-in-out infinite', cursor: 'default' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Trophy size={19} style={{ color: '#171417' }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                          Laba Bersih ({activeTrendDay.label})
                        </span>
                      </div>
                      <span className="wl-pill-badge wl-pill-badge-mint font-tabular">
                        +{activeTrendDay.netVal}
                      </span>
                    </div>
                  </div>

                  {/* Main Interactive Chart Card */}
                  <div className="wl-signal-main-card">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="wl-signal-sparkle-badge">
                          <ChartBar size={20} weight="fill" />
                        </span>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Klik Batang Grafik Harian
                          </div>
                          <h3 className="wl-signal-title" style={{ fontSize: '1.35rem' }}>
                            Tren Kas &amp; Keuntungan Bersih
                          </h3>
                        </div>
                      </div>
                      <span className="wl-pill-badge wl-pill-badge-mint font-tabular">Rp 1.085.000</span>
                    </div>

                    <div className="wl-signal-divider" />

                    {/* Interactive 7-Day Bar Chart */}
                    <div
                      className="p-3 rounded-4"
                      style={{
                        backgroundColor: 'var(--wl-soft-20)',
                        border: '1px solid var(--wl-grey-20)'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.76rem' }}>
                        <span className="fw-semibold">Tanggal {activeTrendDay.label} 2026</span>
                        <span className="font-tabular" style={{ color: 'var(--wl-brand-100)', fontWeight: 600 }}>
                          Masuk: {activeTrendDay.inVal} · Beban: {activeTrendDay.outVal}
                        </span>
                      </div>

                      <div className="d-flex align-items-end justify-content-between gap-2 pt-2" style={{ height: '104px' }}>
                        {DAILY_TREND_DATA.map((d, idx) => {
                          const isSelected = idx === activeTrendDayIdx;
                          return (
                            <button
                              key={d.label}
                              type="button"
                              onClick={() => setActiveTrendDayIdx(idx)}
                              onMouseEnter={() => setActiveTrendDayIdx(idx)}
                              className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end border-0 bg-transparent p-1"
                              style={{
                                cursor: 'pointer',
                                borderRadius: '10px',
                                backgroundColor: isSelected ? 'rgba(37, 69, 255, 0.08)' : 'transparent',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-end gap-1 w-100 justify-content-center h-100">
                                <div
                                  style={{
                                    width: '10px',
                                    height: d.inH,
                                    backgroundColor: isSelected ? 'var(--wl-brand-100)' : '#7C92FF',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.25s ease'
                                  }}
                                />
                                <div
                                  style={{
                                    width: '10px',
                                    height: d.outH,
                                    backgroundColor: isSelected ? '#F28107' : '#CBD5E1',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.25s ease'
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: '0.66rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  color: isSelected ? 'var(--wl-brand-100)' : 'var(--wl-grey-60)',
                                  marginTop: '5px'
                                }}
                              >
                                {d.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Staggered Pill */}
                  <div className="wl-signal-bottom-stack">
                    <div className="wl-floating-pill wl-floating-pill-bottom-right" style={{ cursor: 'default' }}>
                      <div className="d-flex align-items-center gap-2">
                        <Target size={20} style={{ color: '#171417' }} />
                        <span style={{ fontSize: '0.86rem', color: '#171417' }}>
                          Rumus: <strong>Kas Masuk Aktual - Pengeluaran</strong>
                        </span>
                      </div>
                      <span className="wl-pill-badge wl-pill-badge-blue">Otomatis</span>
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
            SECTION 5: STEP 3 DEEP DIVE (Interactive Receivables Status Toggle)
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

                {/* Right Interactive Layered Receivables Composition */}
                <div className="wl-signal-canvas">
                  <div className="wl-signal-glow" />

                  {/* Top Floating Pill with Live Remaining Receivables */}
                  <div className="d-flex justify-content-end w-100 mb-2" style={{ maxWidth: '490px', zIndex: 4 }}>
                    <div
                      className="wl-floating-pill"
                      style={{ animation: 'wlGentleFloat 5.6s ease-in-out infinite', cursor: 'default' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Notebook size={19} style={{ color: '#171417' }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                          Sisa Piutang Simulasi
                        </span>
                      </div>
                      <span
                        className={`font-tabular ${
                          unpaidReceivablesCount === 0
                            ? 'wl-pill-badge wl-pill-badge-mint'
                            : 'wl-pill-badge wl-pill-badge-peach'
                        }`}
                      >
                        Rp {unpaidReceivablesTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Main Interactive Receivables Card */}
                  <div className="wl-signal-main-card">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="wl-signal-sparkle-badge">
                          <BellRinging size={20} weight="fill" />
                        </span>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Klik Status Untuk Simulasi Pelunasan
                          </div>
                          <h3 className="wl-signal-title" style={{ fontSize: '1.35rem' }}>
                            Daftar Piutang Pelanggan
                          </h3>
                        </div>
                      </div>
                      <span
                        className={
                          unpaidReceivablesCount === 0
                            ? 'wl-pill-badge wl-pill-badge-mint'
                            : 'wl-pill-badge wl-pill-badge-peach'
                        }
                      >
                        {unpaidReceivablesCount === 0 ? 'Semua Lunas' : `${unpaidReceivablesCount} Belum Lunas`}
                      </span>
                    </div>

                    <div className="wl-signal-divider" />

                    <div className="d-flex flex-column gap-2">
                      {demoReceivables.map((r) => (
                        <div
                          key={r.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleDemoReceivable(r.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleDemoReceivable(r.id);
                            }
                          }}
                          className="p-3 rounded-4 d-flex align-items-center justify-content-between gap-2"
                          style={{
                            backgroundColor: r.paid ? '#F8FAF9' : 'var(--wl-soft-20)',
                            border: r.paid ? '1px solid var(--wl-success-60)' : '1px solid var(--wl-grey-20)',
                            cursor: 'pointer',
                            transition: 'all 0.22s ease'
                          }}
                          title="Klik untuk mengubah status Lunas / Belum Lunas"
                        >
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '0.86rem', color: '#171417' }}>
                              {r.name}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--wl-grey-60)' }}>{r.meta}</div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="font-tabular fw-bold" style={{ fontSize: '0.86rem' }}>
                              {r.amount}
                            </span>
                            <span
                              className={
                                r.paid
                                  ? 'wl-pill-badge wl-pill-badge-mint'
                                  : 'wl-pill-badge wl-pill-badge-peach'
                              }
                            >
                              {r.paid ? 'Lunas' : 'Belum Lunas'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 6: BENEFIT SECTION (Floating Pill Cards Composition)
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Visual Composition */}
                <div className="wl-signal-canvas order-2 order-lg-1">
                  <div className="wl-signal-glow" />
                  <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: '490px', zIndex: 3 }}>
                    {[
                      {
                        num: '01',
                        title: 'Mengurangi risiko pencatatan terlewat atau ganda',
                        desc: 'Transaksi tersimpan rapi berdasarkan tanggal dan memiliki deteksi kemiripan transaksi.',
                        badge: 'Terstruktur',
                        tone: 'blue'
                      },
                      {
                        num: '02',
                        title: 'Mempermudah perhitungan keuntungan bersih',
                        desc: 'Keuntungan bersih dihitung otomatis dari kas masuk aktual dikurangi total pengeluaran.',
                        badge: 'Otomatis',
                        tone: 'mint'
                      },
                      {
                        num: '03',
                        title: 'Membantu memantau transaksi kredit pelanggan',
                        desc: 'Tagihan kredit tercatat terpisah sebagai piutang sampai pelanggan melunasinya.',
                        badge: 'Pantauan Kredit',
                        tone: 'peach'
                      },
                      {
                        num: '04',
                        title: 'Mempercepat pembuatan rekap harian dan bulanan',
                        desc: 'Laporan siap dilihat, dicetak, atau diekspor kapan saja tanpa rekap manual.',
                        badge: 'Praktis',
                        tone: 'blue'
                      }
                    ].map((b, idx) => (
                      <div
                        key={b.num}
                        className="wl-floating-pill w-100 p-3 align-items-start"
                        style={{
                          cursor: 'default',
                          animation: `wlGentleFloat ${5.4 + idx * 0.4}s ease-in-out ${idx * 0.5}s infinite`
                        }}
                      >
                        <div className="d-flex align-items-start gap-3">
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
                            <div style={{ fontFamily: 'var(--wl-display-font)', fontWeight: 600, fontSize: '0.94rem', color: '#171417' }}>
                              {b.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--wl-grey-80)', marginTop: '3px', lineHeight: 1.45 }}>
                              {b.desc}
                            </div>
                          </div>
                        </div>
                        <span className={getBadgeClass(b.tone)}>{b.badge}</span>
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
            SECTION 7: ORBIT ECOSYSTEM ON SOFT-LIGHT BG (Interactive Orbit Nodes)
            ==================================================================== */}
        <section className="wl-section bg-soft-light">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xhuge" />

              <div className="wl-grid-2">
                {/* Left Column: Concentric Orbit Circle Graphic (.u-logo-rotation-container) */}
                <div className="d-flex flex-column align-items-center">
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

                    {ORBIT_NODES.map((node, idx) => {
                      const Icon = node.icon;
                      const isActive = idx === activeOrbitIdx;
                      return (
                        <button
                          key={node.label}
                          type="button"
                          onClick={() => setActiveOrbitIdx(idx)}
                          onMouseEnter={() => setActiveOrbitIdx(idx)}
                          className={`wl-orbit-node ${isActive ? 'is-active' : ''}`}
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
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Floating Detail Pill below the Orbit */}
                  <div className="wl-floating-pill mt-4 w-100" style={{ maxWidth: '430px', cursor: 'default' }}>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--wl-brand-100)' }}>
                        {activeOrbitNode.label}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--wl-grey-80)' }}>
                        {activeOrbitNode.desc}
                      </div>
                    </div>
                    <span className="wl-pill-badge wl-pill-badge-blue">Aktif</span>
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
                            borderRadius: '16px',
                            boxShadow: '0 8px 20px rgba(12, 23, 84, 0.05)'
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
                              Sinyal Modul
                            </span>
                            <span className="wl-pill-badge wl-pill-badge-blue">{card.badge}</span>
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
                {/* Left Column: Eyebrow + H3 */}
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
