<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\IncomeController;
use App\Http\Controllers\Api\ReceivableController;
use App\Http\Controllers\Api\RecapitulationController;
use App\Models\ImportBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'RAJASH Keuangan REST API',
        'timestamp' => now()->toISOString(),
    ]);
});

// Autentikasi Pengguna (FR-01)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Endpoint Fungsional Terproteksi (Bearer Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard Keuangan (FR-02 & FR-08)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Pemasukan & Validasi Duplikasi (FR-03 & FR-06)
    Route::get('/incomes', [IncomeController::class, 'index']);
    Route::post('/incomes/check-duplicate', [IncomeController::class, 'checkDuplicate']);
    Route::post('/incomes', [IncomeController::class, 'store']);
    Route::delete('/incomes/{id}', [IncomeController::class, 'destroy']);

    // Pengeluaran Operasional (FR-04)
    Route::get('/expense-categories', [ExpenseController::class, 'categories']);
    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);

    // Pengelolaan Piutang & Pembayaran (FR-05)
    Route::get('/receivables', [ReceivableController::class, 'index']);
    Route::get('/receivables/{id}', [ReceivableController::class, 'show']);
    Route::post('/receivables/{id}/payments', [ReceivableController::class, 'storePayment']);

    // Rekapitulasi Keuangan (FR-07)
    Route::get('/recapitulation', [RecapitulationController::class, 'index']);

    // Riwayat Batch Import
    Route::get('/import-batches', function () {
        return response()->json([
            'data' => ImportBatch::with('errors')->orderBy('created_at', 'desc')->get(),
        ]);
    });
    Route::get('/import-batches/{id}', function ($id) {
        return response()->json([
            'data' => ImportBatch::with('errors')->findOrFail($id),
        ]);
    });
});
