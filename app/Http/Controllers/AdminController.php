<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // ==========================================
    // 1. USER MANAGEMENT
    // ==========================================

    /**
     * Get all users.
     */
    public function getUsers() {
        return User::orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new user (Student, Professor, or Admin).
     */
    public function createUser(Request $request) {
        // 1. Validate Input
        $request->validate([
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,professor,student',
            'courseId' => 'nullable|exists:courses,id' // Validates if course exists (for Professors)
        ]);

        // 2. Create the User
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'course_id' => $request->courseId, // ✅ This saves the assigned course
            'must_change_password' => true,    // Force password change on first login
        ]);

        // 3. Log the Activity
        $this->logAction('Created Account', "Created user: {$user->username} ({$user->role})");

        return response()->json(['message' => 'User created successfully', 'user' => $user]);
    }

    /**
     * Delete a user.
     */
    public function deleteUser($id) {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $username = $user->username;
        $user->delete();

        $this->logAction('Deleted Account', "Deleted user: {$username}");

        return response()->json(['message' => 'User deleted successfully']);
    }

    // ==========================================
    // 2. ACTIVITY LOGS
    // ==========================================

    /**
     * Get all activity logs with user details.
     */
    public function getLogs() {
        // Joins with users table to show who performed the action
        return ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'username' => $log->user ? $log->user->username : 'Unknown', // Handle deleted users
                    'role' => $log->user ? $log->user->role : '-',
                    'action' => $log->action,
                    'details' => $log->details,
                    'timestamp' => $log->created_at->format('Y-m-d H:i:s'),
                ];
            });
    }

    /**
     * Export logs to a CSV file.
     */
    public function exportLogs() {
        $logs = ActivityLog::with('user')->orderBy('created_at', 'desc')->get();
        $filename = "activity_logs_" . date('Y-m-d') . ".csv";

        // Create CSV in memory
        $callback = function() use ($logs) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'User', 'Role', 'Action', 'Details', 'Timestamp']); // Headers

            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->user ? $log->user->username : 'Unknown',
                    $log->user ? $log->user->role : '-',
                    $log->action,
                    $log->details,
                    $log->created_at
                ]);
            }
            fclose($file);
        };

        // Return stream response
        return response()->stream($callback, 200, [
            "Content-Type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }

    // ==========================================
    // 3. PROFILE MANAGEMENT
    // ==========================================

    /**
     * Get current admin profile.
     */
    public function getProfile() {
        $user = auth()->user();
        return response()->json([
            'username' => $user->username,
            'email' => $user->email,
            'phone' => $user->phone_number,
            'role' => $user->role,
            'profilePicture' => $user->profile_image // Returns path like "uploads/xyz.jpg"
        ]);
    }

    /**
     * Update admin profile details.
     */
    public function updateProfile(Request $request) {
        $user = auth()->user();

        $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'fullName' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        // If you are using 'username' as 'Full Name' in frontend
        if ($request->has('fullName')) {
            $user->username = $request->fullName;
        }

        $user->email = $request->email;
        $user->phone_number = $request->phone; // Ensure DB column is 'phone_number'
        $user->save();

        $this->logAction('Updated Profile', "Admin updated their profile details.");

        return response()->json(['message' => 'Profile updated successfully']);
    }

    /**
     * Upload Profile Picture.
     */
    public function uploadProfilePicture(Request $request) {
        $request->validate([
            'file' => 'required|image|max:2048' // Max 2MB, must be image
        ]);

        $user = auth()->user();

        // 1. Delete old image if it exists and isn't a default
        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
        }

        // 2. Store new image
        // Stores in "storage/app/public/uploads"
        $path = $request->file('file')->store('uploads', 'public');

        // 3. Update User DB
        $user->profile_image = $path;
        $user->save();

        $this->logAction('Updated Profile Picture', "User uploaded a new profile picture.");

        return response()->json(['message' => 'Profile picture uploaded', 'path' => $path]);
    }

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    /**
     * Helper to log actions to the database.
     */
    private function logAction($action, $details) {
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'details' => $details
        ]);
    }
}