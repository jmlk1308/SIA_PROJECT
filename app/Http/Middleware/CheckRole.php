<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($request->user()->role !== $role) {
            return response()->json(['message' => 'Access Denied. You do not have the required role.'], 403);
        }

        return $next($request);
    }
}