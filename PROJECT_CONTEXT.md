# PROJECT CONTEXT — Sistem Pengelolaan Keuangan & Piutang UMKM RAJASH

Dokumen ini merangkum seluruh konteks proyek **RAJASH (Frontend)** secara menyeluruh sebagai acuan teknis, bisnis, dan desain bagi developer, tim capstone, maupun AI assistant yang melanjutkan pengembangan.

---

## 1. Identitas Proyek & Profil UMKM

| Informasi | Detail |
|---|---|
| **Nama Aplikasi** | Sistem Pengelolaan Keuangan dan Piutang UMKM RAJASH |
| **Program** | Asah 2026 – Dicoding x GoTo |
| **ID Tim** | `A26-CS148` |
| **Mitra UMKM** | Depot Air Minum Isi Ulang **RAJASH** (beroperasi sejak 2016) |
| **Lokasi UMKM** | Jln. Lamreung No. 16, Simpang Tujoeh, Ulee Kareng, Banda Aceh |
| **PIC / Pengguna Utama** | **Dedy Darmansyah** (Owner UMKM RAJASH) |
| **Repositori GitHub** | `briandicky09/RAJASH` |
| **Dokumen Referensi** | [PRD.md](PRD.md), [API_CONTRACT.md](API_CONTRACT.md), [README.md](README.md) |

### Pembagian Tanggung Jawab Tim (sesuai PRD)
- **Brian Dicky Vanka Andaraneva:** Frontend Engineer & UI/UX (React.js, Bootstrap 5, antarmuka responsif, validasi, integrasi REST API).
- **Reinald Oryza Apriancahya:** Backend Engineer (Laravel, PHP, MySQL, autentikasi Sanctum, logika transaksi, REST API).
- **Meutia Shafira Ramadhani & Aqilla Resya Luthfiya:** Pengolahan & analisis data historis serta pengembangan *data science*.
- **Putri Hanin Tsabitah & Rayyan Rabbani Basith:** Pengembangan kebutuhan *Next-Gen AI Engineer* (prediksi & *Generative AI insight*).

---

## 2. Latar Belakang Bisnis & Ruang Lingkup MVP

### Permasalahan Utama
Sebelumnya pembukuan depot RAJASH dilakukan secara manual menggunakan buku besar, yang menimbulkan risiko transaksi terlewat, tercatat ganda (duplikat), perhitungan pemasukan/pengeluaran/keuntungan bersih yang memakan waktu, serta sulitnya memantau tagihan kredit pelanggan yang belum lunas.

### Kebutuhan Fungsional Inti (MVP)
- **FR-01 – Autentikasi Pemilik:** Login pemilik usaha (username/email + password) dan proteksi halaman internal.
- **FR-02 – Dashboard Keuangan:** Ringkasan total pemasukan kas aktual, total pengeluaran, keuntungan bersih, total piutang aktif, grafik keuangan, daftar transaksi terbaru, serta ringkasan hari ini.
- **FR-03 – Pencatatan Pemasukan:** Penjualan air minum isi ulang dengan pilihan jenis air (**Air Mineral** & **Air RO**), kuantitas, harga satuan, nominal otomatis, metode pembayaran **Tunai** atau **Kredit**, nama pelanggan, dan keterangan.
- **FR-04 – Pencatatan Pengeluaran:** Dokumentasi biaya operasional rutin menggunakan **6 kategori baku**:
  1. `BBM Becak`
  2. `Servis Kendaraan`
  3. `Penggantian Oli`
  4. `Perbaikan Ban`
  5. `Pembelian Pasokan Air`
  6. `Lainnya`
- **FR-05 – Pengelolaan Piutang:** Daftar piutang pelanggan beserta status (`Belum Lunas` / `Lunas`), sisa tagihan, riwayat pembayaran bertahap maupun lunas sekaligus, dan detail tagihan.
- **FR-06 – Validasi Potensi Duplikasi Transaksi:** Pemeriksaan kemiripan transaksi pada pemasukan (`POST /api/incomes/check-duplicate`) dan pengeluaran sebelum disimpan, dengan dialog konfirmasi agar pengguna tidak kehilangan kontrol.
- **FR-07 – Rekapitulasi Keuangan:** Rekap harian & bulanan, rincian penjualan per jenis air (Air Mineral vs Air RO), tab buku besar, serta dukungan cetak laporan.
- **FR-08 – Pengingat Piutang di Aplikasi:** Kartu pengingat (`ReceivableReminderCard`) pada Dashboard dan halaman Piutang untuk menindaklanjuti tagihan yang belum lunas.

