<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\User;
use App\Models\Notification;
use App\Models\QuizAttempt;

// We use the full path in the method to avoid constructor crashes if service is missing
// use App\Services\AIService; 

class QuizController extends Controller
{
    // --- 1. GET QUIZZES ---
    public function index(Request $request) {
        // Eager load subject so we can show "BSIT" instead of "1" in the table
        $query = Quiz::with('subject');
        
        return $query->orderBy('created_at', 'desc')->get();
    }

    // --- 2. CREATE QUIZ ---
    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'question' => 'required|string', // This maps to 'essay_prompt'
        ]);

        $quiz = Quiz::create([
            'title' => $request->title,
            'subject_id' => $request->subject_id,
            'essay_prompt' => $request->question,
            'is_ai_graded' => true,
            'professor_id' => auth()->id() ?? 1
        ]);

        // Send Notification
        $this->notifyStudents("New Quiz: " . $quiz->title);

        return response()->json(['message' => 'Quiz created successfully', 'quiz' => $quiz], 201);
    }

    // --- 3. UPDATE QUIZ ---
    public function update(Request $request, $id) {
        $quiz = Quiz::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'question' => 'required|string',
        ]);

        $quiz->update([
            'title' => $request->title,
            'subject_id' => $request->subject_id,
            'essay_prompt' => $request->question
        ]);

        return response()->json(['message' => 'Quiz updated successfully', 'quiz' => $quiz]);
    }

    // --- 4. DELETE QUIZ ---
    public function destroy($id) {
        $quiz = Quiz::findOrFail($id);
        $quiz->delete();
        return response()->json(['message' => 'Quiz deleted successfully']);
    }

    // --- 5. SUBMIT & GRADE ESSAY ---
    public function submitEssay(Request $request) {
        $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'answer' => 'required|string|min:10'
        ]);

        $quiz = Quiz::find($request->quiz_id);

        // ✅ SAFER INSTANTIATION
        // Only try to load AI service here. If class is missing, we handle it.
        if (class_exists(\App\Services\AIService::class)) {
            $aiService = new \App\Services\AIService(); 
            $grading = $aiService->gradeEssay($quiz->essay_prompt, $request->answer);
        } else {
            // Fallback if AI Service is missing
            $grading = [
                'score' => 0, 
                'feedback' => 'AI Service not available. Please contact admin.'
            ];
        }

        // Save Attempt
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => auth()->id(),
            'student_answer' => $request->answer,
            'score' => $grading['score'],
            'ai_feedback' => $grading['feedback']
        ]);

        return response()->json([
            'message' => 'Quiz graded successfully',
            'result' => $attempt
        ]);
    }

    private function notifyStudents($message) {
        $students = User::where('role', 'student')->get();
        foreach($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'title' => 'Quiz Alert',
                'message' => $message,
                'type' => 'quiz'
            ]);
        }
    }
}