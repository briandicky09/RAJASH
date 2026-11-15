<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receivables', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('income_id')->nullable()->index();
            $table->string('customer_name');
            $table->date('transaction_date');
            $table->date('date')->nullable();
            $table->decimal('total_amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('remaining_amount', 15, 2);
            $table->string('status')->default('Belum Lunas'); // Belum Lunas | Lunas
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('income_id')->references('id')->on('incomes')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receivables');
    }
};
