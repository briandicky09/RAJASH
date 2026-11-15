<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Expense;
use App\Models\ImportError;
use App\Models\Income;
use App\Models\Receivable;

echo "=== AUDIT VERIFIKASI DATASET DI MYSQL ===" . PHP_EOL;

// 1. 21 transaksi Kupon dengan volume positif dan nominal Rp0
$kuponRp0 = Income::where('raw_customer_name', 'Kupon')
    ->where('amount', 0)
    ->where(function($q) {
        $q->where('ro_quantity', '>', 0)->orWhere('bs_quantity', '>', 0);
    })->count();
printf("1. Kupon Volume Positif Nominal Rp0 : %d transaksi (Expected: 21) -> %s\n",
    $kuponRp0, ($kuponRp0 === 21 ? 'PASS' : 'FAIL'));

// 2. 194 baris pemasukan tanpa transaksi dilewati
$pemSkipped = ImportError::where('sheet_name', 'Pemasukan')->where('status', 'skipped')->count();
printf("2. Pemasukan Tanpa Transaksi Dilewati: %d baris (Expected: 194) -> %s\n",
    $pemSkipped, ($pemSkipped === 194 ? 'PASS' : 'FAIL'));

// 3. 211 pengeluaran sintetis tersimpan
$expSyn = Expense::where('data_source', 'synthetic')->count();
printf("3. Pengeluaran Sintetis Tersimpan    : %d transaksi (Expected: 211) -> %s\n",
    $expSyn, ($expSyn === 211 ? 'PASS' : 'FAIL'));

// 4. 88 pengeluaran aktual tersimpan
$expReal = Expense::where('data_source', 'real')->count();
printf("4. Pengeluaran Aktual Tersimpan      : %d transaksi (Expected: 88) -> %s\n",
    $expReal, ($expReal === 88 ? 'PASS' : 'FAIL'));

// 5. 68 transaksi kredit membentuk piutang
$rcvSyn = Receivable::where('data_source', 'synthetic')->count();
$incCreditSyn = Income::where('data_source', 'synthetic')->where('payment_method', 'Kredit')->count();
printf("5. Transaksi Kredit Membentuk Piutang: %d piutang dari %d kredit tx (Expected: 68) -> %s\n",
    $rcvSyn, $incCreditSyn, ($rcvSyn === 68 && $incCreditSyn === 68 ? 'PASS' : 'FAIL'));

// 6. Nilai RO dan BS desimal tidak mengalami pembulatan
$roDecimalCount = Income::where('data_source', 'synthetic')
    ->whereRaw('ro_quantity != FLOOR(ro_quantity)')->count();
$bsDecimalCount = Income::where('data_source', 'synthetic')
    ->whereRaw('bs_quantity != FLOOR(bs_quantity)')->count();
printf("6. Presisi Desimal Kuantitas         : RO desimal=%d (Exp: 7), BS desimal=%d (Exp: 30) -> %s\n",
    $roDecimalCount, $bsDecimalCount, ($roDecimalCount === 7 && $bsDecimalCount === 30 ? 'PASS' : 'FAIL'));

// 7. Nama pelanggan asli dan uraian pengeluaran asli dapat ditelusuri
$nullRawCustomer = Income::where('data_source', 'synthetic')->whereNull('raw_customer_name')->count();
$nullRawJenis = Expense::whereNotNull('data_source')->whereNull('raw_jenis')->count();
printf("7. Ketertelusuran Data Asli         : Null raw_customer=%d, Null raw_jenis=%d -> %s\n",
    $nullRawCustomer, $nullRawJenis, ($nullRawCustomer === 0 && $nullRawJenis === 0 ? 'PASS' : 'FAIL'));
