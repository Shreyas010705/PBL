// EmailJS initialization
emailjs.init("d51a2dBn9p9oD4LIU");  // Your EmailJS public key

const ACCESS_KEY = "Atlas"; // The required access key

// DOM references
const loginForm = document.getElementById('loginForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const resetEmailInput = document.getElementById('resetEmail');
const errorMessage = document.getElementById('error-message');
const accessModal = document.getElementById('accessModal');
const accessCodeInput = document.getElementById('accessCodeInput');

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Make an API call to backend server to validate login
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            // Response not OK (e.g., 401 Unauthorized)
            return response.json().then(data => {
                throw new Error(data.message || 'Server error.');
            });
        }
        return response.json();
    })
    .then(data => {
        // Successful login
        if (data.message === 'Login successful') {
            showAccessModal();
        }
    })
    .catch(error => {
        console.error("Login error:", error.message);
        errorMessage.textContent = error.message;  // Show the exact message (like "Email or password is incorrect.")
        errorMessage.style.display = "block";      // Make the error message visible

        // Optionally hide the error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 5000);  // Hide after 5 seconds
    });
});

// Handle forgot password form submission
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const resetEmail = resetEmailInput.value;

    // Sending email through EmailJS
    emailjs.send("service_86xrur5", "template_0tu98ym", {
        from_email: resetEmail,
        to_email: "AtlasMind1412@gmail.com",
        subject: "Password Reset Request",
        message: `User with email ${resetEmail} has requested a password reset.`
    })
    .then(() => {
        alert("Password reset request sent successfully.");
        forgotPasswordForm.reset();
    })
    .catch(error => {
        console.error("Error sending email:", error);
        alert("Failed to send password reset request.");
    });
});

// Toggle between login and forgot password forms
document.getElementById('showForgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    forgotPasswordForm.style.display = 'block';
});

document.getElementById('showLoginForm').addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Show the modal for access code
function showAccessModal() {
    accessCodeInput.value = "";
    accessModal.style.display = 'flex';
    accessCodeInput.focus();
}

// Hide modal and return to login page
function cancelAccessCode() {
    accessModal.style.display = 'none';
    window.location.href = "AtlasLogin.html";
}

// Verify the access code entered in modal
function verifyAccessCode() {
    const enteredCode = accessCodeInput.value;
    if (enteredCode === ACCESS_KEY) {
        window.location.href = "AtlasHome.html";
    } else {
        alert("Incorrect access key. Returning to Login Page.");
        cancelAccessCode();
    }
}

// Expose to global so buttons can call them
window.verifyAccessCode = verifyAccessCode;
window.cancelAccessCode = cancelAccessCode;
