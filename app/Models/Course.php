<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'description', 
        'file_path', 
        'theme_color' // <--- This MUST be here
    ];

    public function subjects() {
        return $this->hasMany(Subject::class);
    }
}