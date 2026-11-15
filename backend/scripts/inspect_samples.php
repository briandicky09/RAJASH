<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Expense;
use App\Models\Income;
use App\Models\Receivable;

echo "=== CONTOH INCOMES HASIL IMPORT (TUNAI / LUNAS) ===" . PHP_EOL;
Income::where('data_source', 'synthetic')->where('payment_method', 'Tunai')->where('amount', '>', 0)->limit(5)->get()->each(function($i) {
    printf("  ID: %-26s | %s | %-16s | %-22s | Rp %6s | %s\n",
        $i->id, $i->date->format('Y-m-d'), $i->customer_name, $i->water_type, number_format($i->amount), $i->status);
});

echo PHP_EOL . "=== CONTOH INCOMES HASIL IMPORT (KREDIT / BELUM BAYAR -> PIUTANG) ===" . PHP_EOL;
Income::where('data_source', 'synthetic')->where('payment_method', 'Kredit')->limit(5)->get()->each(function($i) {
    printf("  ID: %-26s | %s | %-16s | %-22s | Rp %6s | %s (%s)\n",
        $i->id, $i->date->format('Y-m-d'), $i->customer_name, $i->water_type, number_format($i->amount), $i->payment_method, $i->status);
});

echo PHP_EOL . "=== CONTOH TRANSAKSI KUPON (PENUKARAN GRATIS RP 0) ===" . PHP_EOL;
Income::where('raw_customer_name', 'Kupon')->limit(4)->get()->each(function($i) {
    printf("  ID: %-26s | %s | %-24s | RO:%s, BS:%s | Rp %s | %s\n",
        $i->id, $i->date->format('Y-m-d'), $i->customer_name, $i->ro_quantity, $i->bs_quantity, number_format($i->amount), $i->status);
});

echo PHP_EOL . "=== CONTOH TRANSAKSI OTK (PELANGGAN DEPOT) ===" . PHP_EOL;
Income::where('raw_customer_name', 'OTK')->limit(4)->get()->each(function($i) {
    printf("  ID: %-26s | %s | %-24s | RO:%s, BS:%s | Rp %6s | %s\n",
        $i->id, $i->date->format('Y-m-d'), $i->customer_name, $i->ro_quantity, $i->bs_quantity, number_format($i->amount), $i->status);
});

echo PHP_EOL . "=== CONTOH PENGELUARAN REAL (DARI DATASET PENGELUARAN-1.XLSX) ===" . PHP_EOL;
Expense::where('data_source', 'real')->limit(5)->get()->each(function($e) {
    printf("  ID: %-26s | %s | Uraian: %-26s | Kategori: %-18s | Rp %8s\n",
        $e->id, $e->date->format('Y-m-d'), $e->raw_jenis, $e->category, number_format($e->amount));
});

echo PHP_EOL . "=== CONTOH PIUTANG AKTIF DI TABEL RECEIVABLES ===" . PHP_EOL;
Receivable::where('data_source', 'synthetic')->limit(5)->get()->each(function($r) {
    printf("  ID: %-26s | %s | Pelanggan: %-16s | Tagihan: Rp %6s | Sisa: Rp %6s | Status: %s\n",
        $r->id, $r->transaction_date->format('Y-m-d'), $r->customer_name, number_format($r->total_amount), number_format($r->remaining_amount), $r->status);
});
