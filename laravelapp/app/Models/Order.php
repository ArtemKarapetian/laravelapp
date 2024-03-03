<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'order_date',
        'product_id',
        'quantity',
    ];

    protected $dates = [
        'order_date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
