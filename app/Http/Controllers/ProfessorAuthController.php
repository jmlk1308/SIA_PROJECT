<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Notification; // Reusing from Admin turn
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfessorAuthController extends Controller
{
    // Login is handled by the shared AuthController created previously, 
    // but we need a specific Profile Update for Professors.

    public function updateProfile(Request $request) {
        $user = auth()->user();

        $request->validate([
            'email' => 'email|unique:users,email,'.$user->id,
            'password' => 'nullable|min:6'
        ]);

        if($request->has('fullName')) {
            // Assuming you added 'full_name' column, otherwise store in username or separate table
             $user->username = $request->fullName; 
        }
        
        $user->email = $request->email;
        $user->phone_number = $request->phone;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // NOTIFY ADMIN
        $admins = User::where('role', 'admin')->get();
        foreach($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Professor Profile Update',
                'message' => "Professor {$user->username} updated their profile.",
                'type' => 'system'
            ]);
        }

        return response()->json(['message' => 'Profile updated successfully']);
    }
}