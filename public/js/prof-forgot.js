document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const resetButton = document.getElementById('resetButton');
    
    // ✅ FIX: Correct Backend URL
    const API_BASE_URL = "http://127.0.0.1:8000/api";

    resetForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const identifier = document.getElementById('identifier').value.trim();

        if (!identifier) {
            alert('Please enter your email address');
            return;
        }

        resetButton.disabled = true;
        resetButton.innerHTML = '<div class="spinner"></div> Sending...';

        try {
            // Ensure you have this route in api.php (Public Routes)
            const response = await fetch(`${API_BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: identifier // Backend usually expects 'email'
                })
            });

            if (response.ok) {
                alert('If this email exists, a reset link has been sent.');
                resetForm.reset();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to send reset link');
            }
        } catch (error) {
            console.error('Reset request error:', error);
            alert('Network error. Please check your connection.');
        } finally {
            resetButton.disabled = false;
            resetButton.innerHTML = 'Send Reset Link <i class="fas fa-paper-plane"></i>';
        }
    });
});