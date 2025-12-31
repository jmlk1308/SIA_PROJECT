<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;

class AIService {
    public function gradeEssay($question, $answer) {
        // Mock Response if no API Key (Prevent Crash)
        if (!env('OPENAI_API_KEY')) {
            return ['score' => 85, 'feedback' => 'AI Grading Simulated: Good job!'];
        }
        // Real Logic ...
        return ['score' => 0, 'feedback' => 'Check API Key'];
    }
}