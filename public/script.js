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
    .catch(error => alert('Network Error: ' + error.message));
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
    .catch(error => alert('Network Error: ' + error.message));
});

// Handle Recipe form submission
document.getElementById('recipe-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to create a recipe');
        return;
    }

    const recipeId = document.getElementById('recipe-id').value;
    const name = document.getElementById('name').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    const method = recipeId ? 'PUT' : 'POST';
    const url = recipeId
        ? `http://localhost:3000/recipes/${recipeId}`
        : 'http://localhost:3000/recipes';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, ingredients, instructions })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            displayRecipes();
            document.getElementById('recipe-form').reset();
            document.getElementById('recipe-id').value = ''; // Clear the hidden field
        } else {
            alert('Failed to save recipe');
        }
    })
    .catch(error => alert('Network Error: ' + error.message));
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
            recipeList.innerHTML = '';

            data.recipes.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.classList.add('recipe-item');
                recipeItem.innerHTML = `
                    <h3>${recipe.name}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    <button onclick="editRecipe(${recipe.id}, '${recipe.name}', '${recipe.ingredients}', '${recipe.instructions}')">Edit</button>
                    <button onclick="deleteRecipe(${recipe.id})">Delete</button>
                `;
                recipeList.appendChild(recipeItem);
            });
        } else {
            alert('No recipes found');
        }
    })
    .catch(error => alert('Network Error: ' + error.message));
}

// Function to edit a recipe
function editRecipe(id, name, ingredients, instructions) {
    document.getElementById('recipe-id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('ingredients').value = ingredients;
    document.getElementById('instructions').value = instructions;
}

// Function to delete a recipe
function deleteRecipe(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to delete recipes');
        return;
    }

    fetch(`http://localhost:3000/recipes/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            displayRecipes();
        } else {
            alert('Failed to delete recipe');
        }
    })
    .catch(error => alert('Network Error: ' + error.message));
}

// Function to search recipes
document.getElementById('search-button')?.addEventListener('click', function () {
    const query = document.getElementById('search-query').value.toLowerCase();
    const recipes = document.querySelectorAll('.recipe-item');

    recipes.forEach(recipe => {
        const name = recipe.querySelector('h3').textContent.toLowerCase();
        if (name.includes(query)) {
            recipe.style.display = '';
        } else {
            recipe.style.display = 'none';
        }
    });
});

// Call displayRecipes on page load
document.addEventListener('DOMContentLoaded', displayRecipes);
