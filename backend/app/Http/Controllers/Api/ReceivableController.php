<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Receivable;
use App\Models\ReceivablePayment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReceivableController extends Controller
{
    public function index(Request $request)
    {
        $query = Receivable::with('payments');

        if ($request->filled('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('transaction_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('transaction_date', '<=', $request->end_date);
        }

        if ($request->filled('data_source') && $request->data_source !== 'ALL') {
            $query->where('data_source', $request->data_source);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $receivables = $query->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $receivables,
        ], 200);
    }

    public function show($id)
    {
        $receivable = Receivable::with('payments', 'income')->findOrFail($id);

        return response()->json([
            'data' => $receivable,
        ], 200);
    }

    public function storePayment(Request $request, $id)
    {
        $receivable = Receivable::findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        $amount = (float) $validated['amount'];
        $remaining = (float) $receivable->remaining_amount;

        if ($amount > $remaining) {
            throw ValidationException::withMessages([
                'amount' => ["Nominal pembayaran (Rp " . number_format($amount, 0, ',', '.') . ") melebihi sisa piutang (Rp " . number_format($remaining, 0, ',', '.') . ")."],
            ]);
        }

        $dateFormatted = Carbon::parse($validated['payment_date'])->format('Ymd');
        $randomSuffix = strtoupper(Str::random(4));
        $paymentId = 'PAY-' . $dateFormatted . '-' . $randomSuffix;

        return DB::transaction(function () use ($receivable, $validated, $amount, $remaining, $paymentId) {
            ReceivablePayment::create([
                'id' => $paymentId,
                'receivable_id' => $receivable->id,
                'payment_date' => $validated['payment_date'],
                'date' => $validated['payment_date'],
                'amount' => $amount,
                'note' => $validated['note'] ?? null,
            ]);

            $newRemaining = max(0, $remaining - $amount);
            $newPaid = (float) $receivable->paid_amount + $amount;
            $isLunas = $newRemaining <= 0;

            $receivable->update([
                'paid_amount' => $newPaid,
                'remaining_amount' => $newRemaining,
                'status' => $isLunas ? 'Lunas' : 'Belum Lunas',
            ]);

            // Perbarui status pemasukan jika terkait
            if ($isLunas && $receivable->income) {
                $receivable->income->update(['status' => 'Lunas']);
            }

            return response()->json([
                'message' => 'Pembayaran piutang berhasil dicatat',
                'data' => $receivable->fresh('payments'),
            ], 201);
        });
    }
}