### Di Luar Ruang Lingkup MVP
Manajemen stok galon fisik, penjadwalan/rute kurir, WhatsApp Gateway/notifikasi eksternal, payment gateway/QRIS/perbankan, penggajian/absensi karyawan, pelaporan pajak/akuntansi formal, alamat pribadi pelanggan, integrasi perangkat keras mesin depot, dan portal pemesanan mandiri pelanggan.

---

## 3. Tech Stack & Perintah Pengembangan

Dari `package.json`:
- **Framework Frontend:** React `^18.3.1` (`react`, `react-dom`)
- **Build Tool:** Vite `^5.4.11` + `@vitejs/plugin-react` `^4.3.3` (server lokal pada port `5173`, `host: true`)
- **Routing:** `react-router-dom` `^6.28.0`
- **UI & Styling:** `bootstrap` `^5.3.3` + custom design system (`src/styles/design-system.css`)
- **Ikon:** `@phosphor-icons/react` `^2.1.7`

### Skrip NPM
```bash
npm install      # Instalasi dependensi
npm run dev      # Menjalankan Vite dev server (http://localhost:5173)
npm run build    # Build bundle produksi ke folder dist/
npm run preview  # Pratinjau hasil build produksi
```

### Konfigurasi Lingkungan (`.env`)
Sesuai `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 4. Struktur Direktori Proyek

```text
c:\Users\Thinkpad\Downloads\RAJASH\
├── public/
│   ├── bg-waves.avif                 # Latar gelombang biru bertekstur untuk Hero + Cara Kerja
│   ├── cta-background.avif           # Latar gelombang gelap-biru untuk Closing CTA Card
│   └── favicon.svg                   # App icon tile RAJASH (#002A54) untuk tab browser
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Accordion.jsx         # Komponen akordeon FAQ
│   │   │   ├── AIInsightCard.jsx     # Kartu insight AI operasional
│   │   │   ├── ConfirmationDialog.jsx# Dialog konfirmasi (hapus / duplikasi transaksi)
│   │   │   ├── CurrencyInput.jsx     # Input nominal Rupiah terformat titik ribuan
│   │   │   ├── DataTable.jsx         # Tabel data responsif dengan sorting/kolom fleksibel
│   │   │   ├── DateFilter.jsx        # Filter rentang tanggal mulai & akhir
│   │   │   ├── EmptyState.jsx        # Tampilan data kosong
│   │   │   ├── ErrorState.jsx        # Tampilan pesan error + tombol muat ulang
│   │   │   ├── FilterDropdown.jsx    # Dropdown filter kategori/metode/status
│   │   │   ├── FinancialBarChart.jsx # Grafik batang pemasukan vs pengeluaran
│   │   │   ├── FormInput.jsx         # Komponen input form terstandardisasi
│   │   │   ├── LoadingState.jsx      # Indikator loading
│   │   │   ├── Modal.jsx             # Modal dialog reusable
│   │   │   ├── Pagination.jsx        # Navigasi halaman tabel
│   │   │   ├── ReceivableReminderCard.jsx # Kartu pengingat piutang belum lunas
│   │   │   ├── SearchInput.jsx       # Pencarian transaksi/pelanggan
│   │   │   ├── StatusBadge.jsx       # Badge status (Lunas, Belum Lunas, Tunai, Kredit)
│   │   │   └── SummaryCard.jsx       # Kartu metrik KPI ringkasan keuangan
│   │   └── layout/
│   │       ├── AppHeader.jsx         # Header internal + penanda status API/Data Demo
│   │       ├── AppSidebar.jsx        # Sidebar navigasi aplikasi + tombol logout
│   │       ├── BrandLogo.jsx         # Komponen logo resmi (RajashMark & RajashWordmark)
│   │       ├── LandingFooter.jsx     # Footer Landing Page
│   │       ├── LandingNavbar.jsx     # Navbar sticky Landing Page + mobile drawer
│   │       ├── PageContainer.jsx     # Pembungkus konten halaman internal (judul, aksi)
│   │       └── ProtectedShell.jsx    # Guard autentikasi + shell layout + modal status API/reset demo
│   ├── context/
│   │   ├── AuthContext.jsx           # State autentikasi user, token, & status backend
│   │   └── ToastContext.jsx          # Sistem notifikasi toast global
│   ├── mocks/
│   │   └── demoData.js               # Data simulasi demo awal (air, kategori, pelanggan, transaksi)
│   ├── pages/
│   │   ├── LandingPage.jsx           # Halaman utama publik (replikasi struktur Workleap Officevibe)
│   │   ├── LoginPage.jsx             # Halaman login owner + tombol "Isi Kredensial Demo"
│   │   ├── DashboardPage.jsx         # Ringkasan keuangan utama (/dashboard)
│   │   ├── IncomePage.jsx            # Pengelolaan pemasukan tunai/kredit & cek duplikat (/pemasukan)
│   │   ├── ExpensePage.jsx           # Pengelolaan pengeluaran 6 kategori & cek duplikat (/pengeluaran)
│   │   ├── ReceivablePage.jsx        # Pemantauan piutang & input pembayaran cicilan/lunas (/piutang)
│   │   ├── RecapitulationPage.jsx    # Rekapitulasi harian/bulanan, breakdown air, cetak (/rekapitulasi)
│   │   └── NotFoundPage.jsx          # Halaman 404 dengan RajashMark
│   ├── services/
│   │   ├── apiClient.js              # Fetch wrapper, Bearer token, timeout 5 detik, handler 401/422
│   │   └── financeService.js         # Service layer API + fallback otomatis ke localStorage demo
│   ├── styles/
│   │   └── design-system.css         # Token desain, tipografi, komponen Landing & App Shell
│   ├── utils/
│   │   └── formatters.js             # formatRupiah, formatThousandDigits, parseRupiahInput, formatTanggalIndonesia
│   ├── App.jsx                       # Konfigurasi React Router & ProtectedShell
│   └── main.jsx                      # Entry point (import Bootstrap 5 & design-system.css)
├── API_CONTRACT.md
├── PRD.md
├── README.md
├── index.html                        # Memuat Plus Jakarta Sans & JetBrains Mono dari Google Fonts
├── package.json
└── vite.config.js
```

---

## 5. Routing, Autentikasi & Mode Simulasi Demo

### Peta Rute (`src/App.jsx`)
- **Publik:**
  - `/` → `LandingPage`
  - `/login` → `LoginPage`
- **Terproteksi (`ProtectedShell` — redirect ke `/login` jika belum login):**
  - `/dashboard` → `DashboardPage` (`Dashboard Keuangan`)
  - `/pemasukan` → `IncomePage` (`Pencatatan Pemasukan`)
  - `/pengeluaran` → `ExpensePage` (`Pencatatan Pengeluaran`)
  - `/piutang` → `ReceivablePage` (`Pengelolaan Piutang Pelanggan`)
  - `/rekapitulasi` → `RecapitulationPage` (`Rekapitulasi Keuangan`)
- **Fallback:** `*` → `NotFoundPage`

### Mekanisme Autentikasi & Fallback Backend
1. `apiClient.js` membaca `VITE_API_BASE_URL` (default `http://localhost:8000/api`) dan menyimpan kredensial pada `localStorage` dengan key `rajash_auth_token`, `rajash_auth_user`, dan `rajash_data_mode` (`auto` | `demo` | `live`).
2. Setiap request memakai timeout 5000 ms, menyisipkan header `Authorization: Bearer <token>`, melempar `ApiError` terstruktur pada status `401` (memicu event `rajash:unauthorized`) dan `422` (mengekstrak `errors` validasi Laravel).
3. Apabila server backend Laravel belum aktif, `financeService.js` secara terkontrol beralih ke **Mode Simulasi Data Demo** menggunakan `localStorage` (`rajash_demo_incomes_v2`, `rajash_demo_expenses_v2`, `rajash_demo_receivables_v2`) dan memancarkan event `rajash:backend-status`.
4. **Kredensial Demo:** Username/Email `owner.rajash` atau `dedy@rajash-depot.id`, Password `rajash2026`. Data demo dapat di-reset melalui tombol *Data Demo* di `AppHeader` (memicu `rajash:data-reset`).

