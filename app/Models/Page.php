<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'title', 'slug', 'content', 'thumbnail',
        'is_active', 'seo_title', 'seo_description',
    ];

    protected $casts = ['is_active' => 'boolean'];
}