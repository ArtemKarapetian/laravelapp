<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Product;
use App\Models\User;

class OrderResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        $product_name = Product::find($this->product_id)->name;
        $user_name = User::find($this->user_id)->name;

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'order_date' => $this->order_date,
            'quantity' => $this->quantity,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'product_name' => $product_name,
            'user_id' => $this->user_id,
            'user_name' => $user_name,
        ];
    }
}
