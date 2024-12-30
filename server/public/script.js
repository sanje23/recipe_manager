// Handle Login form submission
document.getElementById('login-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'create_recipe.html'; // Redirect to create recipe page
        } else {
            alert(data.message || 'Login failed'); // Show specific message from backend
        }
    })
    .catch(error => alert('Network Error: ' + error.message)); // Better error message
});

// Handle Register form submission
document.getElementById('register-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User created successfully') {
            alert('Registration successful');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert(data.message || 'Registration failed');
        }
    })
    .catch(error => alert('Network Error: ' + error.message)); // Better error message
});

// Handle Recipe form submission
document.getElementById('recipe-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to create a recipe');
        return;
    }

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    fetch('http://localhost:3000/recipes/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Recipe created successfully') {
            alert('Recipe created!');
        } else {
            alert(data.message || 'Failed to create recipe');
        }
    })
    .catch(error => alert('Network Error: ' + error.message)); // Better error message
});
