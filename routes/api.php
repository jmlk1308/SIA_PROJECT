<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfessorAuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================
Route::get('/courses', [CourseController::class, 'index']); 
Route::get('/courses/{id}', [CourseController::class, 'show']); 

Route::post('/auth/admin/login', [AuthController::class, 'adminLogin']); 
Route::post('/auth/student/login', [AuthController::class, 'studentLogin']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);

// ==========================================
// 2. PROTECTED ROUTES
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Shared Read-Only
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/lessons', [LessonController::class, 'index']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::get('/quizzes', [QuizController::class, 'index']);

    // --- ADMIN ROUTES ---
    Route::middleware('check.role:admin')->group(function () {
        Route::apiResource('courses', CourseController::class)->except(['index', 'show']); 
        Route::apiResource('subjects', SubjectController::class)->except(['index']);
        
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::post('/admin/users', [AdminController::class, 'storeUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    });

    // --- PROFESSOR ROUTES ---
    Route::middleware('check.role:professor')->group(function () {
        // ✅ FIXED: Added totalQuizzes to stats
        Route::get('/professor/stats', function() {
            return response()->json([
                'totalStudents' => \App\Models\User::where('role', 'student')->count(),
                'activeSubjects' => \App\Models\Subject::count(),
                'totalLessons' => \App\Models\Lesson::count(),
                'totalQuizzes' => \App\Models\Quiz::count(), 
            ]);
        });
        
        Route::put('/professor/profile', [ProfessorAuthController::class, 'updateProfile']);
        
        // Content Management
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
        
        Route::post('/quizzes', [QuizController::class, 'store']);
        Route::put('/quizzes/{id}', [QuizController::class, 'update']);
        Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
    });

    // --- STUDENT ROUTES ---
    Route::middleware('check.role:student')->group(function () {
        Route::get('/student/stats', [StudentController::class, 'dashboardStats']);
        Route::get('/student/subjects', [StudentController::class, 'enrolledSubjects']);
        Route::get('/student/roadmap/{subjectId}', [StudentController::class, 'getRoadmap']);
        Route::get('/student/materials/{subjectId}', [StudentController::class, 'getSubjectMaterials']);
        Route::post('/student/quiz/submit', [QuizController::class, 'submitEssay']);
        Route::post('/student/profile', [StudentController::class, 'updateProfile']);
    });
});