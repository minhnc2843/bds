<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Group: general
            ['key' => 'site_name',        'value' => 'BĐSViệt',           'type' => 'text',    'group' => 'general', 'label' => 'Tên website'],
            ['key' => 'site_slogan',      'value' => 'Tìm căn hộ phù hợp','type' => 'text',    'group' => 'general', 'label' => 'Slogan'],
            ['key' => 'site_description', 'value' => 'Kênh mua bán & cho thuê căn hộ uy tín toàn quốc', 'type' => 'text', 'group' => 'general', 'label' => 'Mô tả website'],
            ['key' => 'site_logo',        'value' => null,                 'type' => 'image',   'group' => 'general', 'label' => 'Logo'],
            ['key' => 'site_favicon',     'value' => null,                 'type' => 'image',   'group' => 'general', 'label' => 'Favicon'],
            ['key' => 'site_footer_text', 'value' => '© 2025 BĐSViệt. All rights reserved.', 'type' => 'text', 'group' => 'general', 'label' => 'Text footer'],

            // Group: contact
            ['key' => 'contact_address',  'value' => '123 Đường Láng, Hà Nội',   'type' => 'text',    'group' => 'contact', 'label' => 'Địa chỉ'],
            ['key' => 'contact_phone',    'value' => '1800 1234',                 'type' => 'text',    'group' => 'contact', 'label' => 'Hotline'],
            ['key' => 'contact_email',    'value' => 'contact@bdsviet.com',       'type' => 'text',    'group' => 'contact', 'label' => 'Email liên hệ'],
            ['key' => 'contact_map_embed','value' => null,                        'type' => 'text',    'group' => 'contact', 'label' => 'Google Maps Embed URL'],
            ['key' => 'working_hours',    'value' => 'T2-T6: 8:00 - 17:30',      'type' => 'text',    'group' => 'contact', 'label' => 'Giờ làm việc'],

            // Group: seo
            ['key' => 'seo_title',        'value' => 'BĐSViệt - Mua bán & Cho thuê căn hộ',   'type' => 'text', 'group' => 'seo', 'label' => 'SEO Title'],
            ['key' => 'seo_keywords',     'value' => 'bất động sản, mua bán căn hộ, cho thuê', 'type' => 'text', 'group' => 'seo', 'label' => 'SEO Keywords'],
            ['key' => 'seo_og_image',     'value' => null,                                      'type' => 'image','group' => 'seo', 'label' => 'OG Image (share mạng xã hội)'],

            // Group: social
            ['key' => 'social_facebook',  'value' => 'https://facebook.com', 'type' => 'text', 'group' => 'social', 'label' => 'Facebook'],
            ['key' => 'social_zalo',      'value' => null,                   'type' => 'text', 'group' => 'social', 'label' => 'Zalo'],
            ['key' => 'social_youtube',   'value' => null,                   'type' => 'text', 'group' => 'social', 'label' => 'YouTube'],
            ['key' => 'social_tiktok',    'value' => null,                   'type' => 'text', 'group' => 'social', 'label' => 'TikTok'],

            // Group: listing config
            ['key' => 'listing_expire_days', 'value' => '30',   'type' => 'text', 'group' => 'listing', 'label' => 'Số ngày tin hiển thị'],
            ['key' => 'listing_per_page',    'value' => '12',   'type' => 'text', 'group' => 'listing', 'label' => 'Số tin mỗi trang'],
            ['key' => 'maintenance_mode',    'value' => 'false', 'type' => 'boolean', 'group' => 'general', 'label' => 'Chế độ bảo trì'],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}