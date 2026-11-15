<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Receivable;
use App\Models\ReceivablePayment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RecapitulationController extends Controller
{
    public function index(Request $request)
    {
        $periodType = $request->query('period_type', 'monthly');
        $month = $request->query('month', Carbon::now()->format('Y-m'));
        $date = $request->query('date', Carbon::now()->format('Y-m-d'));
        $dataSource = $request->query('data_source');

        $applyPeriod = function ($query, $dateCol = 'date') use ($periodType, $month, $date, $dataSource) {
            if ($periodType === 'daily') {
                $query->whereDate($dateCol, $date);
            } else {
                $query->where($dateCol, 'like', "{$month}%");
            }

            if ($dataSource && $dataSource !== 'ALL') {
                $query->where('data_source', $dataSource);
            }

            return $query;
        };

        // Periode Data
        $periodIncomes = $applyPeriod(Income::query())->orderBy('date', 'desc')->get();
        $periodExpenses = $applyPeriod(Expense::query())->orderBy('date', 'desc')->get();

        $paymentsQuery = ReceivablePayment::with('receivable');
        if ($periodType === 'daily') {
            $paymentsQuery->whereDate('payment_date', $date);
        } else {
            $paymentsQuery->where('payment_date', 'like', "{$month}%");
        }
        if ($dataSource && $dataSource !== 'ALL') {
            $paymentsQuery->whereHas('receivable', function ($q) use ($dataSource) {
                $q->where('data_source', $dataSource);
            });
        }
        $rawPayments = $paymentsQuery->orderBy('payment_date', 'desc')->get();

        $periodReceivablePayments = $rawPayments->map(function ($pay) {
            return [
                'id' => $pay->id,
                'date' => $pay->payment_date->format('Y-m-d'),
                'payment_date' => $pay->payment_date->format('Y-m-d'),
                'customer_name' => $pay->receivable?->customer_name ?? 'Pelanggan Piutang',
                'receivable_id' => $pay->receivable_id,
                'amount' => (float) $pay->amount,
                'note' => $pay->note,
            ];
        });

        // Perhitungan Summary
        $cashSales = (float) $periodIncomes->where('payment_method', 'Tunai')->sum('amount');
        $creditSales = (float) $periodIncomes->where('payment_method', 'Kredit')->sum('amount');
        $totalSalesTransaction = $cashSales + $creditSales;
        $receivablePaymentsReceived = (float) $periodReceivablePayments->sum('amount');
        $actualCashReceived = $cashSales + $receivablePaymentsReceived;
        $totalExpenses = (float) $periodExpenses->sum('amount');
        $netCashProfit = $actualCashReceived - $totalExpenses;
        $netTransactionProfit = $totalSalesTransaction - $totalExpenses;

        $allActiveReceivablesQuery = Receivable::where('status', 'Belum Lunas')->where('remaining_amount', '>', 0);
        if ($dataSource && $dataSource !== 'ALL') {
            $allActiveReceivablesQuery->where('data_source', $dataSource);
        }
        $allActiveReceivables = $allActiveReceivablesQuery->get();
        $totalUnpaidReceivables = (float) $allActiveReceivables->sum('remaining_amount');

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
            'activeReceivablesCount' => $allActiveReceivables->count(),
            'incomeCount' => $periodIncomes->count(),
            'expenseCount' => $periodExpenses->count(),
        ];

        // Breakdown Biaya per Kategori
        $expenseByCategoryMap = [];
        foreach ($periodExpenses as $exp) {
            $cat = $exp->category;
            $expenseByCategoryMap[$cat] = ($expenseByCategoryMap[$cat] ?? 0) + (float) $exp->amount;
        }

        $expenseBreakdown = [];
        foreach ($expenseByCategoryMap as $category => $amount) {
            $percentage = $totalExpenses > 0 ? round(($amount / $totalExpenses) * 100) : 0;
            $expenseBreakdown[] = [
                'category' => $category,
                'amount' => $amount,
                'percentage' => $percentage,
            ];
        }
        usort($expenseBreakdown, fn($a, $b) => $b['amount'] <=> $a['amount']);

        // Chart Series
        $dateSet = [];
        foreach ($periodIncomes as $i) {
            $dateSet[$i->date->format('Y-m-d')] = true;
        }
        foreach ($periodExpenses as $e) {
            $dateSet[$e->date->format('Y-m-d')] = true;
        }
        ksort($dateSet);

        $chartSeries = [];
        foreach (array_keys($dateSet) as $d) {
            $dayIncomes = $periodIncomes->filter(fn($i) => $i->date->format('Y-m-d') === $d);
            $dayExpenses = $periodExpenses->filter(fn($e) => $e->date->format('Y-m-d') === $d);
            $dayPayments = $periodReceivablePayments->filter(fn($p) => $p['date'] === $d)->sum('amount');

            $cIn = (float) $dayIncomes->where('payment_method', 'Tunai')->sum('amount') + (float) $dayPayments;
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
                'periodIncomes' => $periodIncomes,
                'periodExpenses' => $periodExpenses,
                'periodReceivablePayments' => $periodReceivablePayments,
                'expenseBreakdown' => $expenseBreakdown,
                'chartSeries' => $chartSeries,
            ],
        ], 200);
    }
}
