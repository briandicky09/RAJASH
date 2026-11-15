<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Receivable extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'income_id',
        'customer_name',
        'transaction_date',
        'date',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'status',
        'description',
        'data_source',
        'raw_reference',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date:Y-m-d',
            'date' => 'date:Y-m-d',
            'total_amount' => 'float',
            'paid_amount' => 'float',
            'remaining_amount' => 'float',
        ];
    }

    public function income(): BelongsTo
    {
        return $this->belongsTo(Income::class, 'income_id', 'id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(ReceivablePayment::class, 'receivable_id', 'id')->orderBy('payment_date', 'asc');
    }
}
