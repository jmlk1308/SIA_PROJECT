<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Storage; // ✅ CRITICAL: Required for file deletion

class LessonController extends Controller
{
    // --- 1. GET ALL LESSONS ---
    public function index(Request $request) {
        $query = Lesson::with('subject'); // Eager load subject name
        
        if($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        
        return $query->orderBy('created_at', 'desc')->get();
    }

    // --- 2. UPLOAD LESSON ---
    public function store(Request $request) {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'module_name' => 'required|string',
            'file' => 'required|mimes:pdf,ppt,pptx,doc,docx,mp4,mov|max:51200' // 50MB Max
        ]);

        try {
            // Upload File
            $path = $request->file('file')->store('lessons', 'public');
            $extension = $request->file('file')->getClientOriginalExtension();
            $type = in_array(strtolower($extension), ['mp4', 'mov']) ? 'video' : 'document';

            // Create Record
            $lesson = Lesson::create([
                'subject_id' => $request->subject_id,
                'title' => $request->title,
                'module_name' => $request->module_name,
                'file_path' => $path,
                'file_type' => $type
            ]);

            // Notify Students
            $this->notifyStudents($lesson, "New Lesson: {$lesson->title}");

            return response()->json(['message' => 'Lesson uploaded successfully', 'lesson' => $lesson], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    // --- 3. UPDATE LESSON (New!) ---
    public function update(Request $request, $id) {
        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'module_name' => 'required|string',
            'file' => 'nullable|mimes:pdf,ppt,pptx,doc,docx,mp4,mov|max:51200'
        ]);

        try {
            // Handle File Replacement
            if ($request->hasFile('file')) {
                // 1. Delete old file from disk
                if ($lesson->file_path && Storage::disk('public')->exists($lesson->file_path)) {
                    Storage::disk('public')->delete($lesson->file_path);
                }

                // 2. Upload new file
                $path = $request->file('file')->store('lessons', 'public');
                $extension = $request->file('file')->getClientOriginalExtension();
                $type = in_array(strtolower($extension), ['mp4', 'mov']) ? 'video' : 'document';

                // 3. Update file info
                $lesson->file_path = $path;
                $lesson->file_type = $type;
            }

            // Update Text Fields
            $lesson->update([
                'subject_id' => $request->subject_id,
                'title' => $request->title,
                'module_name' => $request->module_name
            ]);

            return response()->json(['message' => 'Lesson updated successfully', 'lesson' => $lesson]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    // --- 4. DELETE LESSON (New!) ---
    public function destroy($id) {
        $lesson = Lesson::findOrFail($id);

        // Delete file from storage folder to save space
        if ($lesson->file_path && Storage::disk('public')->exists($lesson->file_path)) {
            Storage::disk('public')->delete($lesson->file_path);
        }

        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted successfully']);
    }

    // Helper function to notify students
    private function notifyStudents($item, $message) {
        // In a real app, filtering by enrolled students is better. 
        // For now, we notify all students.
        $students = User::where('role', 'student')->get();
        foreach($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'title' => 'New Content Uploaded',
                'message' => $message,
                'type' => 'lesson'
            ]);
        }
    }
}