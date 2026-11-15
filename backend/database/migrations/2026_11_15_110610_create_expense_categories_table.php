<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->text('description')->nullable();
            $table->boolean('is_default')->default(true);
            $table->timestamps();
        });

        // Kategori awal yang disetujui
        $now = now();
        $categories = [
            // 6 Kategori Default SRS/PRD
            ['name' => 'BBM Becak', 'description' => 'Biaya bahan bakar pertalite untuk armada becak pengantaran.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Servis Kendaraan', 'description' => 'Perawatan rutin, penyetelan rantai, rem, dan servis mesin becak motor.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Penggantian Oli', 'description' => 'Penggantian pelumas mesin berkala armada pengantaran.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Perbaikan Ban', 'description' => 'Tambal ban bocor, pembelian ban dalam atau luar armada becak.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pembelian Pasokan Air', 'description' => 'Pasokan air baku pegunungan tangki utama depot.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Lainnya', 'description' => 'Pengeluaran operasional lain yang tidak masuk kategori utama.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            // 3 Kategori Tambahan Sesuai Analisis Dataset Aktual
            ['name' => 'Gaji Karyawan', 'description' => 'Upah harian/mingguan karyawan operasional depot (Kevin dll).', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Listrik & PDAM', 'description' => 'Pembelian token listrik dan tagihan suplai PDAM depot.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Operasional Depot', 'description' => 'Perlengkapan depot: tutup galon RO, tisu pembersih, stop keran, saringan filter, servis pompa air.', 'is_default' => true, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('expense_categories')->insert($categories);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_categories');
    }
};
