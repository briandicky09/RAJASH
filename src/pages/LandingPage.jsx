import React, { useState, useEffect, useRef } from 'react';
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
import { RajashMark } from '../components/layout/BrandLogo';
import Accordion from '../components/common/Accordion';
import { useAuth } from '../context/AuthContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const HERO_SIGNALS = [
  {
    id: 'piutang',
    tabLabel: 'Tagihan Pelanggan',
    dotX: 194,
    dotY: 30,
    topPill: {
      icon: Trophy,
      label: 'Tagihan Belum Lunas',
      badge: '4 Pelanggan',
      badgeTone: 'peach'
    },
    title: 'Pantau Tagihan Pelanggan',
    copy: 'Ada 4 pelanggan kredit yang belum melunasi pembayaran minggu ini, sehingga belum dihitung sebagai uang masuk.',
    ctaLabel: 'Lihat daftar piutang',
    ctaLink: '/piutang',
    bottomRightPill: {
      label: 'Total tagihan berjalan',
      badge: 'Rp 505.000',
      badgeTone: 'peach'
    },
    bottomLeftPill: {
      prefix: '2 tagihan lewat 5 hari ',
      boldText: 'perlu segera ditagih.',
      badge: 'Belum Lunas',
      badgeTone: 'peach'
    }
  },
  {
    id: 'kas',
    tabLabel: 'Keuntungan Usaha',
    dotX: 274,
    dotY: 50,
    topPill: {
      icon: Wallet,
      label: 'Keuntungan Bersih',
      badge: '↑ Rp 1,08 Jt',
      badgeTone: 'mint'
    },
    title: 'Ringkasan Keuntungan Usaha',
    copy: 'Uang dari penjualan tunai dan cicilan pelanggan minggu ini menjaga keuntungan bersih depot tetap positif.',
    ctaLabel: 'Lihat rekap keuangan',
    ctaLink: '/rekapitulasi',
    bottomRightPill: {
      label: 'Uang masuk diterima',
      badge: 'Rp 1.880.000',
      badgeTone: 'mint'
    },
    bottomLeftPill: {
      prefix: 'Keuntungan bersih usaha ',
      boldText: 'dihitung otomatis.',
      badge: 'Uang Masuk',
      badgeTone: 'mint'
    }
  },
  {
    id: 'pengeluaran',
    tabLabel: 'Biaya Operasional',
    dotX: 118,
    dotY: 44,
    topPill: {
      icon: GasPump,
      label: 'Biaya Operasional',
      badge: '6 Kategori',
      badgeTone: 'blue'
    },
    title: 'Catatan Pengeluaran Depot',
    copy: 'Biaya beli pasokan air dan BBM becak tercatat rapi dengan peringatan otomatis jika ada input ganda.',
    ctaLabel: 'Catat pengeluaran',
    ctaLink: '/pengeluaran',
    bottomRightPill: {
      label: 'Total pengeluaran berjalan',
      badge: 'Rp 795.000',
      badgeTone: 'blue'
    },
    bottomLeftPill: {
      prefix: 'Peringatan input ganda ',
      boldText: 'aktif menjaga catatan.',
      badge: 'Terjaga',
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
    id: 'lainnya',
    label: 'Biaya Lainnya',
    desc: 'Kebutuhan pendukung depot seperti tutup galon, tisu, dan listrik.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Nota / struk biaya operasional depot + aksen kilat listrik */}
        <path
          d="M12 8C12 6.89543 12.8954 6 14 6H34C35.1046 6 36 6.89543 36 8V40L32 37.5L28 40L24 37.5L20 40L16 37.5L12 40V8Z"
          fill="#EEF2FF"
          stroke="#4F46E5"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M17 14H28M17 20H25M17 26H22" stroke="#818CF8" strokeWidth="2.6" strokeLinecap="round" />
        <path
          d="M31.5 18L26.5 25.5H30.5L29 32L35 24H30.8L31.5 18Z"
          fill="#F59E0B"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'pasokan-air',
    label: 'Pembelian Pasokan Air',
    desc: 'Pembelian pasokan air baku tangki untuk kebutuhan isi ulang depot.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Galon air isi ulang + tetesan air murni */}
        <rect x="20" y="6" width="8" height="4.5" rx="1.5" fill="#0284C7" />
        <path
          d="M17.5 12.5H30.5L34 18V38.5C34 40.433 32.433 42 30.5 42H17.5C15.567 42 14 40.433 14 38.5V18L17.5 12.5Z"
          fill="#BAE6FD"
          stroke="#0284C7"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M14 23H34M14 31H34" stroke="#38BDF8" strokeWidth="2" />
        <path
          d="M24 21C24 21 19.5 26.2 19.5 29.2C19.5 31.6853 21.5147 33.7 24 33.7C26.4853 33.7 28.5 31.6853 28.5 29.2C28.5 26.2 24 21 24 21Z"
          fill="#0284C7"
        />
      </svg>
    )
  },
  {
    id: 'ganti-oli',
    label: 'Penggantian Oli',
    desc: 'Penggantian oli berkala agar armada becak pengantaran tetap prima.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Botol pelumas oli mesin becak + tetesan oli emas */}
        <rect x="19" y="7" width="8" height="4" rx="1.5" fill="#D97706" />
        <path
          d="M17 12H29L33 19V37.5C33 39.433 31.433 41 29.5 41H16.5C14.567 41 13 39.433 13 37.5V22L17 12Z"
          fill="#FDE68A"
          stroke="#D97706"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M23 22C23 22 19.2 26.6 19.2 29.3C19.2 31.3987 20.9013 33.1 23 33.1C25.0987 33.1 26.8 31.3987 26.8 29.3C26.8 26.6 23 22 23 22Z"
          fill="#F59E0B"
        />
        <path d="M35.5 29C35.5 29 33 32.2 33 34C33 35.3807 34.1193 36.5 35.5 36.5C36.8807 36.5 38 35.3807 38 34C38 32.2 35.5 29 35.5 29Z" fill="#D97706" />
      </svg>
    )
  },
  {
    id: 'kas-tunai',
    label: 'Pemasukan Kas Tunai',
    desc: 'Pemasukan penjualan galon tunai yang langsung berstatus Lunas.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dompet kas masuk + lencana centang Lunas hijau zamrud */}
        <rect x="8" y="13" width="30" height="23" rx="5" fill="#A7F3D0" stroke="#059669" strokeWidth="2.4" />
        <path d="M12 13V10.5C12 9.11929 13.1193 8 14.5 8H31.5C32.8807 8 34 9.11929 34 10.5V13" stroke="#059669" strokeWidth="2.4" />
        <rect x="27" y="21" width="12" height="7" rx="3" fill="#059669" />
        <circle cx="31" cy="24.5" r="1.5" fill="#FFFFFF" />
        <circle cx="17" cy="33" r="6.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M14.2 33L16.2 35L20 31.2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'pengingat',
    label: 'Pengingat Tagihan',
    desc: 'Peringatan otomatis di dalam aplikasi untuk piutang yang belum lunas.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lonceng pengingat tagihan piutang */}
        <path
          d="M24 8C17.9249 8 13 12.9249 13 19V27.5L9.5 32.5H38.5L35 27.5V19C35 12.9249 30.0751 8 24 8Z"
          fill="#FFEDD5"
          stroke="#EA580C"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M20 33C20.5 35.5 22.1 37 24 37C25.9 37 27.5 35.5 28 33" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="34" cy="13" r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M34 10.5V13.5M34 15.6H34.01" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'perbaikan-ban',
    label: 'Perbaikan Ban',
    desc: 'Pengeluaran tambal atau ganti ban kendaraan pengantaran galon.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Roda & ban becak pengantaran */}
        <circle cx="24" cy="24" r="15.5" fill="#99F6E4" stroke="#0F766E" strokeWidth="3.2" />
        <circle cx="24" cy="24" r="8.5" fill="#FFFFFF" stroke="#14B8A6" strokeWidth="2.4" />
        <circle cx="24" cy="24" r="3" fill="#0F766E" />
        <path d="M24 8.5V15.5M24 32.5V39.5M8.5 24H15.5M32.5 24H39.5" stroke="#0F766E" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'rekapitulasi',
    label: 'Rekapitulasi Keuangan',
    desc: 'Laporan ringkasan pemasukan, pengeluaran, piutang, dan kas bersih.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Grafik batang rekapitulasi keuangan meningkat */}
        <rect x="9" y="25" width="7" height="14" rx="2" fill="#93C5FD" />
        <rect x="20.5" y="18" width="7" height="21" rx="2" fill="#3B82F6" />
        <rect x="32" y="11" width="7" height="28" rx="2" fill="#1D4ED8" />
        <path d="M10 19L20 13L27 16L36 8" stroke="#1E3A8A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31 8H36V13" stroke="#1E3A8A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'piutang-kredit',
    label: 'Piutang Pelanggan',
    desc: 'Penjualan galon kredit pelanggan yang dipantau hingga berstatus Lunas.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Buku catatan piutang kredit pelanggan */}
        <rect x="12" y="8" width="26" height="32" rx="4" fill="#C7D2FE" stroke="#4338CA" strokeWidth="2.4" />
        <path d="M9 15H14M9 24H14M9 33H14" stroke="#4338CA" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M19 16H32M19 23H32M19 30H26" stroke="#4338CA" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="33.5" cy="31.5" r="5.5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M31.5 31.5H35.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'bbm-becak',
    label: 'BBM Becak',
    desc: 'Pencatatan biaya bahan bakar becak pengantaran galon harian.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pompa dispenser BBM becak */}
        <rect x="10" y="9" width="20" height="30" rx="4" fill="#FECDD3" stroke="#E11D48" strokeWidth="2.4" />
        <rect x="14" y="13.5" width="12" height="8" rx="2" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="1.8" />
        <path d="M30 16H34C35.6569 16 37 17.3431 37 19V31.5C37 33.433 35.433 35 33.5 35C31.567 35 30 33.433 30 31.5" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 11L38.5 15.5V21" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 39H32.5" stroke="#E11D48" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'servis-becak',
    label: 'Servis Kendaraan',
    desc: 'Biaya perawatan rutin mesin kendaraan operasional pengantaran.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Kunci pas bengkel & roda gigi perawatan mesin becak */}
        <circle cx="31" cy="30" r="8" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2.4" />
        <circle cx="31" cy="30" r="3" fill="#2563EB" />
        <path
          d="M27.6 12.2C25.3 10.6 22.2 10.6 19.9 12.2L22.8 15.1L20.1 17.8L17.2 14.9C15.6 17.2 15.6 20.3 17.2 22.6C18.9 24.9 21.8 25.8 24.4 25L33.5 34.1C34.5 35.1 36.1 35.1 37.1 34.1C38.1 33.1 38.1 31.5 37.1 30.5L28 21.4C28.8 18.8 27.9 14.5 27.6 12.2Z"
          transform="translate(-5 -2)"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
];

