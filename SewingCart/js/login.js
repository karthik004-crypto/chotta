// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Form Validation and Submission
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        try {
            // Here you would typically make an API call to your backend
            // For demo purposes, we'll simulate a successful login
            const response = await simulateLogin(email, password);
            
            if (response.success) {
                // Store auth token
                localStorage.setItem('authToken', response.token);
                
                // If remember me is checked, store user info
                if (remember) {
                    localStorage.setItem('userEmail', email);
                }

                // Get return URL from query parameters
                const urlParams = new URLSearchParams(window.location.search);
                const returnUrl = urlParams.get('returnUrl');

                // Redirect to return URL or home page
                window.location.href = returnUrl || 'index.html';
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    // Check for stored email if remember me was checked
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
        document.getElementById('email').value = storedEmail;
        document.querySelector('input[name="remember"]').checked = true;
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Here you would typically send the data to your backend
    console.log('Registration attempt:', { name, email, password });
    
    // For demo purposes, we'll just show the profile section
    showProfileSection();
});

// Profile Section
function showProfileSection() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.profile-container').style.display = 'block';
    
    // Populate profile information
    const name = document.getElementById('registerName').value || 'John Doe';
    const email = document.getElementById('registerEmail').value || 'john.doe@example.com';
    
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
}

// Address Form Submission
const addressForm = document.querySelector('.address-form');
const saveAddressBtn = document.querySelector('.save-address-btn');

saveAddressBtn.addEventListener('click', () => {
    const addressLine1 = document.getElementById('addressLine1').value;
    const addressLine2 = document.getElementById('addressLine2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;
    const country = document.getElementById('country').value;
    
    if (!addressLine1 || !city || !state || !zipCode || !country) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Here you would typically send the address data to your backend
    console.log('Address saved:', {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country
    });
    
    alert('Address saved successfully!');
});

// Edit Profile Button
const editProfileBtn = document.querySelector('.edit-profile-btn');
let isEditing = false;

editProfileBtn.addEventListener('click', () => {
    const infoGroups = document.querySelectorAll('.info-group p');
    
    if (!isEditing) {
        // Switch to edit mode
        infoGroups.forEach(group => {
            const currentValue = group.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            group.parentNode.replaceChild(input, group);
        });
        
        editProfileBtn.textContent = 'Save Changes';
    } else {
        // Save changes
        infoGroups.forEach(group => {
            const input = group.parentNode.querySelector('input');
            if (input) {
                const newValue = input.value;
                const p = document.createElement('p');
                p.textContent = newValue;
                group.parentNode.replaceChild(p, input);
            }
        });
        
        editProfileBtn.textContent = 'Edit Profile';
    }
    
    isEditing = !isEditing;
});

// Simulate login API call
function simulateLogin(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // For demo purposes, accept any non-empty email and password
            if (email && password) {
                resolve({
                    success: true,
                    token: 'demo-token-' + Math.random().toString(36).substr(2)
                });
            } else {
                resolve({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        }, 1000);
    });
} 