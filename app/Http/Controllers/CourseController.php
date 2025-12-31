<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    // GET /api/courses
    public function index() {
        return Course::all();
    }

    // ✅ NEW: Get Single Course (For Dashboard Title)
    public function show($id) {
        return Course::findOrFail($id);
    }

    // POST /api/courses
    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'file' => 'nullable|file|max:20480', // 20MB
            'themeColor' => 'nullable|string'
        ]);

        try {
            $path = null;
            if($request->hasFile('file')) {
                $path = $request->file('file')->store('courses', 'public');
            }

            $course = Course::create([
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => $path, 
                'theme_color' => $request->themeColor ?? '#3182ce'
            ]);

            return response()->json(['message' => 'Course created', 'course' => $course], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }

    // PUT /api/courses/{id}
    public function update(Request $request, $id) {
        $course = Course::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'file' => 'nullable|file|max:20480',
            'themeColor' => 'nullable|string'
        ]);

        try {
            if ($request->hasFile('file')) {
                if ($course->file_path && Storage::disk('public')->exists($course->file_path)) {
                    Storage::disk('public')->delete($course->file_path);
                }
                $course->file_path = $request->file('file')->store('courses', 'public');
            }

            $course->title = $request->title;
            $course->description = $request->description;
            $course->theme_color = $request->themeColor ?? $course->theme_color;
            $course->save();

            return response()->json(['message' => 'Course updated', 'course' => $course]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Update Error: ' . $e->getMessage()], 500);
        }
    }

    // DELETE /api/courses/{id}
    public function destroy($id) {
        $course = Course::findOrFail($id);
        if ($course->file_path) {
            Storage::disk('public')->delete($course->file_path);
        }
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}