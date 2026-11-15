<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Income extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'date',
        'customer_name',
        'raw_customer_name',
        'water_type',
        'ro_quantity',
        'bs_quantity',
        'ro_price',
        'bs_price',
        'quantity',
        'unit_price',
        'amount',
        'payment_method',
        'status',
        'description',
        'data_source',
        'raw_reference',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'quantity' => 'float',
            'ro_quantity' => 'float',
            'bs_quantity' => 'float',
            'ro_price' => 'float',
            'bs_price' => 'float',
            'unit_price' => 'float',
            'amount' => 'float',
        ];
    }

    /**
     * Accessor cerdas untuk water_type demi kompatibilitas penuh dengan frontend React
     */
    public function getWaterTypeAttribute($value)
    {
        if (!empty($value) && $value !== 'Air Mineral' && $value !== 'Air RO') {
            return $value;
        }

        $ro = (float) ($this->attributes['ro_quantity'] ?? 0);
        $bs = (float) ($this->attributes['bs_quantity'] ?? 0);

        if ($ro > 0 && $bs > 0) {
            return 'Campuran (RO + Biasa)';
        } elseif ($ro > 0) {
            return 'Air RO';
        } elseif ($bs > 0) {
            return 'Air Biasa (BS)';
        }

        return $value ?: 'Air Biasa (BS)';
    }

    /**
     * Accessor quantity untuk mengakomodasi total galon (RO + BS)
     */
    public function getQuantityAttribute($value)
    {
        $ro = (float) ($this->attributes['ro_quantity'] ?? 0);
        $bs = (float) ($this->attributes['bs_quantity'] ?? 0);
        $sum = $ro + $bs;

        if ($sum > 0) {
            return $sum;
        }

        return (float) ($value ?? 0);
    }

    public function receivable(): HasOne
    {
        return $this->hasOne(Receivable::class, 'income_id', 'id');
    }
}
