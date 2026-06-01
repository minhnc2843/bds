<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Promotion;
use App\Models\SiteSetting;

class SiteController extends Controller
{
    // Public: lấy toàn bộ config cho frontend
    public function config()
    {
        return response()->json([
            'general'  => SiteSetting::getGroup('general'),
            'contact'  => SiteSetting::getGroup('contact'),
            'seo'      => SiteSetting::getGroup('seo'),
            'social'   => SiteSetting::getGroup('social'),
            'listing'  => SiteSetting::getGroup('listing'),
            'banners'  => Banner::where('is_active', true)
                            ->orderBy('order')->get(),
            'promotions' => Promotion::active()
                            ->orderBy('order')->get(),
        ]);
    }
}