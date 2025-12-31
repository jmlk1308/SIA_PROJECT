<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request) {
        // Return notifications for the current logged in user
        return Notification::where('user_id', auth()->id())
                           ->orderBy('created_at', 'desc')
                           ->get();
    }

    public function markAsRead($id) {
        $notif = Notification::where('id', $id)->where('user_id', auth()->id())->first();
        if($notif) {
            $notif->is_read = true;
            $notif->save();
        }
        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllRead() {
        Notification::where('user_id', auth()->id())->update(['is_read' => true]);
        return response()->json(['message' => 'All marked read']);
    }
}