# Sistem Pengelolaan Keuangan dan Piutang UMKM RAJASH (Frontend)

Aplikasi web modern berbasis **React.js** dan **Bootstrap 5** untuk membantu pencatatan pemasukan, pengeluaran operasional, pengelolaan piutang, dan rekapitulasi keuangan **Depot Air Minum Isi Ulang RAJASH** (Ulee Kareng, Banda Aceh).

- **Program:** Asah 2026 - Dicoding x GoTo
- **ID Tim:** A26-CS148
- **Frontend Engineer / UI/UX:** Brian Dicky Vanka Andaraneva
- **Backend Engineer:** Reinald Oryza Apriancahya (Laravel + PHP + MySQL)

---

## 1. Panduan Menjalankan Project

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm versi 9 atau lebih baru

### Langkah Instalasi & Menjalankan Mode Pengembangan
1. Buka terminal di direktori project:
   ```bash
   cd c:\Users\Thinkpad\Downloads\RAJASH
   ```
2. Jalankan perintah instalasi dependensi (jika belum dilakukan):
   ```bash
   npm install
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
4. Buka tautan yang muncul pada terminal (biasanya `http://localhost:5173`) melalui browser Anda.

### Perintah Build Produksi
Untuk memastikan kompilasi bundle frontend bersih:
```bash
npm run build
```

---

## 2. Kredensial Pengujian (Mode Simulasi Demo)

Secara default, saat server backend Laravel belum dijalankan di port `8000`, frontend otomatis beroperasi dalam **Mode Simulasi Data Demo** dengan persistensi di peramban:

- **Username / Email:** `owner.rajash` atau `dedy@rajash-depot.id`
- **Password:** `rajash2026`
- **Fitur Khusus:** Pada halaman login terdapat tombol *"Isi Kredensial Demo"* untuk mempermudah demonstrasi.
- **Reset Data Demo:** Anda dapat mereset data simulasi kapan saja melalui tombol *Data Demo* pada bilah header aplikasi.

---

## 3. Menghubungkan ke Backend Laravel

1. Buat file `.env` di root direktori project:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
2. Pastikan server Laravel sedang berjalan:
   ```bash
   php artisan serve
   ```
3. Buka [API_CONTRACT.md](API_CONTRACT.md) untuk melihat spesifikasi detail endpoint REST API, parameter JSON, dan aturan validasi bisnis.

---

## 4. Struktur Direktori Frontend

```
c:\Users\Thinkpad\Downloads\RAJASH\
├── public/                 # Favicon dan aset statis
├── src/
│   ├── components/
│   │   ├── common/         # SummaryCard, DataTable, CurrencyInput, Modal, dll.
│   │   └── layout/         # AppSidebar, AppHeader, PageContainer, ProtectedShell
│   ├── context/            # AuthContext dan ToastContext
│   ├── mocks/              # Data simulasi demo terisolasi (demoData.js)
│   ├── pages/              # Landing, Login, Dashboard, Pemasukan, Pengeluaran, Piutang, Rekapitulasi
│   ├── services/           # apiClient.js & financeService.js
│   ├── styles/             # design-system.css (Bootstrap 5 & token desain)
│   ├── utils/              # formatters.js (Rupiah, tanggal Indonesia, ribuan)
│   ├── App.jsx             # Routing & layout guard
│   └── main.jsx            # Entry point React
├── API_CONTRACT.md         # Dokumentasi kontrak koordinasi REST API
└── package.json
```
