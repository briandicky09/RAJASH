/**
 * DATA SIMULASI DEMO - Sistem Pengelolaan Keuangan & Piutang UMKM RAJASH
 * Disesuaikan penuh dengan Dokumen PRD & SRS Capstone Asah 2026 (Tim A26-CS148)
 */

export const INITIAL_WATER_TYPES = [
  { id: 'Mineral', label: 'Air Mineral', defaultPrice: 6000 },
  { id: 'RO', label: 'Air RO (Reverse Osmosis)', defaultPrice: 7000 }
];

export const WATER_TYPES = INITIAL_WATER_TYPES;

export const INITIAL_EXPENSE_CATEGORIES = [
  'BBM Becak',
  'Servis Kendaraan',
  'Penggantian Oli',
  'Perbaikan Ban',
  'Pembelian Pasokan Air',
  'Lainnya'
];

export const EXPENSE_CATEGORIES = INITIAL_EXPENSE_CATEGORIES;

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-01',
    name: 'Warkop Kupi Khop Ulee Kareng',
    note: 'Langganan pengantaran becak pagi (rata-rata 15 galon)',
    created_at: '2026-08-25'
  },
  {
    id: 'CUST-02',
    name: 'Rumah Makan Kari Kambing Pak Hasan',
    note: 'Pemesanan rutin via WhatsApp, pembayaran tempo mingguan',
    created_at: '2026-08-28'
  },
  {
    id: 'CUST-03',
    name: 'Asrama Mahasiswa Darussalam',
    note: 'Langganan mingguan 30 galon air mineral',
    created_at: '2026-09-02'
  },
  {
    id: 'CUST-04',
    name: 'Kedai Mie Aceh Simpang Tujuh',
    note: 'Pembayaran tunai saat pengantaran',
    created_at: '2026-09-05'
  },
  {
    id: 'CUST-05',
    name: 'Katering Ibu Cut Meutia',
    note: 'Pesanan galon RO untuk kebutuhan katering dan acara',
    created_at: '2026-09-10'
  },
  {
    id: 'CUST-06',
    name: 'Kost Putri Krueng Cut',
    note: 'Pengantaran becak sore',
    created_at: '2026-09-14'
  },
  {
    id: 'CUST-07',
    name: 'Toko Kelontong Bang Joni',
    note: 'Mitra titipan galon isi ulang',
    created_at: '2026-09-20'
  },
  {
    id: 'CUST-08',
    name: 'Dayah Mini Al-Ikhlas Pango',
    note: 'Langganan bulanan 40 galon',
    created_at: '2026-09-25'
  }
];

export const INITIAL_SYSTEM_SETTINGS = {
  reminder_hour: '21:00',
  duplicate_window_minutes: 5
};

export const DEMO_OWNER_ACCOUNT = {
  id: 1,
  name: 'Dedy Darmansyah',
  username: 'owner.rajash',
  email: 'dedy@rajash-depot.id',
  role: 'Owner UMKM RAJASH',
  location: 'Jln. Lamreung No. 16, Simpang Tujoeh, Ulee Kareng, Banda Aceh',
  is_demo: true
};

