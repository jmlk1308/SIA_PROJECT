<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // ==========================================
    // 1. ADMIN & PROFESSOR LOGIN
    // ==========================================
    public function adminLogin(Request $request) {
        $loginField = filter_var($request->input('username'), FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        if (!Auth::attempt([$loginField => $request->input('username'), 'password' => $request->input('password')])) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $user = Auth::user();

        // Restrict to Admin and Professor only
        if (!in_array($user->role, ['admin', 'professor'])) {
            Auth::logout();
            return response()->json(['message' => 'Access Denied. Admins and Professors only.'], 403);
        }

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'access_token' => $token, // Common standard
            'token' => $token,        // For your specific JS
            'role' => $user->role,
            'user' => $user
        ]);
    }

    // ==========================================
    // 2. STUDENT LOGIN (✅ Added this missing method)
    // ==========================================
    public function studentLogin(Request $request) {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        // 1. Check if input is email or username
        $loginType = filter_var($request->username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // 2. Attempt Login
        if (!Auth::attempt([$loginType => $request->username, 'password' => $request->password])) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // 3. Strict Role Check
        if ($user->role !== 'student') {
            Auth::logout();
            return response()->json(['message' => 'Access Denied: You are not a student.'], 403);
        }

        // 4. Create Token
        $token = $user->createToken('student_token')->plainTextToken;

        // 5. Return Response (Matches your JS expectations)
        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $user,
            'must_change_password' => $user->must_change_password // Important for first-time login
        ]);
    }

    // ==========================================
    // 3. LOGOUT
    // ==========================================
    public function logout(Request $request) {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'Logged out successfully']);
    }

    // ==========================================
    // 4. CHANGE PASSWORD
    // ==========================================
    public function changePassword(Request $request) {
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|min:6'
        ]);
        
        $user = $request->user();

        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->password = Hash::make($request->newPassword);
        $user->must_change_password = false;
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }

    // ==========================================
    // 5. FORGOT PASSWORD (Stub)
    // ==========================================
    public function sendResetLink(Request $request) {
        $request->validate(['identifier' => 'required']);
        
        // In a real app, you would send an email here.
        // For now, we return success so the frontend UI works.
        return response()->json(['message' => 'If this email exists, a reset link has been sent.']);
    }
}