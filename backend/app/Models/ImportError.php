<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportError extends Model
{
    use HasFactory;

    protected $fillable = [
        'batch_id',
        'row_number',
        'sheet_name',
        'raw_data',
        'status',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'row_number' => 'integer',
            'raw_data' => 'array',
        ];
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(ImportBatch::class, 'batch_id', 'id');
    }
}