export const INITIAL_DEMO_INCOMES = [
  {
    id: 'INC-20261110-01',
    date: '2026-11-10',
    customer_name: 'Warkop Kupi Khop Ulee Kareng',
    water_type: 'Air Mineral',
    quantity: 15,
    unit_price: 6000,
    amount: 90000,
    payment_method: 'Tunai',
    status: 'Lunas',
    description: 'Pengantaran 15 galon isi ulang via becak pagi',
    data_source: 'Input Aplikasi',
    created_at: '2026-11-10T08:30:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261110-02',
    date: '2026-11-10',
    customer_name: 'Rumah Makan Kari Kambing Pak Hasan',
    water_type: 'Air Mineral',
    quantity: 25,
    unit_price: 6000,
    amount: 150000,
    payment_method: 'Kredit',
    status: 'Piutang',
    receivable_id: 'RCV-20261110-01',
    description: 'Pemesanan WhatsApp 25 galon isi ulang',
    data_source: 'Input Aplikasi',
    created_at: '2026-11-10T09:45:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261110-03',
    date: '2026-11-10',
    customer_name: 'Pelanggan Depot Langsung',
    water_type: 'Air RO',
    quantity: 12,
    unit_price: 7000,
    amount: 84000,
    payment_method: 'Tunai',
    status: 'Lunas',
    description: 'Penjualan langsung di depot (12 galon air RO eceran)',
    data_source: 'Input Aplikasi',
    created_at: '2026-11-10T11:15:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261109-01',
    date: '2026-11-09',
    customer_name: 'Asrama Mahasiswa Darussalam',
    water_type: 'Air Mineral',
    quantity: 30,
    unit_price: 6000,
    amount: 180000,
    payment_method: 'Kredit',
    status: 'Piutang',
    receivable_id: 'RCV-20261109-01',
    description: 'Langganan mingguan 30 galon air minum',
    data_source: 'Data Sintetis',
    created_at: '2026-11-09T14:20:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261109-02',
    date: '2026-11-09',
    customer_name: 'Kedai Mie Aceh Simpang Tujuh',
    water_type: 'Air Mineral',
    quantity: 20,
    unit_price: 6000,
    amount: 120000,
    payment_method: 'Tunai',
    status: 'Lunas',
    description: 'Pengisian 20 galon reguler',
    data_source: 'Data Sintetis',
    created_at: '2026-11-09T16:10:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261108-01',
    date: '2026-11-08',
    customer_name: 'Katering Ibu Cut Meutia',
    water_type: 'Air RO',
    quantity: 30,
    unit_price: 7000,
    amount: 210000,
    payment_method: 'Kredit',
    status: 'Piutang',
    receivable_id: 'RCV-20261108-01',
    description: 'Pemesanan 30 galon air RO untuk acara kenduri',
    data_source: 'Data Sintetis',
    created_at: '2026-11-08T10:00:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261108-02',
    date: '2026-11-08',
    customer_name: 'Pelanggan Depot Langsung',
    water_type: 'Air Mineral',
    quantity: 28,
    unit_price: 6000,
    amount: 168000,
    payment_method: 'Tunai',
    status: 'Lunas',
    description: 'Rekap penjualan galon tunai di depot (28 galon)',
    data_source: 'Data Sintetis',
    created_at: '2026-11-08T17:30:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261107-01',
    date: '2026-11-07',
    customer_name: 'Kost Putri Krueng Cut',
    water_type: 'Air Mineral',
    quantity: 18,
    unit_price: 6000,
    amount: 108000,
    payment_method: 'Tunai',
    status: 'Lunas',
    description: 'Pengantaran 18 galon via becak sore',
    data_source: 'Data Sintetis',
    created_at: '2026-11-07T15:40:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261106-01',
    date: '2026-11-06',
    customer_name: 'Toko Kelontong Bang Joni',
    water_type: 'Air Mineral',
    quantity: 20,
    unit_price: 6000,
    amount: 120000,
    payment_method: 'Kredit',
    status: 'Lunas',
    receivable_id: 'RCV-20261106-01',
    description: 'Stok titipan 20 galon isi ulang',
    data_source: 'Data Sintetis',
    created_at: '2026-11-06T09:15:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261022-01',
    date: '2026-10-22',
    customer_name: 'Dayah Mini Al-Ikhlas Pango',
    water_type: 'Air Mineral',
    quantity: 40,
    unit_price: 6000,
    amount: 240000,
    payment_method: 'Kredit',
    status: 'Piutang',
    receivable_id: 'RCV-20261022-01',
    description: 'Pengantaran rutin 40 galon buku besar Oktober',
    data_source: 'Data Historis Riil',
    created_at: '2026-10-22T13:00:00+07:00',
    is_demo: true
  },
  {
    id: 'INC-20261020-01',
    date: '2026-10-20',
    customer_name: 'Warkop Solong Mini Ulee Kareng',
    water_type: 'Air Mineral',
    quantity: 32,
    unit_price: 6000,
    amount: 192000,
    payment_method: 'Tunai',
    status: 'Lunas',
    description: 'Penjualan 32 galon tunai (catatan buku besar)',
    data_source: 'Data Historis Riil',
    created_at: '2026-10-20T11:00:00+07:00',
    is_demo: true
  }
];

export const INITIAL_DEMO_EXPENSES = [
  {
    id: 'EXP-20261110-01',
    date: '2026-11-10',
    category: 'BBM Becak',
    description: 'Pengisian Pertalite becak pengantar pagi & siang',
    amount: 35000,
    data_source: 'Input Aplikasi',
    created_at: '2026-11-10T07:50:00+07:00',
    is_demo: true
  },
  {
    id: 'EXP-20261109-01',
    date: '2026-11-09',
    category: 'Pembelian Pasokan Air',
    description: 'Pengisian tangki utama air baku pegunungan (1 tangki)',
    amount: 250000,
    data_source: 'Data Sintetis',
    created_at: '2026-11-09T08:15:00+07:00',
    is_demo: true
  },
  {
    id: 'EXP-20261108-01',
    date: '2026-11-08',
    category: 'Penggantian Oli',
    description: 'Ganti oli mesin becak operasional bulanan',
    amount: 55000,
    data_source: 'Data Sintetis',
    created_at: '2026-11-08T16:20:00+07:00',
    is_demo: true
  },
  {
    id: 'EXP-20261107-01',
    date: '2026-11-07',
    category: 'Perbaikan Ban',
    description: 'Tambal ban dalam dan ganti pentil becak pengantar',
    amount: 25000,
    data_source: 'Data Sintetis',
    created_at: '2026-11-07T13:10:00+07:00',
    is_demo: true
  },
  {
    id: 'EXP-20261106-01',
    date: '2026-11-06',
    category: 'Lainnya',
    description: 'Pembelian tutup galon segel dan tisu antiseptik (500 pcs)',
    amount: 65000,
    data_source: 'Data Sintetis',
    created_at: '2026-11-06T10:30:00+07:00',
    is_demo: true
  },
  {
    id: 'EXP-20261021-01',
    date: '2026-10-21',
    category: 'Servis Kendaraan',
    description: 'Servis karburator dan rantai becak pengantar',
    amount: 95000,
    data_source: 'Data Historis Riil',
    created_at: '2026-10-21T14:00:00+07:00',
    is_demo: true
  }
];

