document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 

            const identifier = document.getElementById('identifier').value;
            const password = document.getElementById('password').value;
            const responseMessage = document.getElementById('responseMessage');
            const loginButton = document.getElementById('loginButton');

            if(responseMessage) responseMessage.innerText = '';
            
            // Visual Feedback
            loginButton.disabled = true;
            loginButton.innerHTML = 'Logging in...';

            try {
                // ✅ FIX: Use correct backend URL and shared login route
                // Using 'username' in body because AuthController expects 'username'
                const response = await fetch('http://127.0.0.1:8000/api/auth/admin/login', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                    },
                    body: JSON.stringify({ 
                        username: identifier, // Map 'identifier' to 'username'
                        password: password 
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Check Role
                    if(data.role !== 'professor') {
                        throw new Error("Unauthorized: You are not a professor.");
                    }

                    // Store Data
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('user', JSON.stringify({
                        id: data.user.id,
                        username: data.user.username,
                        email: data.user.email,
                        profile_image: data.profilePicture
                    }));

                    window.location.href = 'professor-dashboard.html';
                } else {
                    const msg = data.message || 'Login failed';
                    alert(msg);
                    if(responseMessage) responseMessage.innerText = msg;
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'System error. Check backend connection.');
            } finally {
                loginButton.disabled = false;
                loginButton.innerHTML = '<span>Login as Professor</span> <i class="fas fa-sign-in-alt"></i>';
            }
        });
    }
});