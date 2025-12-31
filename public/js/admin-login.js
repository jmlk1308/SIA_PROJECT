document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const msgDiv = document.getElementById('responseMessage');
            const btn = document.querySelector('.login-btn');

            // UI Loading State
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            btn.disabled = true;
            if(msgDiv) msgDiv.style.display = 'none';

            try {
                // 1. Attempt Login
                const response = await fetch('http://127.0.0.1:8000/api/auth/admin/login', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                // 2. Handle Success
                if (response.ok && data.success) {
                    localStorage.setItem('auth_token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirect based on actual role to prevent wrong portal access
                    if(data.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        throw new Error("Access Denied: You are not an Admin.");
                    }
                } else {
                    throw new Error(data.message || 'Invalid credentials');
                }
            } catch (error) {
                console.error('Login error:', error);
                if(msgDiv) {
                    msgDiv.innerText = error.message;
                    msgDiv.style.display = 'block';
                    msgDiv.style.color = 'red';
                }
                alert(error.message);
            } finally {
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
            }
        });
    }
});