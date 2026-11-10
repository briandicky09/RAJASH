# DOKUMEN KOORDINASI KONTRAK REST API (FRONTEND & BACKEND)
## Sistem Pengelolaan Keuangan dan Piutang UMKM RAJASH (A26-CS148)

- **Frontend Developer:** Brian Dicky Vanka Andaraneva (React.js + Bootstrap 5)
- **Backend Developer:** Reinald Oryza Apriancahya (Laravel + PHP + MySQL)
- **Base URL Default:** `http://localhost:8000/api` (dapat dikonfigurasi melalui `VITE_API_BASE_URL` pada file `.env`)
- **Format Pertukaran Data:** JSON (`Accept: application/json`, `Content-Type: application/json`)
- **Mekanisme Autentikasi:** Bearer Token (Laravel Sanctum) pada header `Authorization: Bearer <token>`

---

## 1. Autentikasi Pengguna (FR-01)

### 1.1 Login Owner
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
```json
{
  "username": "owner.rajash",
  "email": "owner.rajash",
  "password": "password_rahasia"
}
```
- **Response 200 OK:**
```json
{
  "message": "Login berhasil",
  "data": {
    "token": "1|laravel_sanctum_token_string",
    "user": {
      "id": 1,
      "name": "Dedy Darmansyah",
      "username": "owner.rajash",
      "email": "dedy@rajash-depot.id",
      "role": "Owner UMKM RAJASH"
    }
  }
}
```

### 1.2 Logout Owner
- **Endpoint:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response 200 OK:**
```json
{
  "message": "Berhasil keluar dari sesi."
}
```

---

## 2. Dashboard Keuangan (FR-02 & FR-08)

- **Endpoint:** `GET /api/dashboard`
- **Query Params:**
  - `period_type`: `monthly` | `all`
  - `month`: `YYYY-MM` (contoh: `2026-11`)
- **Response 200 OK:**
```json
{
  "data": {
    "summary": {
      "cashSales": 558000,
      "creditSales": 660000,
      "totalSalesTransaction": 1218000,
      "receivablePaymentsReceived": 450000,
      "actualCashReceived": 1008000,
      "totalExpenses": 430000,
      "netCashProfit": 578000,
      "netTransactionProfit": 788000,
      "totalUnpaidReceivables": 450000,
      "activeReceivablesCount": 4,
      "incomeCount": 9,
      "expenseCount": 5
    },
    "recentTransactions": [],
    "outstandingReceivables": [],
    "allActiveReceivables": [],
    "chartSeries": [
      {
        "date": "2026-11-10",
        "cashIn": 162000,
        "creditSales": 150000,
        "totalSales": 312000,
        "expense": 35000
      }
    ]
  }
}
```

---

## 3. Pencatatan Pemasukan & Validasi Duplikasi (FR-03 & FR-06)

### 3.1 Daftar Riwayat Pemasukan
- **Endpoint:** `GET /api/incomes`
- **Query Params:** `start_date`, `end_date`, `payment_method` (`Tunai` | `Kredit`), `search`

### 3.2 Pemeriksaan Potensi Transaksi Ganda (FR-06)
- **Endpoint:** `POST /api/incomes/check-duplicate`
- **Request Body:**
```json
{
  "date": "2026-11-10",
  "customer_name": "Warkop Kupi Khop Ulee Kareng",
  "amount": 90000,
  "payment_method": "Tunai"
}
```
- **Response 200 OK:**
```json
{
  "data": {
    "isDuplicate": true,
    "matches": [
      {
        "id": "INC-20261110-01",
        "date": "2026-11-10",
        "customer_name": "Warkop Kupi Khop Ulee Kareng",
        "amount": 90000,
        "payment_method": "Tunai"
      }
    ]
  }
}
```

### 3.3 Tambah Transaksi Pemasukan
- **Endpoint:** `POST /api/incomes`
- **Request Body:**
```json
{
  "date": "2026-11-10",
  "customer_name": "RM Kari Kambing Pak Hasan",
  "amount": 150000,
  "payment_method": "Kredit",
  "description": "Pemesanan WhatsApp 25 galon isi ulang"
}
```
- **Catatan Logika Bisnis Backend:** Apabila `payment_method === "Kredit"`, backend otomatis membuat entitas piutang (`receivables`) baru dengan `status = "Belum Lunas"` dan `remaining_amount = amount`.

---

## 4. Pencatatan Pengeluaran Operasional (FR-04)

- **Endpoint Daftar:** `GET /api/expenses` (`start_date`, `end_date`, `category`, `search`)
- **Endpoint Tambah:** `POST /api/expenses`
  - Kategori wajib salah satu dari: `BBM Becak`, `Servis Kendaraan`, `Penggantian Oli`, `Perbaikan Ban`, `Pembelian Pasokan Air`, `Lainnya`.
- **Endpoint Hapus:** `DELETE /api/expenses/{id}`

---

## 5. Pengelolaan Piutang & Pembayaran Bertahap/Penuh (FR-05)

### 5.1 Daftar Piutang Pelanggan
- **Endpoint:** `GET /api/receivables`
- **Query Params:** `status` (`Belum Lunas` | `Lunas`), `start_date`, `end_date`, `search`

### 5.2 Catat Pembayaran Piutang
- **Endpoint:** `POST /api/receivables/{id}/payments`
- **Request Body:**
```json
{
  "amount": 100000,
  "payment_date": "2026-11-10",
  "note": "Pembayaran cicilan pertama"
}
```
- **Aturan Validasi Backend:**
  - `amount > 0` dan `amount <= remaining_amount`
  - Jika `remaining_amount - amount == 0`, status berubah menjadi `"Lunas"`.

---

## 6. Rekapitulasi Keuangan Harian & Bulanan (FR-07)

- **Endpoint:** `GET /api/recapitulation`
- **Query Params:**
  - `period_type`: `daily` | `monthly`
  - `date`: `YYYY-MM-DD` (saat `period_type = daily`)
  - `month`: `YYYY-MM` (saat `period_type = monthly`)
- **Prinsip Perhitungan:**
  - Memisahkan `cashSales` (Penjualan Tunai), `creditSales` (Penjualan Kredit / Piutang Baru), dan `receivablePaymentsReceived` (Pembayaran Piutang yang Diterima).
  - `actualCashReceived = cashSales + receivablePaymentsReceived`
  - `netCashProfit = actualCashReceived - totalExpenses`
  - `netTransactionProfit = (cashSales + creditSales) - totalExpenses`

