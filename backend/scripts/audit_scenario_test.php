<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Income;
use App\Models\Receivable;
use App\Models\ReceivablePayment;
use Illuminate\Support\Facades\DB;

echo "=== SIMULASI SKENARIO KREDIT RP 100.000 DENGAN 2 KALI CICILAN ===" . PHP_EOL;

DB::beginTransaction();

try {
    // 1. Buat Income Kredit Rp 100.000 pada 2026-11-01
    $income = Income::create([
        'id' => 'INC-TEST-001',
        'date' => '2026-11-01',
        'customer_name' => 'Pelanggan Audit Kredit',
        'raw_customer_name' => 'Pelanggan Audit Kredit',
        'water_type' => 'Air Biasa (BS)',
        'ro_quantity' => 0,
        'bs_quantity' => 25,
        'quantity' => 25,
        'amount' => 100000,
        'payment_method' => 'Kredit',
        'status' => 'Belum Lunas',
        'data_source' => 'application',
    ]);

    $receivable = Receivable::create([
        'id' => 'RCV-TEST-001',
        'income_id' => $income->id,
        'customer_name' => $income->customer_name,
        'transaction_date' => $income->date,
        'date' => $income->date,
        'total_amount' => 100000,
        'paid_amount' => 0,
        'remaining_amount' => 100000,
        'status' => 'Belum Lunas',
        'data_source' => 'application',
    ]);

    echo "Status Awal Setelah Kredit Terbentuk:" . PHP_EOL;
    printf("  Income: amount=%s, method=%s, status=%s\n", number_format($income->amount), $income->payment_method, $income->status);
    printf("  Receivable: total=%s, paid=%s, remaining=%s, status=%s\n", number_format($receivable->total_amount), number_format($receivable->paid_amount), number_format($receivable->remaining_amount), $receivable->status);

    // 2. Pembayaran Pertama Rp 40.000 pada 2026-11-05
    $pay1 = ReceivablePayment::create([
        'id' => 'PAY-TEST-001',
        'receivable_id' => $receivable->id,
        'payment_date' => '2026-11-05',
        'date' => '2026-11-05',
        'amount' => 40000,
        'note' => 'Cicilan 1',
    ]);
    $receivable->update([
        'paid_amount' => 40000,
        'remaining_amount' => 60000,
        'status' => 'Belum Lunas',
    ]);

    echo "\nStatus Setelah Pembayaran Pertama (Rp 40.000):" . PHP_EOL;
    printf("  Receivable: total=%s, paid=%s, remaining=%s, status=%s\n", number_format($receivable->total_amount), number_format($receivable->paid_amount), number_format($receivable->remaining_amount), $receivable->status);
    printf("  Income: status=%s\n", $income->fresh()->status);

    // 3. Pembayaran Kedua Rp 60.000 pada 2026-11-10 (Pelunasan)
    $pay2 = ReceivablePayment::create([
        'id' => 'PAY-TEST-002',
        'receivable_id' => $receivable->id,
        'payment_date' => '2026-11-10',
        'date' => '2026-11-10',
        'amount' => 60000,
        'note' => 'Cicilan 2 Lunas',
    ]);
    $receivable->update([
        'paid_amount' => 100000,
        'remaining_amount' => 0,
        'status' => 'Lunas',
    ]);
    $income->update(['status' => 'Lunas']);

    echo "\nStatus Setelah Pembayaran Kedua (Rp 60.000 - Pelunasan):" . PHP_EOL;
    printf("  Receivable: total=%s, paid=%s, remaining=%s, status=%s\n", number_format($receivable->total_amount), number_format($receivable->paid_amount), number_format($receivable->remaining_amount), $receivable->status);
    printf("  Income: status=%s\n", $income->fresh()->status);

    // Perhitungan Kas Masuk & Pendapatan Transaksi untuk Transaksi Ini
    $inc = $income->fresh();
    $cashSales = ($inc->payment_method === 'Tunai') ? $inc->amount : 0;
    $creditSales = ($inc->payment_method === 'Kredit') ? $inc->amount : 0;
    $totalSalesTx = $cashSales + $creditSales;
    $rcvPayments = ReceivablePayment::where('receivable_id', $receivable->id)->sum('amount');
    $actualCash = $cashSales + $rcvPayments;

    echo "\nHasil Akhir Perhitungan Finansial Transaksi Ini:" . PHP_EOL;
    printf("  - Total Pendapatan Transaksi : Rp %s (Expected: Rp 100.000)\n", number_format($totalSalesTx, 0, ',', '.'));
    printf("  - Total Kas Masuk Diterima   : Rp %s (Expected: Rp 100.000)\n", number_format($actualCash, 0, ',', '.'));
    printf("  - Sisa Piutang               : Rp %s (Expected: Rp 0)\n", number_format($receivable->remaining_amount, 0, ',', '.'));
    printf("  - Duplikasi Kas Masuk        : %s\n", ($actualCash == 100000) ? "TIDAK ADA (PASS)" : "DUPLIKASI (FAIL)");
    printf("  - Duplikasi Transaksi Sales  : %s\n", ($totalSalesTx == 100000) ? "TIDAK ADA (PASS)" : "DUPLIKASI (FAIL)");

} finally {
    // Rollback test data to keep database clean
    DB::rollBack();
    echo "\n[INFO] Data uji berhasil di-rollback. Database tetap bersih." . PHP_EOL;
}
