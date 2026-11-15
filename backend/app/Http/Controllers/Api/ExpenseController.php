<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ExpenseController extends Controller
{
    public function categories()
    {
        $categories = ExpenseCategory::orderBy('id', 'asc')->get();
        return response()->json([
            'data' => $categories,
        ], 200);
    }

    public function index(Request $request)
    {
        $query = Expense::query();

        if ($request->filled('start_date')) {
            $query->whereDate('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('date', '<=', $request->end_date);
        }

        if ($request->filled('category') && $request->category !== 'ALL') {
            $query->where('category', $request->category);
        }

        if ($request->filled('data_source') && $request->data_source !== 'ALL') {
            $query->where('data_source', $request->data_source);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('category', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('raw_jenis', 'like', "%{$search}%");
            });
        }

        $expenses = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $expenses,
        ], 200);
    }

    public function store(Request $request)
    {
        $validCategories = ExpenseCategory::pluck('name')->toArray();

        $validated = $request->validate([
            'date' => 'required|date',
            'category' => ['required', 'string', Rule::in($validCategories)],
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string',
        ]);

        $dateFormatted = Carbon::parse($validated['date'])->format('Ymd');
        $randomSuffix = strtoupper(Str::random(4));
        $expenseId = 'EXP-' . $dateFormatted . '-' . $randomSuffix;

        $expense = Expense::create([
            'id' => $expenseId,
            'date' => $validated['date'],
            'category' => $validated['category'],
            'raw_jenis' => $validated['category'],
            'amount' => $validated['amount'],
            'description' => $validated['description'] ?? null,
            'data_source' => 'application',
        ]);

        return response()->json([
            'message' => 'Pengeluaran operasional berhasil dicatat',
            'data' => $expense,
        ], 201);
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json([
            'message' => 'Pengeluaran berhasil dihapus',
            'data' => null,
        ], 200);
    }
}
