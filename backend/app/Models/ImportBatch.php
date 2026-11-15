<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ImportBatch extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'filename',
        'sheet_name',
        'file_type',
        'data_source',
        'total_rows',
        'imported_rows',
        'skipped_rows',
        'failed_rows',
        'total_amount',
        'status',
        'summary',
    ];

    protected function casts(): array
    {
        return [
            'total_rows' => 'integer',
            'imported_rows' => 'integer',
            'skipped_rows' => 'integer',
            'failed_rows' => 'integer',
            'total_amount' => 'float',
            'summary' => 'array',
        ];
    }

    public function errors(): HasMany
    {
        return $this->hasMany(ImportError::class, 'batch_id', 'id');
    }
}

