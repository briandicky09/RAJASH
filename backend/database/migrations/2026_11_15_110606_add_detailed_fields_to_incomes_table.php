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
        Schema::table('incomes', function (Blueprint $table) {
            $table->string('raw_customer_name')->nullable()->after('customer_name');
            $table->decimal('ro_quantity', 8, 2)->default(0)->after('water_type');
            $table->decimal('bs_quantity', 8, 2)->default(0)->after('ro_quantity');
            $table->decimal('ro_price', 12, 2)->default(5000.00)->after('bs_quantity');
            $table->decimal('bs_price', 12, 2)->default(4000.00)->after('ro_price');
            $table->string('data_source', 20)->default('application')->index()->after('description');
            $table->string('raw_reference', 100)->nullable()->index()->after('data_source');
        });

        // Ubah kolom quantity menjadi DECIMAL agar mendukung desimal (misal 2.5 atau 3.5)
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE incomes MODIFY quantity DECIMAL(8, 2) DEFAULT 1');
        } else {
            Schema::table('incomes', function (Blueprint $table) {
                $table->decimal('quantity', 8, 2)->default(1)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->dropColumn([
                'raw_customer_name',
                'ro_quantity',
                'bs_quantity',
                'ro_price',
                'bs_price',
                'data_source',
                'raw_reference',
            ]);
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE incomes MODIFY quantity INT DEFAULT 1');
        } else {
            Schema::table('incomes', function (Blueprint $table) {
                $table->integer('quantity')->default(1)->change();
            });
        }
    }
};
