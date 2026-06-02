<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title'   => 'Giới thiệu',
                'slug'    => 'gioi-thieu',
                'content' => '<h2>Về BĐSViệt</h2><p>BĐSViệt là kênh mua bán và cho thuê bất động sản uy tín hàng đầu Việt Nam...</p>',
                'seo_title' => 'Giới thiệu về BĐSViệt',
            ],
            [
                'title'   => 'Điều khoản sử dụng',
                'slug'    => 'dieu-khoan',
                'content' => '<h2>Điều khoản sử dụng</h2><p>Khi sử dụng dịch vụ của BĐSViệt, bạn đồng ý với các điều khoản sau...</p>',
                'seo_title' => 'Điều khoản sử dụng',
            ],
            [
                'title'   => 'Chính sách bảo mật',
                'slug'    => 'chinh-sach-bao-mat',
                'content' => '<h2>Chính sách bảo mật</h2><p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn...</p>',
                'seo_title' => 'Chính sách bảo mật',
            ],
        ];

        foreach ($pages as $page) {
            Page::create(array_merge($page, ['is_active' => true]));
        }
    }
}