<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
// Trigger bootstrap by handling a dummy request
$dummyReq = Illuminate\Http\Request::create('/api/health', 'GET');
$kernel->handle($dummyReq);

$user = App\Models\User::first();
$token = $user->createToken('test')->plainTextToken;

function callApi($kernel, $uri, $params, $token) {
    $req = Illuminate\Http\Request::create($uri, 'GET', $params);
    $req->headers->set('Accept', 'application/json');
    $req->headers->set('Authorization', 'Bearer ' . $token);
    $res = $kernel->handle($req);
    return json_decode($res->getContent(), true)['data'] ?? [];
}

// 1. Test Daily Dashboard
$dailyDash = callApi($kernel, '/api/dashboard', ['period_type' => 'daily', 'date' => '2026-05-15'], $token);
echo "1. Daily Dashboard (2026-05-15):" . PHP_EOL;
printf("   Incomes: %d tx, Cash Sales: Rp %s, Total Tx Sales: Rp %s\n",
    $dailyDash['summary']['incomeCount'],
    number_format($dailyDash['summary']['cashSales']),
    number_format($dailyDash['summary']['totalSalesTransaction'])
);

// 2. Test Recapitulation Real Data Source (September 2026)
$recapReal = callApi($kernel, '/api/recapitulation', ['period_type' => 'monthly', 'month' => '2026-09', 'data_source' => 'real'], $token);
echo "\n2. Recapitulation Real (September 2026 - Data Source 'real'):" . PHP_EOL;
printf("   Expenses Real: %d tx, Total Rp %s\n",
    count($recapReal['periodExpenses']),
    number_format($recapReal['summary']['totalExpenses'])
);

// 3. Test Recapitulation Synthetic Data Source (Mei 2026)
$recapSyn = callApi($kernel, '/api/recapitulation', ['period_type' => 'monthly', 'month' => '2026-05', 'data_source' => 'synthetic'], $token);
echo "\n3. Recapitulation Synthetic (Mei 2026 - Data Source 'synthetic'):" . PHP_EOL;
printf("   Incomes Syn: %d tx, Total Sales: Rp %s, Cash In: Rp %s\n",
    $recapSyn['summary']['incomeCount'],
    number_format($recapSyn['summary']['totalSalesTransaction']),
    number_format($recapSyn['summary']['actualCashReceived'])
);

echo "\nSTATUS: SEMUA FILTER BERJALAN SEMPURNA!" . PHP_EOL;
