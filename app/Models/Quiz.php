<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'title',
        'essay_prompt',
        'is_ai_graded',
        // 'professor_id' // Uncomment if you added this to your migration
    ];

    public function subject() {
        return $this->belongsTo(Subject::class);
    }
}