<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Receivable;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Income::query();

        if ($request->filled('start_date')) {
            $query->whereDate('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('date', '<=', $request->end_date);
        }

        if ($request->filled('payment_method') && $request->payment_method !== 'ALL') {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->filled('data_source') && $request->data_source !== 'ALL') {
            $query->where('data_source', $request->data_source);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('raw_customer_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('water_type', 'like', "%{$search}%");
            });
        }

        $incomes = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $incomes,
        ], 200);
    }

    public function checkDuplicate(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric',
        ]);

        $date = Carbon::parse($request->date)->format('Y-m-d');
        $customerName = trim($request->customer_name ?? '');
        $amount = (float) $request->amount;

        $query = Income::whereDate('date', $date)
            ->where('amount', $amount);

        if (!empty($customerName)) {
            $query->where(function ($q) use ($customerName) {
                $q->where('customer_name', 'like', "%{$customerName}%")
                  ->orWhere('raw_customer_name', 'like', "%{$customerName}%");
            });
        }

        $matches = $query->limit(5)->get();

        return response()->json([
            'data' => [
                'isDuplicate' => $matches->isNotEmpty(),
                'matches' => $matches,
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'customer_name' => 'nullable|string|max:255',
            'water_type' => 'nullable|string|max:100',
            'ro_quantity' => 'nullable|numeric|min:0',
            'bs_quantity' => 'nullable|numeric|min:0',
            'ro_price' => 'nullable|numeric|min:0',
            'bs_price' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|numeric|min:0',
            'unit_price' => 'nullable|numeric|min:0',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:Tunai,Kredit',
            'description' => 'nullable|string',
        ]);

        $dateFormatted = Carbon::parse($validated['date'])->format('Ymd');
        $randomSuffix = strtoupper(Str::random(4));
        $incomeId = 'INC-' . $dateFormatted . '-' . $randomSuffix;

        $paymentMethod = $validated['payment_method'];
        $status = ($paymentMethod === 'Tunai') ? 'Lunas' : 'Belum Lunas';

        $customerName = !empty($validated['customer_name']) ? trim($validated['customer_name']) : 'Pelanggan Depot Langsung';
        $roQty = (float) ($validated['ro_quantity'] ?? 0);
        $bsQty = (float) ($validated['bs_quantity'] ?? 0);
        $totalQty = (float) ($validated['quantity'] ?? ($roQty + $bsQty));

        $income = Income::create([
            'id' => $incomeId,
            'date' => $validated['date'],
            'customer_name' => $customerName,
            'raw_customer_name' => $customerName,
            'water_type' => $validated['water_type'] ?? 'Air Mineral',
            'ro_quantity' => $roQty,
            'bs_quantity' => $bsQty,
            'ro_price' => $validated['ro_price'] ?? 5000.00,
            'bs_price' => $validated['bs_price'] ?? 4000.00,
            'quantity' => $totalQty > 0 ? $totalQty : 1,
            'unit_price' => $validated['unit_price'] ?? ($totalQty > 0 ? $validated['amount'] / $totalQty : 0),
            'amount' => $validated['amount'],
            'payment_method' => $paymentMethod,
            'status' => $status,
            'description' => $validated['description'] ?? null,
            'data_source' => 'application',
        ]);

        // Otomatis buat entitas piutang jika Kredit
        if ($paymentMethod === 'Kredit' && $income->amount > 0) {
            $receivableId = 'RCV-' . $dateFormatted . '-' . $randomSuffix;
            Receivable::create([
                'id' => $receivableId,
                'income_id' => $income->id,
                'customer_name' => $income->customer_name,
                'transaction_date' => $income->date,
                'date' => $income->date,
                'total_amount' => $income->amount,
                'paid_amount' => 0,
                'remaining_amount' => $income->amount,
                'status' => 'Belum Lunas',
                'description' => $income->description ?? ('Piutang pesanan ' . $income->water_type . ' (' . $income->quantity . ' galon)'),
                'data_source' => 'application',
            ]);
        }

        return response()->json([
            'message' => 'Pemasukan berhasil dicatat',
            'data' => $income,
        ], 201);
    }

    public function destroy($id)
    {
        $income = Income::findOrFail($id);
        
        if ($income->receivable) {
            $income->receivable->delete();
        }

        $income->delete();

        return response()->json([
            'message' => 'Pemasukan berhasil dihapus',
            'data' => null,
        ], 200);
    }
}