export const INITIAL_DEMO_RECEIVABLES = [
  {
    id: 'RCV-20261110-01',
    income_id: 'INC-20261110-02',
    customer_name: 'Rumah Makan Kari Kambing Pak Hasan',
    transaction_date: '2026-11-10',
    description: 'Pemesanan WhatsApp 25 galon isi ulang',
    total_amount: 150000,
    paid_amount: 0,
    remaining_amount: 150000,
    status: 'Belum Lunas',
    payments: [],
    is_demo: true
  },
  {
    id: 'RCV-20261109-01',
    income_id: 'INC-20261109-01',
    customer_name: 'Asrama Mahasiswa Darussalam',
    transaction_date: '2026-11-09',
    description: 'Langganan mingguan 30 galon air minum',
    total_amount: 180000,
    paid_amount: 80000,
    remaining_amount: 100000,
    status: 'Belum Lunas',
    payments: [
      {
        id: 'PAY-20261109-01',
        date: '2026-11-09',
        amount: 80000,
        note: 'Titipan pembayaran awal saat pengantaran'
      }
    ],
    is_demo: true
  },
  {
    id: 'RCV-20261108-01',
    income_id: 'INC-20261108-01',
    customer_name: 'Katering Ibu Cut Meutia',
    transaction_date: '2026-11-08',
    description: 'Pemesanan 30 galon air RO untuk acara kenduri',
    total_amount: 210000,
    paid_amount: 100000,
    remaining_amount: 110000,
    status: 'Belum Lunas',
    payments: [
      {
        id: 'PAY-20261108-01',
        date: '2026-11-08',
        amount: 100000,
        note: 'DP tunai pembayaran tahap pertama'
      }
    ],
    is_demo: true
  },
  {
    id: 'RCV-20261022-01',
    income_id: 'INC-20261022-01',
    customer_name: 'Dayah Mini Al-Ikhlas Pango',
    transaction_date: '2026-10-22',
    description: 'Pengantaran rutin 40 galon buku besar Oktober',
    total_amount: 240000,
    paid_amount: 150000,
    remaining_amount: 90000,
    status: 'Belum Lunas',
    payments: [
      {
        id: 'PAY-20261102-01',
        date: '2026-11-02',
        amount: 150000,
        note: 'Pembayaran cicilan pertama ke depot'
      }
    ],
    is_demo: true
  },
  {
    id: 'RCV-20261106-01',
    income_id: 'INC-20261106-01',
    customer_name: 'Toko Kelontong Bang Joni',
    transaction_date: '2026-11-06',
    description: 'Stok titipan 20 galon isi ulang',
    total_amount: 120000,
    paid_amount: 120000,
    remaining_amount: 0,
    status: 'Lunas',
    payments: [
      {
        id: 'PAY-20261107-01',
        date: '2026-11-07',
        amount: 120000,
        note: 'Pelunasan penuh saat pengambilan galon kosong'
      }
    ],
    is_demo: true
  }
];

export const DEMO_AI_INSIGHT = {
  forecast: {
    target: 'Proyeksi Pemasukan Harian Besok (11 Nov 2026)',
    predicted_amount: 260000,
    predicted_transactions: 4,
    confidence_score: '88.4%',
    model_name: 'Linear Regression / LightGBM Benchmark (FastAPI Service)',
    disclaimer: 'Hasil proyeksi merupakan estimasi bantuan analisis Capstone AI, bukan angka pembukuan resmi.'
  },
  summary_text:
    'Berdasarkan pola transaksi 7 hari terakhir: Arus kas masuk stabil dengan rata-rata harian Rp250.000. Biaya operasional terbesar berasal dari Pembelian Pasokan Air Tangki Utama (Rp250.000) dan BBM Becak Pengantar. Terdapat 4 tagihan piutang aktif senilai Rp450.000 dengan tagihan tertua dari Dayah Mini Al-Ikhlas (22 Oktober 2026) yang disarankan untuk ditindaklanjuti sebelum akhir pekan.',
  recommendations: [
    'Pastikan stok air tangki utama diperiksa kembali mengingat volume pengantaran meningkat pada hari Jumat.',
    'Lakukan evaluasi piutang aktif menjelang pukul 21.00 atau 22.00 WIB sebelum tutup operasional depot.',
    'Pertahankan pencatatan jenis air Mineral dan RO agar kalkulasi margin keuntungan per produk tetap akurat.'
  ]
};
