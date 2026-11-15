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
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('raw_jenis')->nullable()->after('category');
            $table->string('data_source', 20)->default('application')->index()->after('description');
            $table->string('raw_reference', 100)->nullable()->index()->after('data_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn([
                'raw_jenis',
                'data_source',
                'raw_reference',
            ]);
        });
    }
};
