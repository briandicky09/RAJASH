<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Income;
use Illuminate\Support\Facades\DB;

echo "=== TEST DUA TRANSAKSI DENGAN ATRIBUT SAMA (BEDA WAKTU) ===" . PHP_EOL;

DB::beginTransaction();
try {
    $tx1 = Income::create([
        'id' => 'INC-20261115-AA11',
        'date' => '2026-11-15',
        'customer_name' => 'Warkop Ulee Kareng',
        'raw_customer_name' => 'Warkop Ulee Kareng',
        'water_type' => 'Air Biasa (BS)',
        'quantity' => 5,
        'amount' => 20000,
        'payment_method' => 'Tunai',
        'status' => 'Lunas',
        'description' => 'Pagi jam 08:00',
        'data_source' => 'application',
    ]);

    $tx2 = Income::create([
        'id' => 'INC-20261115-BB22',
        'date' => '2026-11-15',
        'customer_name' => 'Warkop Ulee Kareng',
        'raw_customer_name' => 'Warkop Ulee Kareng',
        'water_type' => 'Air Biasa (BS)',
        'quantity' => 5,
        'amount' => 20000,
        'payment_method' => 'Tunai',
        'status' => 'Lunas',
        'description' => 'Sore jam 16:00',
        'data_source' => 'application',
    ]);

    $count = Income::where('customer_name', 'Warkop Ulee Kareng')->whereDate('date', '2026-11-15')->count();
    printf("Jumlah transaksi tersimpan: %d (Expected: 2)\n", $count);
    echo "Status: " . ($count === 2 ? "PASS (Dua transaksi sah dapat disimpan tanpa saling menolak)" : "FAIL") . PHP_EOL;
} finally {
    DB::rollBack();
    echo "[INFO] Rollback selesai." . PHP_EOL;
}
