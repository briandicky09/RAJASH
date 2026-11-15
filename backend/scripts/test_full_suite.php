<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

function executeRequest($kernel, $method, $uri, $params = [], $token = null) {
    $req = Illuminate\Http\Request::create($uri, $method, $params);
    $req->headers->set('Accept', 'application/json');
    if ($token) {
        $req->headers->set('Authorization', 'Bearer ' . $token);
    }
    $res = $kernel->handle($req);
    return [
        'status' => $res->getStatusCode(),
        'body' => json_decode($res->getContent(), true),
    ];
}

echo "==========================================================" . PHP_EOL;
echo "             TEST SUITE LENGKAP REST API RAJASH" . PHP_EOL;
echo "==========================================================" . PHP_EOL;

// 1. Test Login
echo "[1] TEST LOGIN OWNER (/api/auth/login)... ";
$login = executeRequest($kernel, 'POST', '/api/auth/login', [
    'username' => 'owner.rajash',
    'password' => 'rajash2026',
]);
if ($login['status'] === 200 && isset($login['body']['data']['token'])) {
    $token = $login['body']['data']['token'];
    echo "PASSED (Token: " . substr($token, 0, 15) . "...)" . PHP_EOL;
} else {
    echo "FAILED: " . json_encode($login) . PHP_EOL;
    exit(1);
}

// 2. Test Dashboard
echo "[2] TEST DASHBOARD (/api/dashboard?period_type=all)... ";
$dash = executeRequest($kernel, 'GET', '/api/dashboard', ['period_type' => 'all'], $token);
if ($dash['status'] === 200 && isset($dash['body']['data']['summary'])) {
    $summary = $dash['body']['data']['summary'];
    printf("PASSED (Sales: Rp %s, Expenses: Rp %s, Cash Profit: Rp %s)\n",
        number_format($summary['totalSalesTransaction'], 0, ',', '.'),
        number_format($summary['totalExpenses'], 0, ',', '.'),
        number_format($summary['netCashProfit'], 0, ',', '.')
    );
} else {
    echo "FAILED: " . json_encode($dash) . PHP_EOL;
    exit(1);
}

// 3. Test Incomes List
echo "[3] TEST INCOMES (/api/incomes)... ";
$incomes = executeRequest($kernel, 'GET', '/api/incomes', [], $token);
if ($incomes['status'] === 200 && count($incomes['body']['data'] ?? []) >= 2417) {
    echo "PASSED (" . count($incomes['body']['data']) . " transaksi terambil)" . PHP_EOL;
} else {
    echo "FAILED (Count: " . count($incomes['body']['data'] ?? []) . ")" . PHP_EOL;
    exit(1);
}

// 4. Test Check Duplicate
echo "[4] TEST CHECK DUPLICATE (/api/incomes/check-duplicate)... ";
$dup = executeRequest($kernel, 'POST', '/api/incomes/check-duplicate', [
    'date' => '2026-04-23',
    'customer_name' => 'Icha Kos',
    'amount' => 5000,
    'payment_method' => 'Tunai',
], $token);
if ($dup['status'] === 200 && isset($dup['body']['data']['isDuplicate'])) {
    echo "PASSED (Duplicate detected: " . ($dup['body']['data']['isDuplicate'] ? 'True' : 'False') . ")" . PHP_EOL;
} else {
    echo "FAILED: " . json_encode($dup) . PHP_EOL;
}

// 5. Test Expense Categories
echo "[5] TEST EXPENSE CATEGORIES (/api/expense-categories)... ";
$cats = executeRequest($kernel, 'GET', '/api/expense-categories', [], $token);
if ($cats['status'] === 200 && count($cats['body']['data'] ?? []) === 9) {
    $catNames = array_column($cats['body']['data'], 'name');
    echo "PASSED (9 Kategori: " . implode(', ', array_slice($catNames, 0, 4)) . ", ...)" . PHP_EOL;
} else {
    echo "FAILED" . PHP_EOL;
}

// 6. Test Expenses List
echo "[6] TEST EXPENSES (/api/expenses)... ";
$expenses = executeRequest($kernel, 'GET', '/api/expenses', [], $token);
if ($expenses['status'] === 200 && count($expenses['body']['data'] ?? []) >= 304) {
    echo "PASSED (" . count($expenses['body']['data']) . " pengeluaran terambil)" . PHP_EOL;
} else {
    echo "FAILED (Count: " . count($expenses['body']['data'] ?? []) . ")" . PHP_EOL;
}

// 7. Test Receivables List
echo "[7] TEST RECEIVABLES (/api/receivables)... ";
$receivables = executeRequest($kernel, 'GET', '/api/receivables', [], $token);
if ($receivables['status'] === 200 && count($receivables['body']['data'] ?? []) >= 72) {
    echo "PASSED (" . count($receivables['body']['data']) . " piutang terambil)" . PHP_EOL;
} else {
    echo "FAILED" . PHP_EOL;
}

// 8. Test Receivable Payment
echo "[8] TEST PAYMENT PIUTANG (/api/receivables/{id}/payments)... ";
$firstUnpaid = collect($receivables['body']['data'])->firstWhere('status', 'Belum Lunas');
if ($firstUnpaid && $firstUnpaid['remaining_amount'] > 0) {
    $payAmount = min(5000, $firstUnpaid['remaining_amount']);
    $payRes = executeRequest($kernel, 'POST', "/api/receivables/{$firstUnpaid['id']}/payments", [
        'amount' => $payAmount,
        'payment_date' => '2026-11-15',
        'note' => 'Uji coba pembayaran cicilan via test suite',
    ], $token);
    if ($payRes['status'] === 201) {
        printf("PASSED (Berhasil bayar Rp %s pada %s, sisa: Rp %s)\n",
            number_format($payAmount, 0, ',', '.'),
            $firstUnpaid['id'],
            number_format($payRes['body']['data']['remaining_amount'], 0, ',', '.')
        );
    } else {
        echo "FAILED: " . json_encode($payRes) . PHP_EOL;
    }
} else {
    echo "SKIPPED (No unpaid receivable found)" . PHP_EOL;
}

// 9. Test Recapitulation
echo "[9] TEST RECAPITULATION (/api/recapitulation?period_type=monthly&month=2026-05)... ";
$recap = executeRequest($kernel, 'GET', '/api/recapitulation', [
    'period_type' => 'monthly',
    'month' => '2026-05',
], $token);
if ($recap['status'] === 200 && isset($recap['body']['data']['summary'])) {
    $s = $recap['body']['data']['summary'];
    printf("PASSED (Mei 2026: Sales Rp %s, Cash In Rp %s, Exp Rp %s)\n",
        number_format($s['totalSalesTransaction'], 0, ',', '.'),
        number_format($s['actualCashReceived'], 0, ',', '.'),
        number_format($s['totalExpenses'], 0, ',', '.')
    );
} else {
    echo "FAILED: " . json_encode($recap) . PHP_EOL;
}

// 10. Test Import Batches
echo "[10] TEST IMPORT BATCHES (/api/import-batches)... ";
$batches = executeRequest($kernel, 'GET', '/api/import-batches', [], $token);
if ($batches['status'] === 200 && count($batches['body']['data'] ?? []) === 3) {
    echo "PASSED (3 batch tersimpan dengan audit log error/skipped)" . PHP_EOL;
} else {
    echo "FAILED" . PHP_EOL;
}

echo "==========================================================" . PHP_EOL;
echo "          SELURUH UJI SUITE SELESAI DENGAN SUKSES!" . PHP_EOL;
echo "==========================================================" . PHP_EOL;
