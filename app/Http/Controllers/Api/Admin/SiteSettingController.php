<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SiteSettingController extends Controller
{
    // Lấy tất cả settings (nhóm theo group)
    public function index()
    {
        $settings = SiteSetting::all()
            ->groupBy('group')
            ->map(fn($group) =>
                $group->keyBy('key')
            );

        return response()->json($settings);
    }

    // Cập nhật nhiều settings cùng lúc
    public function update(Request $request)
    {
        $data = $request->validate([
            'settings'       => 'required|array',
            'settings.*.key' => 'required|string|exists:site_settings,key',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($data['settings'] as $item) {
            SiteSetting::set($item['key'], $item['value']);
        }

        // Clear toàn bộ cache settings
        Cache::flush();

        return response()->json([
            'message' => 'Cập nhật cài đặt thành công',
        ]);
    }

    // Upload ảnh (logo, favicon, og image)
    public function uploadImage(Request $request)
    {
        $request->validate([
            'key'   => 'required|string|exists:site_settings,key',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp,ico|max:2048',
        ]);

        $key     = $request->key;
        $oldPath = SiteSetting::get($key);

        // Xóa ảnh cũ
        if ($oldPath) {
            \Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('image')
            ->store("site/{$key}", 'public');

        SiteSetting::set($key, $path);
        Cache::forget("setting_{$key}");

        return response()->json([
            'message' => 'Upload thành công',
            'path'    => $path,
            'url'     => asset("storage/{$path}"),
        ]);
    }
}