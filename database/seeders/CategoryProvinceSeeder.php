<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Province;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoryProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Căn hộ chung cư',
            'Căn hộ studio',
            'Căn hộ mini',
            'Penthouse',
            'Duplex',
        ];

        foreach ($categories as $name) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }

        $provinces = [
            'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng',
            'Hải Phòng', 'Cần Thơ', 'Bình Dương',
            'Đồng Nai', 'Khánh Hòa',
        ];

        foreach ($provinces as $name) {
            Province::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }
    }
}