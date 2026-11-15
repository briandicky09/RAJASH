<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Receivable;
use App\Models\ReceivablePayment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $periodType = $request->query('period_type', 'monthly');
        $month = $request->query('month', Carbon::now()->format('Y-m'));
        $date = $request->query('date', Carbon::now()->format('Y-m-d'));
        $dataSource = $request->query('data_source');

        // Filter Helpers (Mendukung 'daily', 'monthly', 'all', serta filter 'data_source')
        $applyPeriod = function ($query, $dateCol = 'date') use ($periodType, $month, $date, $dataSource) {
            if ($periodType === 'daily') {
                $query->whereDate($dateCol, $date);
            } elseif ($periodType === 'monthly') {
                $query->where($dateCol, 'like', "{$month}%");
            }

            if ($dataSource && $dataSource !== 'ALL') {
                $query->where('data_source', $dataSource);
            }

            return $query;
        };

        // Summary Periode Terpilih
        $incomesQuery = $applyPeriod(Income::query());
        $incomes = $incomesQuery->get();

        $cashSales = (float) $incomes->where('payment_method', 'Tunai')->sum('amount');
        $creditSales = (float) $incomes->where('payment_method', 'Kredit')->sum('amount');
        $totalSalesTransaction = $cashSales + $creditSales;

        $paymentsQuery = ReceivablePayment::query();
        if ($periodType === 'daily') {
            $paymentsQuery->whereDate('payment_date', $date);
        } elseif ($periodType === 'monthly') {
            $paymentsQuery->where('payment_date', 'like', "{$month}%");
        }
        if ($dataSource && $dataSource !== 'ALL') {
            $paymentsQuery->whereHas('receivable', function ($q) use ($dataSource) {
                $q->where('data_source', $dataSource);
            });
        }
        $receivablePaymentsReceived = (float) $paymentsQuery->sum('amount');

        $actualCashReceived = $cashSales + $receivablePaymentsReceived;

        $expensesQuery = $applyPeriod(Expense::query());
        $expenses = $expensesQuery->get();
        $totalExpenses = (float) $expenses->sum('amount');

        $netCashProfit = $actualCashReceived - $totalExpenses;
        $netTransactionProfit = $totalSalesTransaction - $totalExpenses;

        // Piutang aktif (keseluruhan yang belum lunas)
        $allActiveReceivablesQuery = Receivable::where('status', 'Belum Lunas')
            ->where('remaining_amount', '>', 0)
            ->orderBy('transaction_date', 'asc');

        if ($dataSource && $dataSource !== 'ALL') {
            $allActiveReceivablesQuery->where('data_source', $dataSource);
        }
        $allActiveReceivables = $allActiveReceivablesQuery->get();

        $totalUnpaidReceivables = (float) $allActiveReceivables->sum('remaining_amount');
        $activeReceivablesCount = $allActiveReceivables->count();

        $summary = [
            'cashSales' => $cashSales,
            'creditSales' => $creditSales,
            'totalSalesTransaction' => $totalSalesTransaction,
            'receivablePaymentsReceived' => $receivablePaymentsReceived,
            'actualCashReceived' => $actualCashReceived,
            'totalExpenses' => $totalExpenses,
            'netCashProfit' => $netCashProfit,
            'netTransactionProfit' => $netTransactionProfit,
            'totalUnpaidReceivables' => $totalUnpaidReceivables,
            'activeReceivablesCount' => $activeReceivablesCount,
            'incomeCount' => $incomes->count(),
            'expenseCount' => $expenses->count(),
        ];

        // Summary Khusus Hari Ini (FR-DSH-01)
        $todayIncomesQuery = Income::whereDate('date', $date);
        $todayExpensesQuery = Expense::whereDate('date', $date);
        $todayPaymentsQuery = ReceivablePayment::whereDate('payment_date', $date);

        if ($dataSource && $dataSource !== 'ALL') {
            $todayIncomesQuery->where('data_source', $dataSource);
            $todayExpensesQuery->where('data_source', $dataSource);
            $todayPaymentsQuery->whereHas('receivable', function ($q) use ($dataSource) {
                $q->where('data_source', $dataSource);
            });
        }

        $todayIncomes = $todayIncomesQuery->get();
        $todayExpenses = $todayExpensesQuery->get();
        $todayPayments = (float) $todayPaymentsQuery->sum('amount');

        $todayCashSales = (float) $todayIncomes->where('payment_method', 'Tunai')->sum('amount');
        $todayCreditSales = (float) $todayIncomes->where('payment_method', 'Kredit')->sum('amount');
        $todayTotalExpenses = (float) $todayExpenses->sum('amount');
        $todayActualCash = $todayCashSales + $todayPayments;

        $todaySummary = [
            'cashSales' => $todayCashSales,
            'creditSales' => $todayCreditSales,
            'totalSalesTransaction' => $todayCashSales + $todayCreditSales,
            'receivablePaymentsReceived' => $todayPayments,
            'actualCashReceived' => $todayActualCash,
            'totalExpenses' => $todayTotalExpenses,
            'netCashProfit' => $todayActualCash - $todayTotalExpenses,
            'netTransactionProfit' => ($todayCashSales + $todayCreditSales) - $todayTotalExpenses,
            'totalUnpaidReceivables' => $totalUnpaidReceivables,
            'activeReceivablesCount' => $activeReceivablesCount,
            'incomeCount' => $todayIncomes->count(),
            'expenseCount' => $todayExpenses->count(),
        ];

        // Transaksi Terbaru
        $recentIncomesQuery = Income::orderBy('date', 'desc')->orderBy('created_at', 'desc')->limit(6);
        $recentExpensesQuery = Expense::orderBy('date', 'desc')->orderBy('created_at', 'desc')->limit(6);

        if ($dataSource && $dataSource !== 'ALL') {
            $recentIncomesQuery->where('data_source', $dataSource);
            $recentExpensesQuery->where('data_source', $dataSource);
        }

        $recentIncomes = $recentIncomesQuery->get()
            ->map(function ($inc) {
                return [
                    'id' => $inc->id,
                    'date' => $inc->date->format('Y-m-d'),
                    'description' => ($inc->customer_name ? "{$inc->customer_name} - " : '') . ($inc->description ?: $inc->water_type),
                    'type' => 'Pemasukan',
                    'subType' => $inc->water_type ?: $inc->payment_method,
                    'amount' => (float) $inc->amount,
                    'status' => $inc->payment_method === 'Tunai' ? 'Tunai Diterima' : ($inc->status === 'Lunas' ? 'Kredit Lunas' : 'Piutang Kredit'),
                    'created_at' => $inc->created_at?->toISOString() ?? $inc->date->format('Y-m-d'),
                ];
            });

        $recentExpenses = $recentExpensesQuery->get()
            ->map(function ($exp) {
                return [
                    'id' => $exp->id,
                    'date' => $exp->date->format('Y-m-d'),
                    'description' => "{$exp->category} - " . ($exp->description ?: 'Biaya operasional'),
                    'type' => 'Pengeluaran',
                    'subType' => $exp->category,
                    'amount' => (float) $exp->amount,
                    'status' => 'Tercatat',
                    'created_at' => $exp->created_at?->toISOString() ?? $exp->date->format('Y-m-d'),
                ];
            });

        $combinedTransactions = $recentIncomes->concat($recentExpenses)
            ->sort(function ($a, $b) {
                if ($b['date'] !== $a['date']) {
                    return strcmp($b['date'], $a['date']);
                }
                return strcmp($b['created_at'], $a['created_at']);
            })
            ->values()
            ->slice(0, 6);

        // Chart Series
        $dateSet = [];
        foreach ($incomes as $i) {
            $dateSet[$i->date->format('Y-m-d')] = true;
        }
        foreach ($expenses as $e) {
            $dateSet[$e->date->format('Y-m-d')] = true;
        }
        ksort($dateSet);

        $chartSeries = [];
        foreach (array_keys($dateSet) as $d) {
            $dayIncomes = $incomes->filter(fn($i) => $i->date->format('Y-m-d') === $d);
            $dayExpenses = $expenses->filter(fn($e) => $e->date->format('Y-m-d') === $d);

            $dayPaymentsQuery = ReceivablePayment::whereDate('payment_date', $d);
            if ($dataSource && $dataSource !== 'ALL') {
                $dayPaymentsQuery->whereHas('receivable', function ($q) use ($dataSource) {
                    $q->where('data_source', $dataSource);
                });
            }
            $dayPayments = (float) $dayPaymentsQuery->sum('amount');

            $cIn = (float) $dayIncomes->where('payment_method', 'Tunai')->sum('amount') + $dayPayments;
            $crSales = (float) $dayIncomes->where('payment_method', 'Kredit')->sum('amount');
            $totSales = (float) $dayIncomes->sum('amount');
            $exp = (float) $dayExpenses->sum('amount');

            $chartSeries[] = [
                'date' => $d,
                'cashIn' => $cIn,
                'creditSales' => $crSales,
                'totalSales' => $totSales,
                'expense' => $exp,
            ];
        }

        return response()->json([
            'data' => [
                'summary' => $summary,
                'todaySummary' => $todaySummary,
                'recentTransactions' => $combinedTransactions,
                'outstandingReceivables' => $allActiveReceivables->slice(0, 5)->values(),
                'allActiveReceivables' => $allActiveReceivables,
                'chartSeries' => $chartSeries,
            ],
        ], 200);
    }
}
