const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Store the token
            window.location.href = '/recipes'; // Redirect after successful signup
        } else {
            alert('Signup failed');
        }
    })
    .catch(err => console.error(err));
});
