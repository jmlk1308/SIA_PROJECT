<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    // GET /api/subjects
    public function index(Request $request) {
        $query = Subject::query();

        // ✅ FIX: Filter by course_id if provided
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        return $query->orderBy('year_level')->orderBy('semester')->get();
    }

    // POST /api/subjects
    public function store(Request $request) {
        // ✅ FIX: Validate snake_case inputs
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'code'      => 'required|string',
            'title'     => 'required|string',
            'year_level'=> 'required|integer|min:1|max:5',
            'semester'  => 'required|integer|min:1|max:3',
        ]);

        $subject = Subject::create([
            'course_id' => $request->course_id,
            'code'      => $request->code,
            'title'     => $request->title,
            'year_level'=> $request->year_level,
            'semester'  => $request->semester,
        ]);

        return response()->json(['message' => 'Subject created successfully', 'subject' => $subject], 201);
    }

    // DELETE /api/subjects/{id}
    public function destroy($id) {
        $subject = Subject::findOrFail($id);
        $subject->delete();
        return response()->json(['message' => 'Subject deleted successfully']);
    }
}