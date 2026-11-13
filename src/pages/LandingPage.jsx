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
    id: 'lainnya',
    label: 'Biaya Lainnya',
    desc: 'Kebutuhan pendukung depot seperti tutup galon, tisu, dan listrik.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Notion-style isometric tilted cube */}
        <g transform="rotate(-7 24 24)">
          <rect x="9" y="9" width="30" height="30" rx="6" fill="#FFFFFF" stroke="#2F2F2F" strokeWidth="2.8" />
          <path d="M9 15H39" stroke="#2F2F2F" strokeWidth="2.2" />
          <path d="M18 21V33L29 21V33" stroke="#2F2F2F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'pasokan-air',
    label: 'Pembelian Pasokan Air',
    desc: 'Pembelian pasokan air baku tangki untuk kebutuhan isi ulang depot.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Workday-style orange sun arc over blue wave mark */}
        <path d="M13 22C15.5 15.5 21 12 24 12C27 12 32.5 15.5 35 22" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M12 27L16.5 36L24 26L31.5 36L36 27" stroke="#2563EB" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'ganti-oli',
    label: 'Penggantian Oli',
    desc: 'Penggantian oli berkala agar armada becak pengantaran tetap prima.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rotational geometric knot */}
        <circle cx="24" cy="24" r="13" stroke="#0F766E" strokeWidth="3.2" strokeDasharray="10 5" />
        <circle cx="24" cy="24" r="6" fill="#14B8A6" />
      </svg>
    )
  },
  {
    id: 'kas-tunai',
    label: 'Pemasukan Kas Tunai',
    desc: 'Pemasukan penjualan galon tunai yang langsung berstatus Lunas.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Emerald green organic leaf & stem mark */}
        <path d="M16 35C16 24 23 14 34 13C34 24 27 33 16 35Z" fill="#65A30D" />
        <path d="M16 35C14 27 17 19 24 15" stroke="#84CC16" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="16" cy="35" r="2.5" fill="#4D7C0F" />
      </svg>
    )
  },
  {
    id: 'pengingat',
    label: 'Pengingat Tagihan',
    desc: 'Peringatan otomatis di dalam aplikasi untuk piutang yang belum lunas.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Terracotta sunburst / spark */}
        <path d="M24 9V39M9 24H39M13.4 13.4L34.6 34.6M34.6 13.4L13.4 34.6" stroke="#D97757" strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="24" cy="24" r="4.5" fill="#D97757" />
      </svg>
    )
  },
  {
    id: 'perbaikan-ban',
    label: 'Perbaikan Ban',
    desc: 'Pengeluaran tambal atau ganti ban kendaraan pengantaran galon.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* UKG-style teal smile arc with dual dots */}
        <circle cx="18.5" cy="17.5" r="2.6" fill="#0D9488" />
        <circle cx="29.5" cy="17.5" r="2.6" fill="#0D9488" />
        <path d="M14.5 24C14.5 29.8 18.7 34 24 34C29.3 34 33.5 29.8 33.5 24" stroke="#0D9488" strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'rekapitulasi',
    label: 'Rekapitulasi Keuangan',
    desc: 'Laporan ringkasan pemasukan, pengeluaran, piutang, dan kas bersih.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Jira-style triple cascading blue chevrons */}
        <path d="M24 11H35V22L24 11Z" fill="#2563EB" />
        <path d="M18.5 18.5H29.5V29.5L18.5 18.5Z" fill="#3B82F6" />
        <path d="M13 26H24V37L13 26Z" fill="#60A5FA" />
      </svg>
    )
  },
  {
    id: 'piutang-kredit',
    label: 'Piutang Pelanggan',
    desc: 'Penjualan galon kredit pelanggan yang dipantau hingga berstatus Lunas.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Teams-style purple/indigo people & badge */}
        <circle cx="29" cy="15" r="4.2" fill="#7C83EB" />
        <circle cx="21" cy="13.5" r="5" fill="#5059C9" />
        <rect x="23" y="21" width="15" height="14" rx="4" fill="#7C83EB" />
        <rect x="15" y="20" width="16" height="17" rx="4.5" fill="#4B53BC" />
        <rect x="9" y="18" width="15" height="15" rx="3.8" fill="#3B429F" />
        <path d="M13.5 22.5H19.5M16.5 22.5V28.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'bbm-becak',
    label: 'BBM Becak',
    desc: 'Pencatatan biaya bahan bakar becak pengantaran galon harian.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* HiBob-style vibrant coral-red speech tile */}
        <path d="M10 16C10 11.5817 13.5817 8 18 8H30C34.4183 8 38 11.5817 38 16V28C38 32.4183 34.4183 36 30 36H26L21 41V36H18C13.5817 36 10 32.4183 10 28V16Z" fill="#E11D48" />
        <path d="M17 17V27M24 17V27M17 22H24" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30.5 20.5V27" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="30.5" cy="16.2" r="1.9" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: 'servis-becak',
    label: 'Servis Kendaraan',
    desc: 'Biaya perawatan rutin mesin kendaraan operasional pengantaran.',
    renderGlyph: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Slack-style 4-color pinwheel (cyan, emerald, rose, amber) */}
        <rect x="18" y="9" width="5" height="12" rx="2.5" fill="#36C5F0" />
        <circle cx="14" cy="18.5" r="2.5" fill="#36C5F0" />
        <rect x="27" y="18" width="12" height="5" rx="2.5" fill="#2EB67D" />
        <circle cx="29.5" cy="14" r="2.5" fill="#2EB67D" />
        <rect x="25" y="27" width="5" height="12" rx="2.5" fill="#E01E5A" />
        <circle cx="34" cy="29.5" r="2.5" fill="#E01E5A" />
        <rect x="9" y="25" width="12" height="5" rx="2.5" fill="#ECB22E" />
        <circle cx="18.5" cy="34" r="2.5" fill="#ECB22E" />
      </svg>
    )
  }
];

