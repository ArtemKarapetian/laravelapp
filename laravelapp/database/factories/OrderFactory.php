<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'order_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'product_id' => function () {
                return \App\Models\Product::inRandomOrder()->first()->id;
            },
            'quantity' => $this->faker->numberBetween(1, 10),
            'user_id' => $this->faker->numberBetween(170, 200),
        ];
    }
}
