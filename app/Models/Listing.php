<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'province_id',
        'title',
        'description',
        'type',
        'price',
        'area',
        'address',
        'district',
        'bedrooms',
        'bathrooms',
        'floor',
        'contact_name',
        'contact_phone',
        'status',
        'expired_at',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
        'price'      => 'float',
        'area'       => 'float',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function images()
    {
        return $this->hasMany(ListingImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ListingImage::class)->where('is_primary', true);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}