const TRUST_TESTIMONIALS = [
  {
    id: 't1',
    category: 'Visibilitas Keuangan',
    quote:
      'Tanpa pencatatan terpusat, pemasukan tunai dan tagihan kredit sulit dipisahkan. Kini beralih dari buku catatan manual menuju visibilitas keuangan yang nyata.”',
    author: 'Dedy Darmansyah',
    role: 'Pemilik Usaha (Owner) Depot Air Minum'
  },
  {
    id: 't2',
    category: 'Manajemen Piutang',
    quote:
      'Sangat membantu dalam memantau pelanggan yang membeli secara kredit dan mengetahui tagihan mana yang masih berstatus Belum Lunas maupun yang sudah Lunas.”',
    author: 'Operasional Pengantaran',
    role: 'Pemantauan Piutang & Tagihan Pelanggan'
  },
  {
    id: 't3',
    category: 'Rekapitulasi Kas',
    quote:
      'Begitu mulai mencatat rutin, perhitungan keuntungan bersih harian dan bulanan menjadi jauh lebih praktis karena seluruh kategori beban depot langsung terdata rapi.”',
    author: 'Evaluasi Keuangan Harian',
    role: 'Rekapitulasi Pemasukan & Pengeluaran Depot'
  },
  {
    id: 't4',
    category: 'Validasi Transaksi',
    quote:
      'Peringatan transaksi duplikat membantu mencegah kesalahan pencatatan ganda pada tanggal dan nominal yang sama, sehingga buku kas depot tetap akurat.”',
    author: 'Kontrol Kualitas Data',
    role: 'Perlindungan Catatan Transaksi Harian'
  },
  {
    id: 't5',
    category: 'Beban Operasional',
    quote:
      'Seluruh pengeluaran mulai dari pembelian pasokan air, BBM becak, servis kendaraan, ganti oli, hingga perbaikan ban tercatat sesuai aktivitas nyata depot.”',
    author: 'Operasional Armada & Depot',
    role: 'Struktur 6 Kategori Beban Operasional'
  },
  {
    id: 't6',
    category: 'Akses Multi-Perangkat',
    quote:
      'Dirancang khusus mengikuti alur kerja nyata UMKM depot air minum isi ulang agar pemilik usaha dapat memeriksa arus kas dan piutang dari perangkat apa saja.”',
    author: 'Tim Capstone A26-CS148',
    role: 'Pengembang Sistem Pengelolaan Keuangan'
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
  const [activeOrbitIdx, setActiveOrbitIdx] = useState(8);
  const [testimonialSlideIdx, setTestimonialSlideIdx] = useState(0);
  const [testimonialPlaying, setTestimonialPlaying] = useState(true);
  const [testimonialProgress, setTestimonialProgress] = useState(0);
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

      const r = Math.min(R_PCT * Math.min(window.innerWidth, window.innerHeight), R_MAX);
      const cx = 170;
      const cy = 170;

      orbitNodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const angle = startAngles[i] + (elapsed / PERIOD) * Math.PI * 2;

        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        const t = easeSize(angle % (Math.PI * 2));
        const size = SIZE_MIN + (SIZE_MAX - SIZE_MIN) * t;
        const imgSize = IMG_MIN + (IMG_MAX - IMG_MIN) * t;

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
    <div style={{ backgroundColor: 'var(--wl-true-white)', minHeight: '100dvh' }}>
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
            Wrapped inside .wl-bg-waves (Matching Workleap Officevibe Blueprint)
            ==================================================================== */}
        <section id="cara-kerja" className="wl-section wl-how-it-works-section">
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

                {/* 3-Column Illustrated Step Cards (Matching Screenshot 1 Visuals) */}
                <div className="wl-grid-3 text-center">
                  {/* Card 1: Circular Gauge + Trend Curve (Mirrors "Engagement 7.5 VERY GOOD") */}
                  <div className="d-flex flex-column align-items-center">
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
                        <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '68px', height: '68px' }}>
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
                            TERSTRUKTUR
                          </span>
                        </div>
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Pencatatan lebih terstruktur</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Catat pemasukan tunai, penjualan kredit, dan 6 kategori pengeluaran depot.
                    </p>
                  </div>

                  {/* Card 2: Floating Signal Card + Top-Right Notification Tile (Mirrors "Growth signal") */}
                  <div className="d-flex flex-column align-items-center">
                    <div className="wl-how-step-visual">
                      <div className="position-relative" style={{ width: '100%', maxWidth: '285px' }}>
                        {/* Top-Right Floating Notification Tile */}
                        <div
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
                              Sinyal Piutang
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--wl-grey-80)', lineHeight: 1.45, marginBottom: '0.55rem' }}>
                            Terdapat 4 tagihan kredit pelanggan senilai Rp 505.000 belum lunas.
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2545FF' }}>
                            Periksa piutang &rarr;
                          </div>
                        </div>
                      </div>
                    </div>
                    <h5 className="wl-heading-h5">Pemantauan piutang lebih mudah</h5>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.88rem', color: 'var(--wl-grey-80)' }}>
                      Ketahui pelanggan yang masih berutang dan perbarui status saat lunas.
                    </p>
                  </div>

                  {/* Card 3: Sparkle Header + 3 Staggered Checklist Pills (Mirrors "Act with an AI coach") */}
                  <div className="d-flex flex-column align-items-center">
                    <div className="wl-how-step-visual">
                      <div className="d-flex flex-column gap-2 w-100" style={{ maxWidth: '290px' }}>
                        <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                          <Sparkle size={15} weight="fill" style={{ color: '#2545FF' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#171417' }}>
                            Rekapitulasi telah siap.
                          </span>
                        </div>

                        {[
                          { text: 'Pemasukan kas tunai telah direkap.', offset: '0px' },
                          { text: 'Laba bersih Rp 1.085.000 terhitung.', offset: '-10px', bold: true },
                          { text: 'Laporan harian & bulanan siap cetak.', offset: '8px' }
                        ].map((item) => (
                          <div
                            key={item.text}
                            className="d-flex align-items-center gap-2 py-2 px-3"
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

                {/* Right Column: Blue-to-Purple Gradient Stage (Matching Screenshot 2) */}
                <div className="wl-step-gradient-stage">
                  {/* Top-Left Notification Tile + Overlapping Banner */}
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">1</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        Waktunya catat transaksi harian!
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
                          Formulir Pencatatan Terpusat
                        </div>
                        <div style={{ fontSize: '0.96rem', fontWeight: 600, color: '#171417' }}>
                          Pilih jenis pembayaran &amp; kategori beban operasional:
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
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="d-inline-flex align-items-center justify-content-center"
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
                          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--wl-grey-80)' }}>
                            Status Otomatis: {step1PaymentType === 'Tunai' ? 'Lunas (Kas)' : 'Belum Lunas (Piutang)'}
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
                        <div className="d-flex align-items-center justify-content-between pt-2" style={{ borderTop: '1px solid #ECECE9', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--wl-grey-80)' }}>{activeExpenseCat.sample}</span>
                          <strong className="font-tabular" style={{ color: '#171417' }}>{activeExpenseCat.nominal}</strong>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <span style={{ fontSize: '0.74rem', color: '#D9532F', fontWeight: 500 }}>
                          &#9888; Deteksi transaksi duplikat aktif
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
                <div className="wl-step-gradient-stage variant-purple order-2 order-lg-1">
                  {/* Top-Left Notification Cluster */}
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">7</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        Laba Bersih ({activeTrendDay.label}): +{activeTrendDay.netVal}
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
                    <div className="wl-step-glass-top-bubble d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Rekapitulasi Arus Kas Bersih
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171417' }}>
                          Keuntungan Bersih = Kas Masuk Aktual - Pengeluaran
                        </div>
                      </div>
                      <span className="wl-pill-badge wl-pill-badge-mint font-tabular">Rp 1.085.000</span>
                    </div>

                    <div className="wl-step-glass-inner-card">
                      <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.78rem' }}>
                        <span className="fw-semibold" style={{ color: '#171417' }}>
                          Klik Grafik Harian ({activeTrendDay.label} 2026)
                        </span>
                        <span className="font-tabular" style={{ color: 'var(--wl-brand-100)', fontWeight: 600 }}>
                          Masuk: {activeTrendDay.inVal} · Beban: {activeTrendDay.outVal}
                        </span>
                      </div>

                      <div
                        className="d-flex align-items-end justify-content-between gap-2 p-3 rounded-3"
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
                                cursor: 'pointer',
                                borderRadius: '8px',
                                backgroundColor: isSelected ? 'rgba(37, 69, 255, 0.09)' : 'transparent',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-end gap-1 w-100 justify-content-center h-100">
                                <div
                                  style={{
                                    width: '9px',
                                    height: d.inH,
                                    backgroundColor: isSelected ? 'var(--wl-brand-100)' : '#7C92FF',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.25s ease'
                                  }}
                                />
                                <div
                                  style={{
                                    width: '9px',
                                    height: d.outH,
                                    backgroundColor: isSelected ? '#FA7249' : '#CBD5E1',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.25s ease'
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
            SECTION 5: STEP 3 DEEP DIVE (Blue-to-Purple Gradient Stage - Screenshot 2)
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

                {/* Right Column: Blue-to-Purple Gradient Stage */}
                <div className="wl-step-gradient-stage variant-indigo">
                  {/* Top-Left Notification Cluster */}
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">{unpaidReceivablesCount}</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        Waktunya tindak lanjuti piutang!
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
                    <div className="wl-step-glass-top-bubble d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--wl-grey-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Klik Baris Untuk Ubah Status
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171417' }}>
                          Sisa Piutang Simulasi: Rp {unpaidReceivablesTotal.toLocaleString('id-ID')}
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
                            className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between gap-2"
                            style={{
                              backgroundColor: r.paid ? '#F8FAF9' : '#FAFAFA',
                              border: r.paid ? '1px solid var(--wl-success-60)' : '1px solid var(--wl-grey-20)',
                              cursor: 'pointer',
                              transition: 'all 0.22s ease'
                            }}
                            title="Klik untuk mengubah status Lunas / Belum Lunas"
                          >
                            <div>
                              <div className="fw-semibold" style={{ fontSize: '0.84rem', color: '#171417' }}>
                                {r.name}
                              </div>
                              <div style={{ fontSize: '0.71rem', color: 'var(--wl-grey-60)' }}>{r.meta}</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span className="font-tabular fw-bold" style={{ fontSize: '0.84rem' }}>
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
                <div className="wl-step-gradient-stage order-2 order-lg-1">
                  <div className="wl-step-notif-cluster">
                    <div className="wl-step-app-tile">
                      <span className="wl-step-notif-dot">4</span>
                      <RajashMark size={34} />
                    </div>
                    <div className="wl-step-notif-banner">
                      <RajashMark size={30} tile={true} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171417' }}>
                        4 Manfaat Utama Sistem RAJASH
                      </span>
                    </div>
                  </div>

                  <div className="wl-step-glass-frame" style={{ marginLeft: 0 }}>
                    <div className="d-flex flex-column gap-2">
                      {[
                        {
                          num: '01',
                          title: 'Mengurangi risiko pencatatan terlewat atau ganda',
                          desc: 'Deteksi kemiripan transaksi pada tanggal dan nominal yang sama.',
                          badge: 'Terstruktur',
                          tone: 'blue'
                        },
                        {
                          num: '02',
                          title: 'Mempermudah perhitungan keuntungan bersih',
                          desc: 'Otomatis dihitung dari kas masuk aktual dikurangi pengeluaran.',
                          badge: 'Otomatis',
                          tone: 'mint'
                        },
                        {
                          num: '03',
                          title: 'Membantu memantau transaksi kredit pelanggan',
                          desc: 'Tagihan kredit dipantau terpisah hingga pelanggan melunasinya.',
                          badge: 'Piutang',
                          tone: 'peach'
                        },
                        {
                          num: '04',
                          title: 'Mempercepat pembuatan rekap harian dan bulanan',
                          desc: 'Laporan siap dilihat, dicetak, atau diekspor kapan saja.',
                          badge: 'Praktis',
                          tone: 'blue'
                        }
                      ].map((b) => (
                        <div
                          key={b.num}
                          className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between gap-2"
                          style={{
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 6px 16px rgba(12, 23, 84, 0.08)'
                          }}
                        >
                          <div className="d-flex align-items-center gap-2">
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
                            <div>
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
                      ))}
                    </div>
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
                {/* Left Column: Workleap Integrations Orbit Animation (#orbit-wrapper / .orbit-logo) */}
                <div className="wl-orbit-column">
                  <div className="wl-orbit-wrapper" aria-label="Orbit kategori operasional RAJASH">
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
            SECTION 8: TESTIMONIALS / TRUST CAROUSEL (Exact match to Workleap .trust-carousel)
            ==================================================================== */}
        <section id="tentang-sistem" className="wl-section">
          <div id="modul" />
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <h2 className="wl-heading-h1" style={{ maxWidth: '56rem' }}>
                Pembukuan usaha hari ini sering mengandalkan buku manual.{' '}
                <span className="wl-highlight">Seharusnya tidak</span>.
              </h2>

              <div className="wl-spacer-large" />

              {/* Workleap 3-Column Swiper Carousel (.trust-carousel) */}
              <div className="wl-trust-carousel-grid">
                {visibleTestimonials.map((item) => (
                  <div key={item.id} className="wl-trust-card">
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
              <div className="wl-trust-controls">
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
        <section className="wl-section" style={{ paddingBottom: '3.75rem' }}>
          <div className="wl-padding-global">
            <div className="wl-container">
              <div className="wl-spacer-xxlarge" />

              <div className="wl-cta-card">
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

                <div style={{ maxWidth: '54rem', position: 'relative', zIndex: 2 }}>
                  <h2 className="wl-heading-h0" style={{ color: '#FFFFFF' }}>
                    Mulai Kelola Keuangan Usaha{' '}
                    <span className="wl-highlight-inverted" style={{ textDecoration: 'none', fontStyle: 'italic' }}>
                      dengan Lebih Teratur
                    </span>
                    .
                  </h2>
                </div>

                <div className="wl-button-group justify-content-center" style={{ position: 'relative', zIndex: 2 }}>
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
