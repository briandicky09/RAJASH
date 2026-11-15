<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReceivablePayment extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'receivable_id',
        'payment_date',
        'date',
        'amount',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date:Y-m-d',
            'date' => 'date:Y-m-d',
            'amount' => 'float',
        ];
    }

    public function receivable(): BelongsTo
    {
        return $this->belongsTo(Receivable::class, 'receivable_id', 'id');
    }
}
