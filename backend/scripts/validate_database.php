<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Expense;
use App\Models\ImportError;
use App\Models\Income;
use App\Models\Receivable;
use Illuminate\Support\Facades\DB;

// Excel figures from previous python deep analysis:
$excelPemTotal = 37129500.00;
$excelPemTunai = 36204500.00;
$excelPemKredit = 925000.00;
$excelPemKreditCount = 68;

$excelPengSTotal = 13280700.00;
$excelPengSCount = 211;

$excelPengRTotal = 6596700.00;
$excelPengRCount = 88;

// DB queries
$dbPemSyn = Income::where('data_source', 'synthetic')->selectRaw('count(*) as count, sum(amount) as sum_amount')->first();
$dbPemTunai = Income::where('data_source', 'synthetic')->where('payment_method', 'Tunai')->selectRaw('count(*) as count, sum(amount) as sum_amount')->first();
$dbPemKredit = Income::where('data_source', 'synthetic')->where('payment_method', 'Kredit')->selectRaw('count(*) as count, sum(amount) as sum_amount')->first();

$dbRcvSyn = Receivable::where('data_source', 'synthetic')->selectRaw('count(*) as count, sum(total_amount) as sum_total, sum(remaining_amount) as sum_remaining')->first();

$dbPengSyn = Expense::where('data_source', 'synthetic')->selectRaw('count(*) as count, sum(amount) as sum_amount')->first();
$dbPengReal = Expense::where('data_source', 'real')->selectRaw('count(*) as count, sum(amount) as sum_amount')->first();

$dbSkippedCount = ImportError::where('status', 'skipped')->count();

echo "=================================================================" . PHP_EOL;
echo "           HASIL VALIDASI DATABASE VS EXCEL ASLI" . PHP_EOL;
echo "=================================================================" . PHP_EOL;

echo "1. PEMASUKAN SINTETIS:" . PHP_EOL;
printf("   Excel Total  : Rp %s (2.408 valid tx + 194 skipped = 2.602 baris)\n", number_format($excelPemTotal, 2, ',', '.'));
printf("   DB Total     : Rp %s (%d tx)\n", number_format($dbPemSyn->sum_amount, 2, ',', '.'), $dbPemSyn->count);
printf("   Selisih Total: Rp %s\n", number_format(abs($excelPemTotal - $dbPemSyn->sum_amount), 2, ',', '.'));
printf("   Excel Tunai  : Rp %s | DB Tunai : Rp %s (Selisih: Rp %s)\n",
    number_format($excelPemTunai, 2, ',', '.'),
    number_format($dbPemTunai->sum_amount, 2, ',', '.'),
    number_format(abs($excelPemTunai - $dbPemTunai->sum_amount), 2, ',', '.')
);
printf("   Excel Kredit : Rp %s (%d tx) | DB Kredit: Rp %s (%d tx) (Selisih: Rp %s)\n",
    number_format($excelPemKredit, 2, ',', '.'), $excelPemKreditCount,
    number_format($dbPemKredit->sum_amount, 2, ',', '.'), $dbPemKredit->count,
    number_format(abs($excelPemKredit - $dbPemKredit->sum_amount), 2, ',', '.')
);

echo PHP_EOL . "2. PIUTANG SINTETIS (OTOMATIS DARI PENJUALAN KREDIT):" . PHP_EOL;
printf("   Jumlah Piutang: %d transaksi | Total Tagihan: Rp %s | Sisa Tagihan: Rp %s\n",
    $dbRcvSyn->count,
    number_format($dbRcvSyn->sum_total, 2, ',', '.'),
    number_format($dbRcvSyn->sum_remaining, 2, ',', '.')
);
echo "   Status Kesesuaian: " . (($dbRcvSyn->count === $excelPemKreditCount && abs($dbRcvSyn->sum_total - $excelPemKredit) < 0.01) ? "100% COCOK PERSIS" : "ADA SELISIH") . PHP_EOL;

echo PHP_EOL . "3. PENGELUARAN SINTETIS:" . PHP_EOL;
printf("   Excel Valid: %d baris (Rp %s)\n", $excelPengSCount, number_format($excelPengSTotal, 2, ',', '.'));
printf("   DB Valid   : %d baris (Rp %s)\n", $dbPengSyn->count, number_format($dbPengSyn->sum_amount, 2, ',', '.'));
printf("   Selisih    : Rp %s\n", number_format(abs($excelPengSTotal - $dbPengSyn->sum_amount), 2, ',', '.'));

echo PHP_EOL . "4. PENGELUARAN REAL (23 AGUSTUS - 23 OKTOBER 2026):" . PHP_EOL;
printf("   Excel Valid: %d baris (Rp %s)\n", $excelPengRCount, number_format($excelPengRTotal, 2, ',', '.'));
printf("   DB Valid   : %d baris (Rp %s)\n", $dbPengReal->count, number_format($dbPengReal->sum_amount, 2, ',', '.'));
printf("   Selisih    : Rp %s\n", number_format(abs($excelPengRTotal - $dbPengReal->sum_amount), 2, ',', '.'));

echo PHP_EOL . "5. SKIPPED LOGS (IMPORT_ERRORS):" . PHP_EOL;
printf("   Total baris dilewati (nominal Rp0 / Tidak Ada) tercatat di DB: %d baris\n", $dbSkippedCount);

echo PHP_EOL . "6. RINCIAN KESELURUHAN DATA DI DATABASE (TERMASUK DATA DEMO):" . PHP_EOL;
echo "   Incomes:" . PHP_EOL;
foreach (Income::select('data_source', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))->groupBy('data_source')->get() as $row) {
    printf("     - %-12s: %5d tx (Rp %s)\n", $row->data_source, $row->count, number_format($row->total, 2, ',', '.'));
}
echo "   Expenses:" . PHP_EOL;
foreach (Expense::select('data_source', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))->groupBy('data_source')->get() as $row) {
    printf("     - %-12s: %5d tx (Rp %s)\n", $row->data_source, $row->count, number_format($row->total, 2, ',', '.'));
}
echo "   Receivables:" . PHP_EOL;
foreach (Receivable::select('data_source', DB::raw('count(*) as count'), DB::raw('sum(total_amount) as total'))->groupBy('data_source')->get() as $row) {
    printf("     - %-12s: %5d tx (Rp %s)\n", $row->data_source, $row->count, number_format($row->total, 2, ',', '.'));
}
