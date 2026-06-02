<?php

namespace Database\Seeders;

use App\Models\PostCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Tin tức BĐS',        'description' => 'Cập nhật tin tức thị trường bất động sản'],
            ['name' => 'Kinh nghiệm mua nhà', 'description' => 'Chia sẻ kinh nghiệm mua bán căn hộ'],
            ['name' => 'Phong thủy',          'description' => 'Phong thủy nhà ở, căn hộ'],
            ['name' => 'Pháp lý',             'description' => 'Thủ tục pháp lý mua bán bất động sản'],
            ['name' => 'Nội thất',            'description' => 'Thiết kế nội thất căn hộ đẹp'],
        ];

        foreach ($categories as $i => $cat) {
            PostCategory::create([
                'name'      => $cat['name'],
                'slug'      => Str::slug($cat['name']),
                'description' => $cat['description'],
                'order'     => $i,
                'is_active' => true,
            ]);
        }
    }
}