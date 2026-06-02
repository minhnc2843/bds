<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
class Listing extends Model
{
     use Searchable;
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
    public function searchableAs(): string
    {
        return 'listings';
    }
     // Dữ liệu đưa vào index
    public function toSearchableArray(): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'address'     => $this->address,
            'district'    => $this->district,
            'type'        => $this->type,
            'status'      => $this->status,
            'price'       => (float) $this->price,
            'area'        => (float) $this->area,
            'bedrooms'    => (int) $this->bedrooms,
            'bathrooms'   => (int) $this->bathrooms,
            'category_id' => $this->category_id,
            'province_id' => $this->province_id,
            'created_at'  => $this->created_at?->timestamp,
        ];
    }
     public function shouldBeSearchable(): bool
    {
        return $this->status === 'active';
    }
}