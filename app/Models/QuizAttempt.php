<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'student_answer',
        'score',
        'ai_feedback'
    ];

    // Relationship: An attempt belongs to a Quiz
    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }

    // Relationship: An attempt belongs to a Student (User)
    public function student() {
        return $this->belongsTo(User::class, 'student_id');
    }
}