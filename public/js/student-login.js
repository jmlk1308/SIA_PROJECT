const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const identifier = document.getElementById('identifier').value;
            const password = document.getElementById('password').value;
            const btn = document.getElementById('loginButton');

            // UI Feedback
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            btn.disabled = true;

            try {
                // ✅ FIX 1: Send 'username' instead of 'identifier'
                // ✅ FIX 2: Add 'Accept' header to force JSON response
                const response = await fetch(`${API_BASE_URL}/auth/student/login`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                    },
                    body: JSON.stringify({ 
                        username: identifier, // Backend expects 'username'
                        password: password 
                    })
                });

                // Check if the response is actually JSON before parsing
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Server returned HTML instead of JSON. Check API route.");
                }

                const data = await response.json();

                if (response.ok && data.success) {
                    // Role Check
                    if (data.user.role !== 'student') {
                        throw new Error("Access Denied: You are not a student.");
                    }

                    // Save Token & User
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Redirect
                    if (data.must_change_password) {
                        window.location.href = 'home.html?action=change_password';
                    } else {
                        window.location.href = 'home.html';
                    }
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert(error.message);
            } finally {
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
            }
        });
    }
});