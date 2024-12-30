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
            alert(data.message || 'Login failed');
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

    const name = document.getElementById('name').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, ingredients, instructions })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Recipe created successfully') {
            alert('Recipe created!');
            // Fetch the updated list of recipes after creation
            displayRecipes();
        } else {
            alert(data.message || 'Failed to create recipe');
        }
    })
    .catch(error => alert('Network Error: ' + error.message)); // Better error message
});

// Function to display recipes
function displayRecipes() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view recipes');
        return;
    }

    fetch('http://localhost:3000/recipes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.recipes && data.recipes.length > 0) {
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = ''; // Clear previous recipes

            // Loop through recipes and display them
            data.recipes.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.classList.add('recipe-item');
                recipeItem.innerHTML = `
                    <h3>${recipe.name}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                `;
                recipeList.appendChild(recipeItem);
            });
        } else {
            alert('No recipes found');
        }
    })
    .catch(error => alert('Network Error: ' + error.message)); // Error fetching recipes
}

// Call displayRecipes on page load to show all recipes
document.addEventListener('DOMContentLoaded', function () {
    displayRecipes();
});