---

## 6. Aturan Bisnis & Formula Keuangan (`calculateFinancialSummary`)

Diimplementasikan secara konsisten di `src/services/financeService.js` agar selaras dengan backend Laravel (`API_CONTRACT.md`):
- **Jenis Air (`INITIAL_WATER_TYPES`):** `Air Mineral` (harga default `Rp6.000`) dan `Air RO (Reverse Osmosis)` (harga default `Rp7.000`).
- **Pemisahan Penjualan Tunai vs Kredit:**
  - `cashSales` = jumlah pemasukan dengan `payment_method === 'Tunai'`.
  - `creditSales` = jumlah pemasukan dengan `payment_method === 'Kredit'` (otomatis menghasilkan catatan piutang `Belum Lunas`).
  - `totalSalesTransaction` = `cashSales + creditSales`.
- **Pembayaran Piutang & Arus Kas Aktual:**
  - `receivablePaymentsReceived` = total cicilan/pelunasan piutang yang dibayarkan pada periode terpilih.
  - `actualCashReceived` = `cashSales + receivablePaymentsReceived`.
- **Perhitungan Laba Bersih:**
  - `netCashProfit` (Laba Bersih Kas) = `actualCashReceived - totalExpenses`.
  - `netTransactionProfit` = `totalSalesTransaction - totalExpenses`.