const TRUST_TESTIMONIALS = [
  {
    id: 't1',
    category: 'Catatan Terpusat',
    quote:
      'Sebelumnya penjualan tunai dan tagihan kredit sering tercampur di buku tulis. Dengan RAJASH, uang masuk dan utang pelanggan langsung terpisah rapi.”',
    author: 'Dedy Darmansyah',
    role: 'Pemilik Depot Air Minum RAJASH'
  },
  {
    id: 't2',
    category: 'Pantau Piutang',
    quote:
      'Pemilik usaha bisa langsung melihat pelanggan yang masih punya tagihan, mencatat cicilan, dan membedakan status Belum Lunas atau Lunas.”',
    author: 'Catatan Tagihan Kredit',
    role: 'Pemantauan Piutang Pelanggan'
  },
  {
    id: 't3',
    category: 'Hitung Keuntungan',
    quote:
      'Keuntungan bersih harian dan bulanan langsung terhitung otomatis karena seluruh pemasukan tunai dan 6 kategori biaya depot tercatat teratur.”',
    author: 'Ringkasan Usaha Harian',
    role: 'Rekap Uang Masuk & Keluar Depot'
  },
  {
    id: 't4',
    category: 'Cegah Salah Catat',
    quote:
      'Saat ada transaksi yang tanggal, pelanggan, dan jumlah rupiahnya sama persis, aplikasi langsung memberi peringatan agar catatan tidak ganda.”',
    author: 'Pemeriksaan Catatan',
    role: 'Peringatan Transaksi Ganda'
  },
  {
    id: 't5',
    category: 'Biaya Operasional',
    quote:
      'Pengeluaran harian mulai dari beli air tangki, BBM becak, servis kendaraan, ganti oli, sampai perbaikan ban punya kategorinya masing-masing.”',
    author: 'Catatan Biaya Depot',
    role: '6 Kategori Pengeluaran Harian'
  },
  {
    id: 't6',
    category: 'Mudah Diakses',
    quote:
      'Dibuat menyesuaikan kebiasaan kerja depot air minum isi ulang agar pemilik usaha bisa mengecek catatan keuangan lewat HP maupun komputer.”',
    author: 'Tim Pengembang A26-CS148',
    role: 'Aplikasi Catatan Keuangan RAJASH'
  }
];

