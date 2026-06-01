<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostCategory extends Model
{
    protected $fillable = [
        'name', 'slug', 'description',
        'thumbnail', 'order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}