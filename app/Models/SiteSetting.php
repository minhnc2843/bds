<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group', 'label'];

    // Lấy giá trị theo key (có cache)
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting?->value ?? $default;
        });
    }

    // Cập nhật giá trị & xóa cache
    public static function set(string $key, $value): void
    {
        static::where('key', $key)->update(['value' => $value]);
        Cache::forget("setting_{$key}");
    }

    // Lấy tất cả settings theo group
    public static function getGroup(string $group): array
    {
        return Cache::remember("settings_group_{$group}", 3600, function () use ($group) {
            return static::where('group', $group)
                ->pluck('value', 'key')
                ->toArray();
        });
    }

    // Xóa cache của cả group
    public static function clearGroupCache(string $group): void
    {
        Cache::forget("settings_group_{$group}");
        // Xóa cache từng key trong group
        static::where('group', $group)->each(function ($s) {
            Cache::forget("setting_{$s->key}");
        });
    }
}