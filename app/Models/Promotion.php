<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_path',
        'badge_text',
        'badge_color',
        'link',
        'is_active',
        'started_at',
        'ended_at',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->where(function (Builder $query): void {
                $query->whereNull('started_at')
                    ->orWhere('started_at', '<=', now());
            })
            ->where(function (Builder $query): void {
                $query->whereNull('ended_at')
                    ->orWhere('ended_at', '>=', now());
            });
    }
}
