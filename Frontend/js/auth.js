/**
 * Smart Hostel Issue Tracker - Auth Logic
 * Handles mock login, role assignment, and redirection.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    loginForm.addEventListener('submit', (e) => {
        // 1. Prevent the default form submission (page reload)
        e.preventDefault();

        // 2. Get input values
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('password').value;

        // Visual feedback (Loading state)
        loginBtn.innerText = "Authenticating...";
        loginBtn.style.opacity = "0.7";
        loginBtn.disabled = true;

        // 3. Mock Authentication Logic (Simulating a brief delay)
        setTimeout(() => {
            let userRole = '';

            // Check if email contains "admin"
            if (email.includes('admin')) {
                userRole = 'admin';
            } else {
                userRole = 'student';
            }

            // 4. Store role in localStorage for persistent access across pages
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('isLoggedIn', 'true');

            // 5. Redirect based on role
            console.log(`Login successful as: ${userRole}`);
            
            if (userRole === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'student/dashboard.html';
            }

        }, 1200); // 1.2 second delay for that "real" system feel
    });
});