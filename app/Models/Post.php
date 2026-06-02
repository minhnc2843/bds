<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id', 'post_category_id', 'title', 'slug',
        'excerpt', 'content', 'thumbnail', 'status',
        'is_featured', 'view_count', 'tags',
        'seo_title', 'seo_description', 'published_at',
    ];

    protected $casts = [
        'tags'         => 'array',
        'is_featured'  => 'boolean',
        'published_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(PostCategory::class, 'post_category_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Scope: chỉ lấy bài đã publish
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                  ->orWhere('published_at', '<=', now());
            });
    }

    // Tăng view count
    public function incrementView()
    {
        $this->increment('view_count');
    }
}