const FAQ_ITEMS = [
  {
    question: 'Apa itu RAJASH?',
    answer:
      'RAJASH adalah aplikasi web untuk membantu pemilik Depot Air Minum Isi Ulang RAJASH di Ulee Kareng, Banda Aceh mencatat pemasukan, pengeluaran, piutang pelanggan, dan melihat rekap keuangan harian maupun bulanan.'
  },
  {
    question: 'Apa saja yang bisa dicatat di RAJASH?',
    answer:
      'Anda dapat mencatat penjualan air mineral dan air RO (baik tunai maupun kredit), mencatat 6 kategori pengeluaran depot (BBM Becak, Servis Kendaraan, Penggantian Oli, Perbaikan Ban, Pembelian Pasokan Air, dan Lainnya), serta mencatat cicilan atau pelunasan piutang pelanggan.'
  },
  {
    question: 'Apakah penjualan kredit atau bayar nanti bisa dicatat?',
    answer:
      'Bisa. Saat mencatat pemasukan, cukup pilih pembayaran Kredit. Transaksi otomatis berstatus Belum Lunas dan masuk ke daftar piutang pelanggan tanpa langsung dihitung sebagai uang kas sampai pelanggan melunasinya.'
  },
  {
    question: 'Bagaimana cara melihat pelanggan yang masih berutang?',
    answer:
      'Anda bisa membuka menu Piutang atau melihat ringkasan di Dashboard. Aplikasi menampilkan nama pelanggan, tanggal transaksi, jumlah tagihan, sisa pembayaran, status Lunas atau Belum Lunas, serta pengingat tagihan.'
  },
  {
    question: 'Apakah keuntungan usaha dan rekap keuangan dihitung otomatis?',
    answer:
      'Ya. Di halaman Rekapitulasi, Anda cukup memilih tanggal atau bulan untuk melihat total uang kas diterima, pengeluaran per kategori, rincian penjualan air, daftar piutang, dan keuntungan bersih secara otomatis.'
  },
  {
    question: 'Apakah RAJASH bisa dibuka lewat HP?',
    answer:
      'Bisa. Tampilan RAJASH menyesuaikan ukuran layar sehingga tetap nyaman dibuka lewat HP, tablet, laptop, maupun komputer.'
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const landingRootRef = useRef(null);
  useScrollReveal(landingRootRef);
  const [activeSignalIdx, setActiveSignalIdx] = useState(0);
  const [step1PaymentType, setStep1PaymentType] = useState('Kredit');
  const [selectedExpenseCatIdx, setSelectedExpenseCatIdx] = useState(4);
  const [activeTrendDayIdx, setActiveTrendDayIdx] = useState(5);
  const [demoReceivables, setDemoReceivables] = useState(INITIAL_DEMO_RECEIVABLES);
  const [activeOrbitIdx, setActiveOrbitIdx] = useState(8);
  const [testimonialSlideIdx, setTestimonialSlideIdx] = useState(0);
  const [testimonialPlaying, setTestimonialPlaying] = useState(true);
  const [testimonialProgress, setTestimonialProgress] = useState(0);
  const orbitColumnRef = useRef(null);
  const orbitWrapperRef = useRef(null);
  const orbitNodeRefs = useRef([]);
  const orbitGlyphRefs = useRef([]);

  useEffect(() => {
    if (!testimonialPlaying) return undefined;
    const SLIDE_DURATION = 5500;
    const TICK_MS = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += TICK_MS;
      if (elapsed >= SLIDE_DURATION) {
        elapsed = 0;
        setTestimonialSlideIdx((prev) => (prev + 1) % TRUST_TESTIMONIALS.length);
        setTestimonialProgress(0);
      } else {
        setTestimonialProgress(elapsed / SLIDE_DURATION);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [testimonialPlaying, testimonialSlideIdx]);

  const handlePrevTestimonial = () => {
    setTestimonialProgress(0);
    setTestimonialSlideIdx(
      (prev) => (prev - 1 + TRUST_TESTIMONIALS.length) % TRUST_TESTIMONIALS.length
    );
  };

  const handleNextTestimonial = () => {
    setTestimonialProgress(0);
    setTestimonialSlideIdx((prev) => (prev + 1) % TRUST_TESTIMONIALS.length);
  };

  const visibleTestimonials = [0, 1, 2].map(
    (offset) => TRUST_TESTIMONIALS[(testimonialSlideIdx + offset) % TRUST_TESTIMONIALS.length]
  );

  useEffect(() => {
    const N = ORBIT_NODES.length;
    const R_PCT = 0.28;
    const R_MAX = 225;
    const SIZE_MAX = 108;
    const SIZE_MIN = 23;
    const IMG_MAX = 50;
    const IMG_MIN = 18;
    const PERIOD = 45500;
    const OPACITY_MIN = 0;

    const startAngles = ORBIT_NODES.map((_, i) => (Math.PI * 2 * i) / N);
    let startTime = null;
    let rafId = null;

    function easeSize(angle) {
      return (Math.cos(angle - Math.PI) + 1) / 2;
    }

    function animate(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      const colEl = orbitColumnRef.current;
      const wrapEl = orbitWrapperRef.current;
      const colW = colEl ? colEl.clientWidth : window.innerWidth;
      const wrapW = wrapEl ? wrapEl.clientWidth : 340;
      const cx = wrapW / 2;
      const cy = wrapW / 2;

      const desiredR = Math.min(R_PCT * Math.min(window.innerWidth, window.innerHeight), R_MAX);
      const maxHorizontalReach = Math.max(96, colW / 2 - 8);
      const maxVerticalReach = colEl ? Math.max(120, colEl.clientHeight / 2 - 8) : maxHorizontalReach;
      const maxReach = Math.min(maxHorizontalReach, maxVerticalReach);
      const scaleFactor =
        desiredR + SIZE_MAX / 2 > maxReach
          ? maxReach / (desiredR + SIZE_MAX / 2)
          : 1;

      const r = desiredR * scaleFactor;
      const nodeScaleCap = Math.max(0.56, scaleFactor);
      const nodeMax = SIZE_MAX * nodeScaleCap;
      const nodeMin = SIZE_MIN * nodeScaleCap;
      const imgMax = IMG_MAX * nodeScaleCap;
      const imgMin = IMG_MIN * nodeScaleCap;

      orbitNodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const angle = startAngles[i] + (elapsed / PERIOD) * Math.PI * 2;

        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        const t = easeSize(angle % (Math.PI * 2));
        const size = nodeMin + (nodeMax - nodeMin) * t;
        const imgSize = imgMin + (imgMax - imgMin) * t;

        const s = size / SIZE_MAX;
        el.style.transform = `translate(${x - SIZE_MAX / 2}px, ${y - SIZE_MAX / 2}px) scale(${s})`;
        el.style.zIndex = String(Math.round(1 + t * 8));
        el.style.opacity = String(OPACITY_MIN + (1 - OPACITY_MIN) * t);

        const glyphEl = orbitGlyphRefs.current[i];
        if (glyphEl) {
          glyphEl.style.width = `${imgSize}px`;
          glyphEl.style.height = `${imgSize}px`;
        }
      });

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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

  const getBadgeClass = (tone) => {
    if (tone === 'mint') return 'wl-pill-badge wl-pill-badge-mint';
    if (tone === 'blue') return 'wl-pill-badge wl-pill-badge-blue';
    return 'wl-pill-badge wl-pill-badge-peach';
  };

  return (
    <div ref={landingRootRef} style={{ backgroundColor: 'var(--wl-true-white)', minHeight: '100dvh' }}>
      {/* NAVBAR (.navbar_component) */}
      <LandingNavbar />

      <main id="main-content">
        <div className="wl-bg-waves">
          {/* ====================================================================
              SECTION 1: HERO SECTION (Exact Workleap Officevibe 2-Column Blueprint)
              ==================================================================== */}
          <section id="beranda" className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-hero-spacer" />

              <div className="wl-grid-2 is-hero">
                {/* Left Column: Eyebrow + H1 + Lead + CTA + Marquee */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow wl-hero-anim-eyebrow">
                    Aplikasi Catatan Keuangan Depot Air
                  </div>

                  <h1 className="wl-heading-h1 wl-hero-anim-heading">
                    Catat keuangan depot air lebih mudah{' '}
                    <span className="wl-serif-italic">dengan RAJASH</span>
                  </h1>

                  <div className="wl-hero-anim-lead" style={{ maxWidth: '36rem' }}>
                    <p className="wl-body-lead mb-0">
                      Catat pemasukan, pengeluaran, dan tagihan pelanggan dalam satu aplikasi.
                      Tidak perlu repot menghitung semuanya secara manual.
                    </p>
                  </div>

                  <div className="wl-button-group mt-1 wl-hero-anim-cta">
                    <Link
                      to={isAuthenticated ? '/dashboard' : '/login'}
                      className="wl-button"
                    >
                      Masuk ke Dashboard
                    </Link>
                    <a href="#cara-kerja" className="wl-button is-secondary">
                      Pelajari Cara Kerja
                    </a>
                  </div>
                </div>

                {/* Right Column: Exact Workleap Floating Signal & Pill Composition (Team-health.avif) */}
                <div className="wl-signal-canvas wl-hero-anim-signal">
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
                      title="Klik untuk melihat contoh ringkasan lain"
                    >
                      <div className="d-flex align-items-center gap-2" style={{ minWidth: 0, flex: '1 1 auto' }}>
                        <TopPillIcon size={20} weight="regular" style={{ color: '#171417', flexShrink: 0 }} />
                        <span
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 500,
                            color: '#171417',
                            minWidth: 0
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
                    <div key={activeSignal.id} className="wl-signal-swap">
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
                      <div className="d-flex align-items-center gap-2" style={{ minWidth: 0, flex: '1 1 160px' }}>
                        <span
                          className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
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
                            color: '#171417',
                            minWidth: 0
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
                      <div className="d-flex align-items-center gap-2" style={{ minWidth: 0, flex: '1 1 170px' }}>
                        <Target size={22} weight="regular" style={{ color: '#171417', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: '#171417', minWidth: 0 }}>
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
                  <div className="wl-signal-switcher" role="tablist" aria-label="Pilih contoh ringkasan keuangan">
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
            Wrapped inside .wl-bg-waves (Matching Workleap Officevibe Blueprint)
            ==================================================================== */}
        <section id="cara-kerja" className="wl-section wl-how-it-works-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-capability-container" data-reveal="fade-in">
                <div
                  className="d-flex flex-column align-items-center text-center mx-auto"
                  style={{ maxWidth: '46rem', marginBottom: '3rem' }}
                >
                  <div className="wl-eyebrow mb-3" data-reveal="fade-up">Cara Kerja</div>
                  <h2 className="wl-heading-h2 mb-3" data-reveal="fade-up" style={{ '--reveal-delay': '85ms' }}>
                    Catatan rapi. Tagihan terpantau. Rekap lebih cepat dalam{' '}
                    <span className="wl-serif-italic">3 langkah mudah.</span>
                  </h2>
                  <p className="wl-body-lead mb-0" data-reveal="fade-up" style={{ '--reveal-delay': '170ms' }}>
                    RAJASH membantu pemilik depot air minum mengganti buku catatan manual agar
                    pemasukan tunai, penjualan kredit, dan keuntungan usaha bisa dipantau setiap hari
                    tanpa repot.
                  </p>
                </div>

                {/* 3-Column Illustrated Step Cards (Matching Screenshot 1 Visuals) */}
                <div className="wl-grid-3 text-center">
                  {/* Card 1: Circular Gauge + Trend Curve (Mirrors "Engagement 7.5 VERY GOOD") */}
                  <div
                    className="d-flex flex-column align-items-center wl-how-step-card"
                    data-reveal="fade-up"
                    style={{ '--reveal-delay': '0ms' }}
                  >
                    <div className="wl-how-step-visual">
                      {/* Background SVG Trend Curve */}
                      <svg
                        viewBox="0 0 260 65"
                        fill="none"
                        style={{
                          width: '90%',
                          height: '52px',
                          marginBottom: '-18px',
                          zIndex: 1
                        }}
                        aria-hidden="true"
                      >
                        <path
                          d="M 10 54 C 55 24, 95 28, 135 42 C 175 56, 205 18, 250 8"
                          stroke="#2545FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="176" cy="39" r="5" fill="#2545FF" />
                      </svg>

                      {/* Floating White Gauge Card */}
                      <div
                        className="d-flex align-items-center gap-3 p-3 px-4"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '20px',
                          boxShadow: '0 16px 36px -8px rgba(37, 69, 255, 0.14), 0 4px 12px rgba(12, 23, 84, 0.05)',
                          border: '1px solid rgba(23, 20, 23, 0.05)',
                          zIndex: 2
                        }}
                      >
                        {/* Circular Ring Gauge */}
                        <div
                          className="position-relative d-flex align-items-center justify-content-center wl-how-step-icon-badge"
                          style={{ width: '68px', height: '68px' }}
                        >
                          <svg viewBox="0 0 72 72" style={{ width: '68px', height: '68px', transform: 'rotate(-90deg)' }}>
                            <circle cx="36" cy="36" r="29" stroke="#E8EEFF" strokeWidth="7" fill="none" />
                            <circle
                              cx="36"
                              cy="36"
                              r="29"
                              stroke="#1D35C8"
                              strokeWidth="7"
                              strokeDasharray="182"
                              strokeDashoffset="38"
                              strokeLinecap="round"
                              fill="none"
                            />
                          </svg>
                          <div className="position-absolute text-center">
                            <div className="font-tabular fw-bold" style={{ fontSize: '0.95rem', lineHeight: 1, color: '#171417' }}>
                              100%
                            </div>
                            <div style={{ fontSize: '0.58rem', color: 'var(--wl-grey-60)', marginTop: '2px' }}>
                              Rapi
                            </div>
                          </div>
                        </div>

                        <div className="text-start">
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#171417' }}>
                            Pencatatan
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#166638', fontWeight: 500, margin: '2px 0 6px' }}>
                            &uarr; Tunai &amp; Kredit
                          </div>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.18rem 0.55rem',
                              borderRadius: '100px',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              letterSpacing: '0.03em',
                              backgroundColor: '#E0E7FF',
                              color: '#1D30EC',
                              textTransform: 'uppercase'
                            }}
                          >
                            TERCATAT RAPI
                          </span>
                        </div>
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Catat lebih teratur</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Catat penjualan tunai, pesanan kredit, dan 6 jenis pengeluaran depot.
                    </p>
                  </div>

                  {/* Card 2: Floating Signal Card + Top-Right Notification Tile (Mirrors "Growth signal") */}
                  <div
                    className="d-flex flex-column align-items-center wl-how-step-card"
                    data-reveal="fade-up"
                    style={{ '--reveal-delay': '100ms' }}
                  >
                    <div className="wl-how-step-visual">
                      <div className="position-relative" style={{ width: '100%', maxWidth: '285px' }}>
                        {/* Top-Right Floating Notification Tile */}
                        <div
                          className="wl-how-step-icon-badge"
                          style={{
                            position: 'absolute',
                            top: '-18px',
                            right: '10px',
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 10px 24px rgba(12, 23, 84, 0.14)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 3
                          }}
                        >
                          <RajashMark size={26} />
                          <span
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: '#EF4444',
                              color: '#FFFFFF',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            4
                          </span>
                        </div>

                        {/* White Signal Card */}
                        <div
                          className="p-3 text-start"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '18px',
                            boxShadow: '0 16px 36px -8px rgba(37, 69, 255, 0.14), 0 4px 12px rgba(12, 23, 84, 0.05)',
                            border: '1px solid rgba(23, 20, 23, 0.05)'
                          }}
                        >
                          <div className="d-flex align-items-center gap-2 pb-2 mb-2" style={{ borderBottom: '1px solid #ECECE9' }}>
                            <RajashMark size={24} tile={true} />
                            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#171417' }}>
                              Pengingat Tagihan
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--wl-grey-80)', lineHeight: 1.45, marginBottom: '0.55rem' }}>
                            Ada 4 tagihan kredit pelanggan sebesar Rp 505.000 yang belum lunas.
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2545FF' }}>
                            Lihat piutang &rarr;
                          </div>
                        </div>
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Pantau piutang lebih mudah</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Lihat pelanggan yang masih punya tagihan dan tandai lunas saat sudah dibayar.
                    </p>
                  </div>

                  {/* Card 3: Sparkle Header + 3 Staggered Checklist Pills (Mirrors "Act with an AI coach") */}
                  <div
                    className="d-flex flex-column align-items-center wl-how-step-card"
                    data-reveal="fade-up"
                    style={{ '--reveal-delay': '200ms' }}
                  >
                    <div className="wl-how-step-visual">
                      <div className="d-flex flex-column gap-2 w-100" style={{ maxWidth: '290px' }}>
                        <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                          <Sparkle size={15} weight="fill" className="wl-how-step-icon-badge" style={{ color: '#2545FF' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#171417' }}>
                            Rekap keuangan siap dilihat.
                          </span>
                        </div>

                        {[
                          { text: 'Uang masuk tunai sudah dirangkum.', offset: '0px' },
                          { text: 'Keuntungan bersih Rp 1.085.000 terhitung.', offset: '-10px', bold: true },
                          { text: 'Rekap harian & bulanan siap cetak.', offset: '8px' }
                        ].map((item) => (
                          <div
                            key={item.text}
                            className="d-flex align-items-center gap-2 py-2 px-3 wl-how-checklist-pill"
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              boxShadow: '0 10px 24px -6px rgba(37, 69, 255, 0.14)',
                              border: '1px solid rgba(23, 20, 23, 0.05)',
                              transform: `translateX(${item.offset})`,
                              fontSize: '0.73rem',
                              fontWeight: item.bold ? 600 : 400,
                              color: '#171417'
                            }}
                          >
                            <Check size={13} weight="bold" style={{ color: '#2545FF', flexShrink: 0 }} />
                            <span>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Rekap keuangan lebih mudah</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Lihat ringkasan harian dan bulanan beserta keuntungan bersih tanpa hitung manual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>
        </div>

        {/* ====================================================================
            SECTION 3: STEP 1 DEEP DIVE (Blue-to-Purple Gradient Stage - Screenshot 2)
            ==================================================================== */}
        <section id="fitur" className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Text Column */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow" data-reveal="fade-up">Langkah 1 · Catat Transaksi</div>
                  <h2 className="wl-heading-h2" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' }}>
                    Catat Pemasukan dan Pengeluaran{' '}
                    <span className="wl-serif-italic">Lebih Praktis</span>
                  </h2>
                  <p className="wl-body-lead mb-0" data-reveal="fade-up" style={{ '--reveal-delay': '160ms' }}>
                    Catat setiap penjualan air, baik pembayaran tunai maupun kredit. Jumlah transaksi
                    akan dihitung otomatis, sementara biaya BBM, servis kendaraan, dan pembelian
                    pasokan air ikut terpantau rapi.
                  </p>

                  <ul className="wl-checkmarks-list" data-reveal="fade-up" style={{ '--reveal-delay': '240ms' }}>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Catat penjualan air galon dengan pilihan bayar{' '}
                        <strong>Tunai (Lunas)</strong> atau <strong>Kredit (Belum Lunas)</strong>
                      </div>
                    </li>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Enam kategori biaya harian depot: <strong>BBM Becak</strong>,{' '}
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
                        Ada peringatan otomatis jika tanggal, pelanggan, dan jumlah transaksi yang
                        sama terinput dua kali
                      </div>
                    </li>
                  </ul>

                  <div className="wl-button-group pt-2" data-reveal="fade-up" style={{ '--reveal-delay': '310ms' }}>
                    <Link
                      to={isAuthenticated ? '/pemasukan' : '/login'}
                      className="wl-button"
                    >
                      Catat Transaksi
                    </Link>
                    <a href="#modul" className="wl-button is-secondary">
                      Lihat Ringkasan
                    </a>
                  </div>
                </div>

                {/* Right Column: Blue-to-Purple Gradient Stage (Matching Screenshot 2) */}
                <div className="wl-step-gradient-stage" data-reveal="scale" style={{ '--reveal-delay': '120ms' }}>
                  {/* Top-Left Notification Tile + Overlapping Banner */}
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">1</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        Jangan lupa catat transaksi hari ini!
                      </span>
                    </div>
                  </div>

                  {/* Curved Orange Loop Arrow SVG */}
                  <svg
                    className="wl-step-curved-arrow"
                    viewBox="0 0 90 130"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M 42 8 C 68 8, 72 34, 48 34 C 20 34, 6 68, 28 112"
                      stroke="#FA7249"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 18 106 L 29 114 L 32 100"
                      stroke="#FA7249"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Translucent Frosted Glass Frame */}
                  <div className="wl-step-glass-frame">
                    {/* Cream Top Prompt Bubble */}
                    <div className="wl-step-glass-top-bubble d-flex align-items-center justify-content-between gap-2 flex-wrap">
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Contoh Form Pencatatan
                        </div>
                        <div style={{ fontSize: '0.96rem', fontWeight: 600, color: '#171417' }}>
                          Pilih cara bayar &amp; kategori biaya depot:
                        </div>
                      </div>
                      {/* Toggle Tunai / Kredit */}
                      <div className="d-flex gap-1 p-1 rounded-pill" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--wl-grey-20)' }}>
                        {['Tunai', 'Kredit'].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setStep1PaymentType(mode)}
                            style={{
                              border: 'none',
                              borderRadius: '100px',
                              padding: '0.24rem 0.72rem',
                              fontSize: '0.74rem',
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

                    {/* White Inner Card */}
                    <div className="wl-step-glass-inner-card">
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0, flex: '1 1 180px' }}>
                          <span
                            className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#EEF2FF',
                              color: 'var(--wl-brand-100)'
                            }}
                          >
                            <Check size={14} weight="bold" />
                          </span>
                          <span key={step1PaymentType} className="wl-signal-swap" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--wl-grey-80)', minWidth: 0 }}>
                            Status Otomatis: {step1PaymentType === 'Tunai' ? 'Lunas (Masuk Kas)' : 'Belum Lunas (Masuk Piutang)'}
                          </span>
                        </div>
                        <span
                          className={
                            step1PaymentType === 'Tunai'
                              ? 'wl-pill-badge wl-pill-badge-mint'
                              : 'wl-pill-badge wl-pill-badge-peach'
                          }
                        >
                          {step1PaymentType}
                        </span>
                      </div>

                      {/* 6 Expense Category Interactive Pills */}
                      <div className="p-3 rounded-3 mb-3" style={{ border: '1px solid var(--wl-grey-20)', backgroundColor: '#FAFAFA' }}>
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          {EXPENSE_CATEGORIES_PREVIEW.map((cat, idx) => {
                            const isSelected = idx === selectedExpenseCatIdx;
                            return (
                              <button
                                key={cat.name}
                                type="button"
                                onClick={() => setSelectedExpenseCatIdx(idx)}
                                style={{
                                  padding: '0.3rem 0.72rem',
                                  borderRadius: '100px',
                                  fontSize: '0.73rem',
                                  fontWeight: 500,
                                  backgroundColor: isSelected ? 'var(--wl-brand-100)' : '#FFFFFF',
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
                        <div
                          key={activeExpenseCat.name}
                          className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 wl-signal-swap"
                          style={{ borderTop: '1px solid #ECECE9', fontSize: '0.8rem' }}
                        >
                          <span style={{ color: 'var(--wl-grey-80)' }}>{activeExpenseCat.sample}</span>
                          <strong className="font-tabular" style={{ color: '#171417' }}>{activeExpenseCat.nominal}</strong>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <span style={{ fontSize: '0.74rem', color: '#D9532F', fontWeight: 500 }}>
                          &#9888; Peringatan transaksi ganda aktif
                        </span>
                        <Link
                          to={isAuthenticated ? '/pemasukan' : '/login'}
                          style={{
                            padding: '0.45rem 1.25rem',
                            borderRadius: '100px',
                            backgroundColor: 'var(--wl-brand-100)',
                            color: '#FFFFFF',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          Simpan
                        </Link>
                      </div>
                    </div>

                    {/* Orange User Avatar Pointer Badge at Bottom-Right */}
                    <div className="wl-step-avatar-pointer" aria-hidden="true">
                      <Sparkle size={20} weight="fill" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 4: STEP 2 DEEP DIVE (Blue-to-Purple Gradient Stage - Screenshot 2)
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Column: Blue-to-Purple Gradient Stage */}
                <div className="wl-step-gradient-stage variant-purple order-2 order-lg-1" data-reveal="scale" style={{ '--reveal-delay': '100ms' }}>
                  {/* Top-Left Notification Cluster */}
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">7</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        Keuntungan Bersih ({activeTrendDay.label}): +{activeTrendDay.netVal}
                      </span>
                    </div>
                  </div>

                  {/* Curved Orange Loop Arrow SVG */}
                  <svg
                    className="wl-step-curved-arrow"
                    viewBox="0 0 90 130"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M 42 8 C 68 8, 72 34, 48 34 C 20 34, 6 68, 28 112"
                      stroke="#FA7249"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 18 106 L 29 114 L 32 100"
                      stroke="#FA7249"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Translucent Frosted Glass Frame */}
                  <div className="wl-step-glass-frame">
                    <div className="wl-step-glass-top-bubble d-flex flex-wrap align-items-center justify-content-between gap-2">
                      <div style={{ minWidth: 0, flex: '1 1 180px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Ringkasan Uang Masuk &amp; Keluar
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171417' }}>
                          Keuntungan Bersih = Uang Diterima - Pengeluaran
                        </div>
                      </div>
                      <span className="wl-pill-badge wl-pill-badge-mint font-tabular">Rp 1.085.000</span>
                    </div>

                    <div className="wl-step-glass-inner-card">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2" style={{ fontSize: '0.78rem' }}>
                        <span className="fw-semibold" style={{ color: '#171417' }}>
                          Klik Grafik Harian ({activeTrendDay.label} 2026)
                        </span>
                        <span className="font-tabular" style={{ color: 'var(--wl-brand-100)', fontWeight: 600 }}>
                          Masuk: {activeTrendDay.inVal} · Keluar: {activeTrendDay.outVal}
                        </span>
                      </div>

                      <div
                        className="d-flex align-items-end justify-content-between gap-1 gap-sm-2 p-2 p-sm-3 rounded-3 wl-trend-chart-wrap"
                        data-reveal="fade-in"
                        style={{
                          height: '112px',
                          backgroundColor: '#FAFAFA',
                          border: '1px solid var(--wl-grey-20)'
                        }}
                      >
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
                                minWidth: 0,
                                cursor: 'pointer',
                                borderRadius: '8px',
                                backgroundColor: isSelected ? 'rgba(37, 69, 255, 0.09)' : 'transparent',
                                transition: 'background-color 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-end gap-1 w-100 justify-content-center h-100">
                                <div
                                  className="wl-trend-bar-fill"
                                  style={{
                                    width: '9px',
                                    height: d.inH,
                                    backgroundColor: isSelected ? 'var(--wl-brand-100)' : '#7C92FF',
                                    borderRadius: '4px 4px 0 0',
                                    '--bar-delay': `${idx * 55}ms`
                                  }}
                                />
                                <div
                                  className="wl-trend-bar-fill"
                                  style={{
                                    width: '9px',
                                    height: d.outH,
                                    backgroundColor: isSelected ? '#FA7249' : '#CBD5E1',
                                    borderRadius: '4px 4px 0 0',
                                    '--bar-delay': `${idx * 55 + 65}ms`
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: '0.64rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  color: isSelected ? 'var(--wl-brand-100)' : 'var(--wl-grey-60)',
                                  marginTop: '4px'
                                }}
                              >
                                {d.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="wl-step-avatar-pointer" aria-hidden="true">
                      <ChartBar size={20} weight="fill" />
                    </div>
                  </div>
                </div>

                {/* Right Text Column */}
                <div className="d-flex flex-column align-items-start order-1 order-lg-2" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow" data-reveal="fade-up">Langkah 2 · Rekap Keuangan</div>
                  <h2 className="wl-heading-h2" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' }}>
                    Lihat Keuntungan Usaha{' '}
                    <span className="wl-serif-italic">Dengan Jelas</span>
                  </h2>
                  <p className="wl-body-lead mb-0" data-reveal="fade-up" style={{ '--reveal-delay': '160ms' }}>
                    Lihat ringkasan pemasukan, pengeluaran, dan keuntungan usaha berdasarkan
                    tanggal yang Anda pilih. Tidak perlu lagi menjumlahkan catatan buku satu per
                    satu.
                  </p>

                  <ul className="wl-checkmarks-list" data-reveal="fade-up" style={{ '--reveal-delay': '240ms' }}>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Rekap harian dan bulanan yang memisahkan uang tunai diterima dengan
                        tagihan pelanggan yang belum dibayar
                      </div>
                    </li>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Keuntungan bersih otomatis dihitung dari uang masuk nyata dikurangi
                        pengeluaran depot
                      </div>
                    </li>
                  </ul>

                  <div className="pt-2" data-reveal="fade-up" style={{ '--reveal-delay': '310ms' }}>
                    <Link
                      to={isAuthenticated ? '/rekapitulasi' : '/login'}
                      className="wl-button"
                    >
                      Lihat Rekap Keuangan
                    </Link>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 5: STEP 3 DEEP DIVE (Blue-to-Purple Gradient Stage - Screenshot 2)
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Text Column */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow" data-reveal="fade-up">Langkah 3 · Kelola Piutang</div>
                  <h2 className="wl-heading-h2" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' }}>
                    Pantau Pelanggan yang Belum{' '}
                    <span className="wl-serif-italic">Melunasi Pembayaran</span>
                  </h2>
                  <p className="wl-body-lead mb-0" data-reveal="fade-up" style={{ '--reveal-delay': '160ms' }}>
                    Lihat pelanggan yang belum melunasi pembayaran. Catat cicilan, pantau sisa
                    tagihan, dan ubah status menjadi Lunas saat sudah dibayar.
                  </p>

                  <ul className="wl-checkmarks-list" data-reveal="fade-up" style={{ '--reveal-delay': '240ms' }}>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Daftar piutang lengkap berisi nama pelanggan, tanggal pesan, jumlah tagihan,
                        sisa bayar, dan statusnya
                      </div>
                    </li>
                    <li>
                      <span className="wl-check-icon">
                        <Check size={13} weight="bold" />
                      </span>
                      <div>
                        Pengingat piutang langsung di dalam aplikasi dan tombol cepat untuk ubah
                        status dari <strong>Belum Lunas</strong> menjadi <strong>Lunas</strong>
                      </div>
                    </li>
                  </ul>

                  <div className="pt-2" data-reveal="fade-up" style={{ '--reveal-delay': '310ms' }}>
                    <Link
                      to={isAuthenticated ? '/piutang' : '/login'}
                      className="wl-button"
                    >
                      Lihat Daftar Piutang
                    </Link>
                  </div>
                </div>

                {/* Right Column: Blue-to-Purple Gradient Stage */}
                <div className="wl-step-gradient-stage variant-indigo" data-reveal="scale" style={{ '--reveal-delay': '120ms' }}>
                  {/* Top-Left Notification Cluster */}
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">{unpaidReceivablesCount}</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        Ada tagihan pelanggan yang perlu dicek!
                      </span>
                    </div>
                  </div>

                  {/* Curved Orange Loop Arrow SVG */}
                  <svg
                    className="wl-step-curved-arrow"
                    viewBox="0 0 90 130"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M 42 8 C 68 8, 72 34, 48 34 C 20 34, 6 68, 28 112"
                      stroke="#FA7249"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 18 106 L 29 114 L 32 100"
                      stroke="#FA7249"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Translucent Frosted Glass Frame */}
                  <div className="wl-step-glass-frame">
                    <div className="wl-step-glass-top-bubble d-flex flex-wrap align-items-center justify-content-between gap-2">
                      <div style={{ minWidth: 0, flex: '1 1 180px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Klik Baris Untuk Ubah Status
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171417' }}>
                          Sisa Piutang Contoh: Rp {unpaidReceivablesTotal.toLocaleString('id-ID')}
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

                    <div className="wl-step-glass-inner-card">
                      <div className="d-flex flex-column gap-2">
                        {demoReceivables.map((r, idx) => (
                          <div
                            key={r.id}
                            data-reveal="fade-up"
                            style={{ '--reveal-delay': `${180 + idx * 80}ms` }}
                          >
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleDemoReceivable(r.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  toggleDemoReceivable(r.id);
                                }
                              }}
                              className="p-2 px-3 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-2 wl-receivable-row"
                              style={{
                                backgroundColor: r.paid ? '#F8FAF9' : '#FAFAFA',
                                border: r.paid ? '1px solid var(--wl-success-60)' : '1px solid var(--wl-grey-20)',
                                cursor: 'pointer'
                              }}
                              title="Klik untuk mengubah status Lunas / Belum Lunas"
                            >
                              <div style={{ minWidth: 0, flex: '1 1 130px' }}>
                                <div className="fw-semibold" style={{ fontSize: '0.84rem', color: '#171417' }}>
                                  {r.name}
                                </div>
                                <div style={{ fontSize: '0.71rem', color: 'var(--wl-grey-60)' }}>{r.meta}</div>
                              </div>
                              <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
                                <span className="font-tabular fw-bold" style={{ fontSize: '0.84rem' }}>
                                  {r.amount}
                                </span>
                                <span
                                  className={
                                    r.paid
                                      ? 'wl-pill-badge wl-pill-badge-mint'
                                      : 'wl-pill-badge wl-pill-badge-peach'
                                  }
                                  style={{ transition: 'background-color 220ms ease, color 220ms ease' }}
                                >
                                  {r.paid ? 'Lunas' : 'Belum Lunas'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="wl-step-avatar-pointer" aria-hidden="true">
                      <Check size={20} weight="bold" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 6: BENEFIT SECTION (Blue-to-Purple Gradient Stage)
            ==================================================================== */}
        <section className="wl-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-grid-2">
                {/* Left Visual Composition inside Blue-to-Purple Gradient Stage */}
                <div className="wl-step-gradient-stage order-2 order-lg-1" data-reveal="scale" style={{ '--reveal-delay': '100ms' }}>
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">4</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        4 Manfaat Pakai RAJASH
                      </span>
                    </div>
                  </div>

                  <div className="wl-step-glass-frame" style={{ marginLeft: 0 }}>
                    <div className="d-flex flex-column gap-2">
                      {[
                        {
                          num: '01',
                          title: 'Mencegah catatan lupa atau ganda',
                          desc: 'Ada peringatan jika tanggal dan jumlah rupiah transaksi sama.',
                          badge: 'Rapi',
                          tone: 'blue'
                        },
                        {
                          num: '02',
                          title: 'Mengetahui keuntungan usaha lebih cepat',
                          desc: 'Otomatis dihitung dari uang masuk nyata dikurangi pengeluaran.',
                          badge: 'Otomatis',
                          tone: 'mint'
                        },
                        {
                          num: '03',
                          title: 'Tagihan kredit pelanggan tidak terlupa',
                          desc: 'Pesanan kredit dipantau terpisah sampai pelanggan melunasi.',
                          badge: 'Piutang',
                          tone: 'peach'
                        },
                        {
                          num: '04',
                          title: 'Rekap harian dan bulanan siap pakai',
                          desc: 'Laporan siap dilihat dan dicetak kapan saja dibutuhkan.',
                          badge: 'Praktis',
                          tone: 'blue'
                        }
                      ].map((b, idx) => (
                        <div
                          key={b.num}
                          data-reveal="fade-up"
                          style={{ '--reveal-delay': `${180 + idx * 85}ms` }}
                        >
                          <div
                            className="p-2 px-3 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-2 wl-benefit-card"
                            style={{
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 6px 16px rgba(12, 23, 84, 0.08)'
                            }}
                          >
                            <div className="d-flex align-items-center gap-2" style={{ minWidth: 0, flex: '1 1 180px' }}>
                              <span
                                className="font-tabular fw-bold d-inline-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--wl-brand-100)',
                                  color: '#FFFFFF',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {b.num}
                              </span>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#171417' }}>
                                  {b.title}
                                </div>
                                <div style={{ fontSize: '0.73rem', color: 'var(--wl-grey-80)' }}>
                                  {b.desc}
                                </div>
                              </div>
                            </div>
                            <span className={getBadgeClass(b.tone)}>{b.badge}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Editorial Copy */}
                <div className="d-flex flex-column align-items-start order-1 order-lg-2" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow" data-reveal="fade-up">Manfaat untuk Usaha Anda</div>
                  <h2 className="wl-heading-h2" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' }}>
                    Semua Catatan Keuangan dalam{' '}
                    <span className="wl-serif-italic">Satu Tempat</span>
                  </h2>
                  <p className="wl-body-lead mb-0" data-reveal="fade-up" style={{ '--reveal-delay': '160ms' }}>
                    Mencatat pemasukan dan pengeluaran setiap hari membantu pemilik depot air
                    mengetahui kondisi usahanya dengan pasti. Semua data penjualan, biaya armada, dan
                    piutang tersimpan rapi dalam satu aplikasi.
                  </p>
                  <p className="wl-body-lead mb-0" data-reveal="fade-up" style={{ '--reveal-delay': '230ms' }}>
                    Penjualan tunai langsung masuk kas. Pesanan kredit tetap tercatat sebagai
                    tagihan pelanggan. Rekap harian maupun bulanan bisa dicek dengan tenang.
                  </p>
                  <div className="pt-2" data-reveal="fade-up" style={{ '--reveal-delay': '300ms' }}>
                    <Link
                      to={isAuthenticated ? '/dashboard' : '/login'}
                      className="wl-button is-secondary"
                    >
                      Buka Aplikasi RAJASH
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
                {/* Left Column: Workleap Integrations Orbit Animation (#orbit-wrapper / .orbit-logo) */}
                <div ref={orbitColumnRef} className="wl-orbit-column" data-reveal="scale" style={{ '--reveal-delay': '80ms' }}>
                  <div ref={orbitWrapperRef} className="wl-orbit-wrapper" aria-label="Orbit kategori operasional RAJASH">
                    {/* Center Emblem (#center-logo-display) using official RAJASH Water Droplet & Financial Bars mark */}
                    <div className="wl-orbit-center-logo">
                      <RajashMark size={76} />
                    </div>

                    {ORBIT_NODES.map((node, idx) => {
                      const isActive = idx === activeOrbitIdx;
                      return (
                        <button
                          key={node.id}
                          ref={(el) => {
                            orbitNodeRefs.current[idx] = el;
                          }}
                          type="button"
                          title={`${node.label} — ${node.desc}`}
                          aria-label={node.label}
                          onClick={() => setActiveOrbitIdx(idx)}
                          onMouseEnter={() => setActiveOrbitIdx(idx)}
                          className={`wl-orbit-logo ${isActive ? 'is-active' : ''}`}
                        >
                          <div
                            ref={(el) => {
                              orbitGlyphRefs.current[idx] = el;
                            }}
                            className="wl-orbit-logo-glyph"
                          >
                            {node.renderGlyph()}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Eyebrow + H2 + Copy + Button */}
                <div className="d-flex flex-column align-items-start" style={{ gap: '1.25rem' }}>
                  <div className="wl-eyebrow" data-reveal="fade-up">Kategori Sesuai Kebiasaan Depot</div>
                  <h2 className="wl-heading-h2" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' }}>
                    Dibuat khusus untuk kegiatan harian{' '}
                    <span className="wl-serif-italic">depot air minum</span>
                  </h2>
                  <p className="wl-body-lead mb-0" data-reveal="fade-up" style={{ '--reveal-delay': '160ms' }}>
                    Tidak perlu paham istilah akuntansi yang rumit. Semua kategori di RAJASH memakai
                    nama kegiatan sehari-hari di depot, mulai dari beli pasokan air tangki, isi BBM
                    becak, hingga servis kendaraan pengantaran.
                  </p>
                  <div className="pt-2" data-reveal="fade-up" style={{ '--reveal-delay': '240ms' }}>
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
            SECTION 8: TESTIMONIALS / TRUST CAROUSEL (Exact match to Workleap .trust-carousel)
            ==================================================================== */}
        <section id="tentang-sistem" className="wl-section">
          <div id="modul" />
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <h2 className="wl-heading-h1" data-reveal="fade-up" style={{ maxWidth: '56rem' }}>
                Mencatat keuangan usaha sering masih pakai buku manual.{' '}
                <span className="wl-highlight">Kini tidak perlu lagi</span>.
              </h2>

              <div className="wl-spacer-large" />

              {/* Workleap 3-Column Swiper Carousel (.trust-carousel) */}
              <div className="wl-trust-carousel-grid" data-reveal="fade-in" style={{ '--reveal-delay': '100ms' }}>
                {visibleTestimonials.map((item, idx) => (
                  <div
                    key={`${item.id}-${testimonialSlideIdx}`}
                    className="wl-trust-card is-entering"
                    style={{ '--slide-delay': `${idx * 65}ms` }}
                  >
                    <div className="wl-trust-category-tag">{item.category}</div>

                    <div className="wl-trust-quote-row">
                      <div className="wl-trust-quote-mark" aria-hidden="true">
                        &ldquo;
                      </div>
                      <div className="wl-trust-quote-body">
                        <div className="wl-trust-quote-text">{item.quote}</div>
                        <div className="wl-trust-author-meta">
                          <div className="wl-trust-author-name">{item.author}</div>
                          <div className="wl-trust-author-role">{item.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom-Right Swiper Controls: Left Arrow + Circular Autoplay Progress + Right Arrow */}
              <div className="wl-trust-controls" data-reveal="fade-in" style={{ '--reveal-delay': '160ms' }}>
                <button
                  type="button"
                  onClick={handlePrevTestimonial}
                  className="wl-swiper-rounded-arrow is-left"
                  aria-label="Testimoni sebelumnya"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.3652 24.7688C16.6682 25.0771 17.1594 25.0771 17.4624 24.7688C17.7654 24.4605 17.7654 23.9606 17.4624 23.6523L14.649 20.7895H26.2241C26.6526 20.7895 27 20.436 27 20C27 19.564 26.6526 19.2105 26.2241 19.2105H14.649L17.4624 16.3477C17.7654 16.0394 17.7654 15.5395 17.4624 15.2312C17.1594 14.9229 16.6682 14.9229 16.3652 15.2312L12.2272 19.4418C12.0757 19.5959 12 19.798 12 20C12 20.107 12.0209 20.2091 12.0589 20.3022C12.0967 20.3953 12.1529 20.4826 12.2272 20.5582L16.3652 24.7688Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setTestimonialPlaying((prev) => !prev)}
                  className="wl-autoplay-progress"
                  aria-label={testimonialPlaying ? 'Jeda putar otomatis' : 'Mulai putar otomatis'}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19.2857" stroke="#E6E6E4" strokeWidth="1" />
                    <circle
                      cx="20"
                      cy="20"
                      r="19.2857"
                      stroke="#2545FF"
                      strokeWidth="2"
                      strokeDasharray="121.2"
                      strokeDashoffset={121.2 * (1 - testimonialProgress)}
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'center',
                        transition: 'stroke-dashoffset 50ms linear'
                      }}
                    />
                    {testimonialPlaying ? (
                      <g>
                        <path
                          d="M16 14V26"
                          stroke="#2545FF"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M24 14V26"
                          stroke="#2545FF"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    ) : (
                      <path
                        d="M17.5 14V26L26 20L17.5 14Z"
                        fill="#2545FF"
                        stroke="#2545FF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleNextTestimonial}
                  className="wl-swiper-rounded-arrow is-right"
                  aria-label="Testimoni berikutnya"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M23.6348 15.2312C23.3318 14.9229 22.8406 14.9229 22.5376 15.2312C22.2346 15.5395 22.2346 16.0394 22.5376 16.3477L25.351 19.2105H13.7759C13.3474 19.2105 13 19.564 13 20C13 20.436 13.3474 20.7895 13.7759 20.7895H25.351L22.5376 23.6523C22.2346 23.9606 22.2346 24.4605 22.5376 24.7688C22.8406 25.0771 23.3318 25.0771 23.6348 24.7688L27.7728 20.5582C27.9243 20.4041 28 20.202 28 20C28 19.893 27.9791 19.7909 27.9411 19.6978C27.9033 19.6047 27.8471 19.5174 27.7728 19.4418L23.6348 15.2312Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              <div className="wl-spacer-xxlarge" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 10: CLOSING CTA CARD (Mirrors Workleap Section 10 .lp-cta-section & .cta_card)
            ==================================================================== */}
        <section className="wl-section wl-cta-section">
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-cta-card" data-reveal="scale">
                {/* Multi-layered Flowing Wave Ribbons at Bottom (Matching Screenshot 3) */}
                <svg
                  className="wl-cta-waves-svg"
                  viewBox="0 0 1280 280"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="ctaWaveLeftWhite" x1="0%" y1="0%" x2="80%" y2="100%">
                      <stop offset="0%" stopColor="#94A8FF" stopOpacity="0.72" />
                      <stop offset="48%" stopColor="#5D73E8" stopOpacity="0.48" />
                      <stop offset="100%" stopColor="#141F6E" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="ctaWaveViolet" x1="20%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3D266E" stopOpacity="0.55" />
                      <stop offset="55%" stopColor="#4F2B68" stopOpacity="0.62" />
                      <stop offset="100%" stopColor="#28154A" stopOpacity="0.45" />
                    </linearGradient>
                    <linearGradient id="ctaWaveElectric" x1="0%" y1="100%" x2="100%" y2="20%">
                      <stop offset="0%" stopColor="#122499" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#2545FF" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#091352" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  {/* Warm plum/violet diagonal ribbon sweeping up to the right */}
                  <path
                    d="M 380 280 C 620 225, 920 120, 1280 18 L 1280 280 Z"
                    fill="url(#ctaWaveViolet)"
                  />
                  {/* Soft periwinkle/white wave sweeping from bottom-left */}
                  <path
                    d="M 0 38 C 165 55, 315 165, 560 225 C 760 272, 960 275, 1180 280 L 0 280 Z"
                    fill="url(#ctaWaveLeftWhite)"
                  />
                  {/* Deep cobalt lower wave */}
                  <path
                    d="M 0 195 C 240 190, 460 245, 740 280 L 0 280 Z"
                    fill="rgba(16, 33, 148, 0.72)"
                  />
                  {/* Bright electric blue wave rising on the bottom-right */}
                  <path
                    d="M 740 280 C 910 215, 1085 155, 1280 135 L 1280 280 Z"
                    fill="url(#ctaWaveElectric)"
                  />
                </svg>

                <div data-reveal="fade-up" style={{ maxWidth: '54rem', position: 'relative', zIndex: 2, '--reveal-delay': '120ms' }}>
                  <h2 className="wl-heading-h0" style={{ color: '#FFFFFF' }}>
                    Mulai kelola keuangan usaha{' '}
                    <span className="wl-highlight-inverted" style={{ textDecoration: 'none', fontStyle: 'italic' }}>
                      dengan lebih teratur
                    </span>
                    .
                  </h2>
                  <p
                    className="mt-3 mb-0 mx-auto"
                    style={{
                      maxWidth: '38rem',
                      fontSize: 'clamp(0.95rem, 0.9rem + 0.25vw, 1.08rem)',
                      lineHeight: 1.55,
                      color: 'rgba(255, 255, 255, 0.84)'
                    }}
                  >
                    Semua catatan pemasukan, pengeluaran, dan tagihan pelanggan dalam satu tempat.
                  </p>
                </div>

                <div className="wl-button-group justify-content-center" data-reveal="fade-up" style={{ position: 'relative', zIndex: 2, '--reveal-delay': '220ms' }}>
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
                  <div className="wl-eyebrow" data-reveal="fade-up">Pertanyaan Umum (FAQ)</div>
                  <h3 className="wl-heading-h3" data-reveal="fade-up" style={{ '--reveal-delay': '90ms' }}>
                    <span
                      className="wl-serif-italic"
                      style={{ fontSize: '1.32em', display: 'block', marginBottom: '0.1em' }}
                    >
                      Semua
                    </span>{' '}
                    yang perlu Anda ketahui tentang cara memakai RAJASH
                  </h3>
                </div>

                {/* Right Column: Minimalist Horizontal Divider Accordion */}
                <div>
                  <Accordion items={FAQ_ITEMS} defaultOpenIndex={0} animateItems={true} />
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