- **Piutang Aktif:**
  - Hanya piutang dengan `status === 'Belum Lunas'` dan `remaining_amount > 0`.
  - Pembayaran harus `> 0` dan `<= remaining_amount`; jika sisa mencapai `0`, status otomatis menjadi `Lunas`.

---

## 7. Design System & Identitas Visual

Desain antarmuka mereplikasi struktur visual dan ritme tata letak **Workleap Officevibe** dengan identitas warna dan aset milik **RAJASH**:

### Palet Warna Utama (`src/styles/design-system.css`)
- **Primary Brand Blue:** `--wl-brand-100: #2545FF`, Hover `--wl-brand-hover: #1D30EC`, Deep `--wl-brand-deep: #00248F`, Navy `--wl-boardroom-navy: #0C1754`
- **Surfaces:** White `#FFFFFF`, Soft Warm Cream `--wl-soft-20: #F9F8F6`, Soft Beige `#F0E9E1`, Card Gray `#FAFAFA`, Blue Tint `#DBF3FF`, Periwinkle `#C8D0FF`, Lilac `#D9D4FF`
- **Neutral Text:** `--wl-grey-100: #171417`, `--wl-grey-80: #484747`, `--wl-grey-60: #676665`, Border `--wl-grey-20: #E6E6E4`
- **Status Semantik:** Success (`#E1F5EB` / `#166638`), Warning (`#FFF1CC` / `#8B4A04`), Danger (`#FFE7D7` / `#9D3107`), Info (`#DBF3FF` / `#00248F`)

### Tipografi
- **100% Unified Display & Body Font:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` (seluruh heading, body copy, button, label, navbar, footer).
- **Tabular Numbers:** `'JetBrains Mono'` khusus pada `.font-tabular`, `.currency-value`, dan `.table td[data-numeric="true"]`.

### Identitas Logo Resmi (`src/components/layout/BrandLogo.jsx`)
- **`RajashMark`:** Simbol vektor tetesan air + 3 diagram batang meningkat berwarna Deep Navy `#002A54`, Royal Blue `#0082DA`, dan Aqua Cyan `#43BDD4`. Mendukung prop `inverted` (putih pada footer gelap) dan `tile` (kotak melengkung `#002A54` untuk *app icon badge* dan `public/favicon.svg`).
- **`RajashWordmark`:** Tipografi SVG geometris bertuliskan `RAJASH` (huruf `A` chevron tanpa palang horizontal, serta lengkungan terbuka pada `R`, `J`, dan `S`).
- Dipakai secara konsisten di `LandingNavbar`, `LandingFooter`, `AppSidebar`, `LoginPage`, `NotFoundPage`, pusat orbit kategori, dan *app notification tiles* di `LandingPage`.

---

## 8. Struktur Lengkap Landing Page (`src/pages/LandingPage.jsx`)

Seluruh halaman depan dibangun mengikuti komposisi Workleap Officevibe dengan konten spesifik RAJASH:

1. **Navbar (`LandingNavbar`):** Sticky header dengan `BrandLogo`, menu horizontal 1 baris (*Produk*, *Cara Kerja*, *Tentang Kami*, *Kategori*, *FAQ*), tautan `Log in`, pill `Pelajari Fitur`, tombol `Mulai Sekarang` / `Dashboard`, serta *drawer* mobile.
2. **Wrapper Gelombang Biru (`.wl-bg-waves`):** Menggunakan `public/bg-waves.avif` yang membalut Section 1 (Hero) sekaligus Section 2 (Cara Kerja Sistem).
3. **Section 1 – Hero (`#beranda`):** 2 kolom — sebelah kiri berisi eyebrow, H1 *"Kelola keuangan usaha dengan lebih mudah, kini terpusat di RAJASH"*, lead copy, tombol CTA, dan *marquee* 8 fitur utama; sebelah kanan berisi kartu sinyal interaktif melayang dengan 3 tombol pengalih (*Sinyal Piutang*, *Sinyal Kas Bersih*, *Sinyal Beban Depot*).
4. **Section 2 – Cara Kerja Sistem (`#cara-kerja`):** Kontainer kartu krem dengan 3 kolom langkah (*Pencatatan lebih terstruktur*, *Pemantauan piutang lebih mudah*, *Rekap keuangan lebih praktis*).
5. **Section 3 – Tahap 1 (`#fitur`):** Penjelasan pencatatan transaksi tunai & kredit di atas panggung gradasi biru-ungu bertekstur (`.wl-step-gradient-stage`) dengan toggle interaktif **Tunai / Kredit**.
6. **Section 4 – Tahap 2:** Penjelasan perhitungan keuntungan bersih & rekapitulasi, dilengkapi grafik batang 7 hari interaktif.
7. **Section 5 – Tahap 3:** Penjelasan manajemen piutang & pengingat tagihan, dilengkapi daftar piutang simulasi yang dapat diklik untuk mengubah status *Belum Lunas* ↔ *Lunas*.
8. **Section 6 – Manfaat Utama:** 4 manfaat pembukuan terpusat RAJASH dalam bingkai kaca buram (*frosted glass*).
9. **Section 7 – Struktur Kategori Operasional (Animasi Orbit):**
   - Menggunakan animasi `requestAnimationFrame` (`PERIOD = 45500ms`, `SIZE_MAX = 108px`, `SIZE_MIN = 23px`, kurva `easeSize`) yang menampilkan pola bulan sabit (*crescent*) identik dengan Workleap.
   - Pusat orbit menampilkan `<RajashMark size={76} />` tanpa kotak pembungkus.
   - Dikelilingi 10 ikon kategori operasional & keuangan RAJASH (`Biaya Lainnya`, `Pembelian Pasokan Air`, `Penggantian Oli`, `Pemasukan Kas Tunai`, `Pengingat Tagihan`, `Perbaikan Ban`, `Rekapitulasi Keuangan`, `Piutang Pelanggan`, `BBM Becak`, `Servis Kendaraan`).
10. **Section 8 – Testimoni Carousel (`#tentang-sistem` / `#modul`):**
    - H1 *"Pembukuan usaha hari ini sering mengandalkan buku manual. Seharusnya tidak."*
    - 3 kolom sejajar dengan pembatas vertikal tipis, **tanpa logo RAJASH** pada kartu (menggunakan label kategori teks `.wl-trust-category-tag` dan tanda kutip biru).
    - Kontrol navigasi kanan bawah: tombol panah kiri, tombol Play/Pause dengan cincin progres melingkar (autoplay 5,5 detik), dan tombol panah kanan.
11. **Section 10 – Closing CTA Card:** Kartu gelap berlatar `public/cta-background.avif` dan gelombang SVG berlapis.
12. **Section 11 – FAQ (`#faq`):** 2 kolom dengan komponen `Accordion` berisi 6 pertanyaan umum tentang RAJASH.
13. **Footer (`LandingFooter`):** Latar `#0C1754` dengan logo *inverted*, kotak akses sistem, kolom *Modul Produk*, *Kapabilitas*, dan *Identitas Usaha*.

---

## 9. Status Terkini & Catatan Pengembangan Lanjutan

- **Status Build:** Build produksi frontend (`npm run build`) terverifikasi bersih (`exit code 0`).
- **Yang Sudah Selesai:** Seluruh halaman MVP (`LandingPage`, `LoginPage`, `DashboardPage`, `IncomePage`, `ExpensePage`, `ReceivablePage`, `RecapitulationPage`, `NotFoundPage`), `AuthContext`, `ToastContext`, service layer dengan fallback demo, identitas logo resmi RAJASH, tipografi seragam `Plus Jakarta Sans`, dan seluruh penyesuaian visual Landing Page sesuai referensi Workleap Officevibe.
- **Langkah Selanjutnya (Jika Melanjutkan Integrasi / Pengembangan):**
  1. Menjalankan backend Laravel dan menyetel `VITE_API_BASE_URL` di `.env` untuk menguji seluruh endpoint pada `API_CONTRACT.md` tanpa fallback demo.
  2. Menghubungkan `AIInsightCard.jsx` dengan endpoint model prediksi & Generative AI apabila tim AI/Data Science telah merilis API produksi.
  3. Menjaga sinkronisasi commit & push ke repositori GitHub `briandicky09/RAJASH` setelah setiap perubahan.

