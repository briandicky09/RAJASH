<?php

namespace App\Console\Commands;

use App\Models\Expense;
use App\Models\ImportBatch;
use App\Models\ImportError;
use App\Models\Income;
use App\Models\Receivable;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportDatasetCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rajash:import-dataset {--force : Re-import even if already processed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import dataset RAJASH (pemasukan sintetis, pengeluaran sintetis, dan pengeluaran real) secara aman dan idempotent';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("==========================================================");
        $this->info("   MEMULAI PROSES IMPORT DATASET UMKM RAJASH");
        $this->info("==========================================================");

        $importDir = storage_path('app/import');

        $files = [
            'pemasukan_sintetis.json' => 'Pemasukan Sintetis (Data_Sintetis_Rajash.xlsx)',
            'pengeluaran_sintetis.json' => 'Pengeluaran Sintetis (Data_Sintetis_Rajash.xlsx)',
            'pengeluaran_real.json' => 'Pengeluaran Real (Dataset Pengeluaran-1.xlsx)',
        ];

        $totalSummary = [
            'total_rows_read' => 0,
            'imported' => 0,
            'skipped' => 0,
            'failed' => 0,
            'duplicates' => 0,
            'incomes_count' => 0,
            'incomes_amount' => 0.0,
            'expenses_count' => 0,
            'expenses_amount' => 0.0,
            'receivables_count' => 0,
            'receivables_amount' => 0.0,
            'real_count' => 0,
            'synthetic_count' => 0,
        ];

        foreach ($files as $file => $label) {
            $path = $importDir . DIRECTORY_SEPARATOR . $file;
            if (!file_exists($path)) {
                $this->error("File payload tidak ditemukan: {$path}");
                continue;
            }

            $this->info("\nMemproses: {$label}...");
            $payload = json_decode(file_get_contents($path), true);

            $batchId = $payload['batch_id'];
            $fileType = $payload['file_type'];
            $dataSource = $payload['data_source'];
            $totalRows = $payload['total_rows'];

            $itemsToImport = $payload['items_to_import'];
            $itemsSkipped = $payload['items_skipped'];

            $totalSummary['total_rows_read'] += $totalRows;

            DB::beginTransaction();
            try {
                // Catat atau perbarui Batch
                $batch = ImportBatch::updateOrCreate(
                    ['id' => $batchId],
                    [
                        'filename' => $payload['filename'],
                        'sheet_name' => $payload['sheet_name'],
                        'file_type' => $fileType,
                        'data_source' => $dataSource,
                        'total_rows' => $totalRows,
                        'imported_rows' => 0,
                        'skipped_rows' => count($itemsSkipped),
                        'failed_rows' => 0,
                        'total_amount' => 0.00,
                        'status' => 'processing',
                    ]
                );

                // Catat skipped items ke import_errors (idempotent: hapus error batch ini dulu jika ada)
                ImportError::where('batch_id', $batchId)->delete();
                $skippedEntries = [];
                $now = now();
                foreach ($itemsSkipped as $sk) {
                    $skippedEntries[] = [
                        'batch_id' => $batchId,
                        'row_number' => $sk['row_number'],
                        'sheet_name' => $payload['sheet_name'],
                        'raw_data' => json_encode($sk['raw_data']),
                        'status' => 'skipped',
                        'reason' => $sk['reason'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                foreach (array_chunk($skippedEntries, 500) as $chunk) {
                    ImportError::insert($chunk);
                }
                $totalSummary['skipped'] += count($itemsSkipped);

                $batchImported = 0;
                $batchAmount = 0.0;
                $batchDuplicates = 0;

                if ($fileType === 'pemasukan_sintetis') {
                    foreach ($itemsToImport as $item) {
                        $ref = $item['raw_reference'];

                        // Idempotensi check
                        $existing = Income::where('raw_reference', $ref)->first();
                        if ($existing) {
                            $batchDuplicates++;
                            continue;
                        }

                        $dateFormatted = Carbon::parse($item['date'])->format('Ymd');
                        $incomeId = 'INC-SYN-' . $dateFormatted . '-' . Str::padLeft($item['row_number'], 5, '0');

                        $income = Income::create([
                            'id' => $incomeId,
                            'date' => $item['date'],
                            'customer_name' => $item['customer_name'],
                            'raw_customer_name' => $item['raw_customer_name'],
                            'water_type' => ($item['ro_quantity'] > 0 && $item['bs_quantity'] > 0)
                                ? 'Campuran (RO + Biasa)'
                                : ($item['ro_quantity'] > 0 ? 'Air RO' : 'Air Biasa (BS)'),
                            'ro_quantity' => $item['ro_quantity'],
                            'bs_quantity' => $item['bs_quantity'],
                            'ro_price' => $item['ro_price'],
                            'bs_price' => $item['bs_price'],
                            'quantity' => ($item['ro_quantity'] + $item['bs_quantity']),
                            'unit_price' => ($item['ro_quantity'] + $item['bs_quantity'] > 0)
                                ? ($item['amount'] / ($item['ro_quantity'] + $item['bs_quantity']))
                                : 0.0,
                            'amount' => $item['amount'],
                            'payment_method' => $item['payment_method'],
                            'status' => $item['status'],
                            'description' => $item['description'],
                            'data_source' => $item['data_source'],
                            'raw_reference' => $ref,
                        ]);

                        $batchImported++;
                        $batchAmount += (float) $item['amount'];
                        $totalSummary['incomes_count']++;
                        $totalSummary['incomes_amount'] += (float) $item['amount'];
                        $totalSummary['synthetic_count']++;

                        // Jika Kredit, bentuk Piutang
                        if ($item['payment_method'] === 'Kredit' && $item['amount'] > 0) {
                            $receivableId = 'RCV-SYN-' . $dateFormatted . '-' . Str::padLeft($item['row_number'], 5, '0');
                            Receivable::updateOrCreate(
                                ['raw_reference' => $ref],
                                [
                                    'id' => $receivableId,
                                    'income_id' => $income->id,
                                    'customer_name' => $item['customer_name'],
                                    'transaction_date' => $item['date'],
                                    'date' => $item['date'],
                                    'total_amount' => $item['amount'],
                                    'paid_amount' => 0.00,
                                    'remaining_amount' => $item['amount'],
                                    'status' => 'Belum Lunas',
                                    'description' => 'Piutang pemesanan kredit ' . $item['customer_name'] . ' (Baris ' . $item['row_number'] . ')',
                                    'data_source' => 'synthetic',
                                    'raw_reference' => $ref,
                                ]
                            );
                            $totalSummary['receivables_count']++;
                            $totalSummary['receivables_amount'] += (float) $item['amount'];
                        }
                    }
                } elseif ($fileType === 'pengeluaran_sintetis' || $fileType === 'pengeluaran_real') {
                    $prefix = ($dataSource === 'real') ? 'REAL' : 'SYN';
                    foreach ($itemsToImport as $item) {
                        $ref = $item['raw_reference'];

                        // Idempotensi check
                        $existing = Expense::where('raw_reference', $ref)->first();
                        if ($existing) {
                            $batchDuplicates++;
                            continue;
                        }

                        $dateFormatted = Carbon::parse($item['date'])->format('Ymd');
                        $expenseId = 'EXP-' . $prefix . '-' . $dateFormatted . '-' . Str::padLeft($item['row_number'], 5, '0');

                        Expense::create([
                            'id' => $expenseId,
                            'date' => $item['date'],
                            'category' => $item['category'],
                            'raw_jenis' => $item['raw_jenis'],
                            'amount' => $item['amount'],
                            'description' => $item['description'],
                            'data_source' => $item['data_source'],
                            'raw_reference' => $ref,
                        ]);

                        $batchImported++;
                        $batchAmount += (float) $item['amount'];
                        $totalSummary['expenses_count']++;
                        $totalSummary['expenses_amount'] += (float) $item['amount'];

                        if ($dataSource === 'real') {
                            $totalSummary['real_count']++;
                        } else {
                            $totalSummary['synthetic_count']++;
                        }
                    }
                }

                $batch->update([
                    'imported_rows' => $batchImported,
                    'total_amount' => $batchAmount,
                    'status' => 'completed',
                    'summary' => [
                        'duplicates' => $batchDuplicates,
                        'skipped' => count($itemsSkipped),
                    ],
                ]);

                DB::commit();

                $totalSummary['imported'] += $batchImported;
                $totalSummary['duplicates'] += $batchDuplicates;

                $this->info("   -> Berhasil diimpor: {$batchImported} baris (Rp " . number_format($batchAmount, 0, ',', '.') . ")");
                $this->info("   -> Dilewati (skipped): " . count($itemsSkipped) . " baris");
                if ($batchDuplicates > 0) {
                    $this->info("   -> Duplikat (teridentifikasi sebelumnya): {$batchDuplicates} baris");
                }
            } catch (\Exception $e) {
                DB::rollBack();
                $this->error("   X Gagal memproses batch {$batchId}: " . $e->getMessage());
                $totalSummary['failed'] += count($itemsToImport);
            }
        }

        $this->info("\n==========================================================");
        $this->info("          RINGKASAN AKHIR HASIL IMPORT DATASET");
        $this->info("==========================================================");
        $this->table(
            ['Metrik', 'Nilai'],
            [
                ['Total Baris Dibaca', number_format($totalSummary['total_rows_read'])],
                ['Data Berhasil Diimpor', number_format($totalSummary['imported'])],
                ['Data Dilewati (Skipped Log)', number_format($totalSummary['skipped'])],
                ['Data Duplikat', number_format($totalSummary['duplicates'])],
                ['Data Gagal', number_format($totalSummary['failed'])],
                ['Transaksi Pemasukan', number_format($totalSummary['incomes_count'])],
                ['Total Nominal Pemasukan', 'Rp ' . number_format($totalSummary['incomes_amount'], 2, ',', '.')],
                ['Transaksi Pengeluaran', number_format($totalSummary['expenses_count'])],
                ['Total Nominal Pengeluaran', 'Rp ' . number_format($totalSummary['expenses_amount'], 2, ',', '.')],
                ['Piutang Terbentuk (Kredit)', number_format($totalSummary['receivables_count'])],
                ['Total Nominal Piutang', 'Rp ' . number_format($totalSummary['receivables_amount'], 2, ',', '.')],
                ['Jumlah Data Aktual (Real)', number_format($totalSummary['real_count'])],
                ['Jumlah Data Sintetis (Synthetic)', number_format($totalSummary['synthetic_count'])],
            ]
        );

        return Command::SUCCESS;
    }
}

