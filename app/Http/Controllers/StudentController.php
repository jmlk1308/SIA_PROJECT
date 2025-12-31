<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\User;
use App\Models\Notification;
use App\Models\QuizAttempt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    // 1. DASHBOARD STATS
    public function dashboardStats() {
        $studentId = auth()->id();
        return response()->json([
            'enrolled_subjects' => Subject::count(),
            'completed_quizzes' => QuizAttempt::where('student_id', $studentId)->count(),
            'pending_tasks' => 0 
        ]);
    }

    // 2. GET ENROLLED SUBJECTS (✅ UPDATED TO FILTER BY COURSE)
    public function enrolledSubjects(Request $request) {
        $query = Subject::with('course');

        // Check if frontend sent a 'course_id' filter
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        return $query->get();
    }

    // 3. ROADMAP
    public function getRoadmap($subjectId) {
        $lessons = Lesson::where('subject_id', $subjectId)
            ->select('id', 'title', 'module_name', 'created_at')
            ->get()
            ->map(function($item) { 
                $item->type = 'lesson'; 
                $item->status = 'unlocked'; 
                return $item; 
            });

        $quizzes = Quiz::where('subject_id', $subjectId)
            ->select('id', 'title', 'created_at')
            ->get()
            ->map(function($item) { 
                $item->type = 'quiz'; 
                $item->module_name = 'Assessment'; 
                $item->status = 'unlocked';
                return $item; 
            });

        return response()->json($lessons->concat($quizzes)->sortBy('created_at')->values());
    }

    // 4. GET SUBJECT MATERIALS
    public function getSubjectMaterials($subjectId) {
        $lessons = Lesson::where('subject_id', $subjectId)->get()->map(function($l) {
            $ext = strtolower(pathinfo($l->file_path, PATHINFO_EXTENSION));
            $type = 'document'; 
            if (in_array($ext, ['mp4', 'mov', 'avi', 'mkv', 'webm'])) { $type = 'video'; } 
            elseif ($ext === 'pdf') { $type = 'pdf'; } 
            elseif (in_array($ext, ['ppt', 'pptx'])) { $type = 'ppt'; }

            return [
                'id' => $l->id,
                'title' => $l->title,
                'filePath' => $l->file_path,
                'type' => $type,
                'module' => $l->module_name,
                'created_at' => $l->created_at
            ];
        });

        $quizzes = Quiz::where('subject_id', $subjectId)->get()->map(function($q) {
            return [
                'id' => $q->id,
                'title' => $q->title,
                'filePath' => '',
                'type' => 'quiz',
                'module' => 'Assessment',
                'created_at' => $q->created_at
            ];
        });

        return response()->json($lessons->concat($quizzes));
    }

    // 5. PROFILE UPDATE
    public function updateProfile(Request $request) {
        $user = auth()->user();
        $request->validate([
            'email' => 'email|unique:users,email,'.$user->id,
            'password' => 'nullable|min:6',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($user->profile_image) Storage::disk('public')->delete($user->profile_image);
            $user->profile_image = $request->file('image')->store('profiles', 'public');
        }

        if ($request->has('username')) $user->username = $request->username;
        if ($request->has('email')) $user->email = $request->email;
        if ($request->has('phone')) $user->phone_number = $request->phone;
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }
}