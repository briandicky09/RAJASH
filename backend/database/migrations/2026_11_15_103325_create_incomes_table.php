<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->date('date');
            $table->string('customer_name');
            $table->string('water_type')->default('Air Mineral');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('amount', 15, 2);
            $table->string('payment_method')->default('Tunai'); // Tunai | Kredit
            $table->string('status')->default('Lunas'); // Lunas | Belum Lunas
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incomes');
    }
};
