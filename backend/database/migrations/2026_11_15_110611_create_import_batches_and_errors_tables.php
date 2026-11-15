<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('import_batches', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('filename', 255);
            $table->string('sheet_name', 100)->nullable();
            $table->string('file_type', 50); // pemasukan_sintetis, pengeluaran_sintetis, pengeluaran_real
            $table->string('data_source', 20); // synthetic, real
            $table->integer('total_rows')->default(0);
            $table->integer('imported_rows')->default(0);
            $table->integer('skipped_rows')->default(0);
            $table->integer('failed_rows')->default(0);
            $table->decimal('total_amount', 15, 2)->default(0.00);
            $table->string('status', 50)->default('completed');
            $table->json('summary')->nullable();
            $table->timestamps();
        });

        Schema::create('import_errors', function (Blueprint $table) {
            $table->id();
            $table->string('batch_id', 64)->index();
            $table->integer('row_number');
            $table->string('sheet_name', 100)->nullable();
            $table->json('raw_data')->nullable();
            $table->string('status', 50)->default('skipped'); // skipped | failed
            $table->text('reason');
            $table->timestamps();

            $table->foreign('batch_id')->references('id')->on('import_batches')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_errors');
        Schema::dropIfExists('import_batches');
    }
};
