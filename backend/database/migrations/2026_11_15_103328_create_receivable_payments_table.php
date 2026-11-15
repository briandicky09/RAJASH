<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receivable_payments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('receivable_id')->index();
            $table->date('payment_date');
            $table->date('date')->nullable();
            $table->decimal('amount', 15, 2);
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('receivable_id')->references('id')->on('receivables')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receivable_payments');
    }
};
