const API_BASE_URL = 'http://localhost:4000/api';
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (errorMessage)
            errorMessage.textContent = '';
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        if (!usernameInput || !passwordInput) {
            if (errorMessage)
                errorMessage.textContent = 'Form elements are missing.';
            return;
        }
        const username = usernameInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                // Login successful, redirect to the main dashboard
                window.location.href = '/';
            }
            else {
                const err = await response.json();
                if (errorMessage)
                    errorMessage.textContent = err.error || 'Login failed.';
            }
        }
        catch (error) {
            console.error("Login request failed:", error);
            if (errorMessage)
                errorMessage.textContent = 'An error occurred. Please try again.';
        }
    });
}
export {};
//# sourceMappingURL=login.js.map