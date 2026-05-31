<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $fillable = ['name', 'slug'];

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }
}