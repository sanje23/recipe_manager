// Helper function to get JWT token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to set JWT token in localStorage
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Helper function to remove JWT token from localStorage (logout)
function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// LOGIN - Handle form submission for login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Save JWT token to localStorage
            setAuthToken(data.token);
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            alert(data.message); // Display error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
});

// SIGNUP - Handle form submission for signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Save JWT token to localStorage
            setAuthToken(data.token);
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            alert(data.message); // Display error message
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup.');
    }
});

// DASHBOARD - Fetch and display recipes
window.addEventListener('DOMContentLoaded', async () => {
    const token = getAuthToken();
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    try {
        const response = await fetch('/recipes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            const recipeList = document.getElementById('recipeList');
            data.recipes.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.innerHTML = `
                    <h3>${recipe.name}</h3>
                    <p>${recipe.ingredients}</p>
                    <button onclick="viewRecipe(${recipe.id})">View</button>
                    <button onclick="deleteRecipe(${recipe.id})">Delete</button>
                `;
                recipeList.appendChild(recipeItem);
            });
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('An error occurred while fetching recipes.');
    }
});

// LOGOUT - Handle user logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    removeAuthToken();
    window.location.href = 'index.html'; // Redirect to homepage
});

// VIEW RECIPE - Redirect to individual recipe page
function viewRecipe(recipeId) {
    window.location.href = `recipe.html?id=${recipeId}`;
}

// DELETE RECIPE - Handle recipe deletion
async function deleteRecipe(recipeId) {
    const token = getAuthToken();
    if (!token) return;

    try {
        const response = await fetch(`/recipes/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Recipe deleted successfully');
            location.reload(); // Reload the page to reflect the change
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('An error occurred while deleting the recipe.');
    }
}

// CREATE RECIPE - Handle the creation of a new recipe (Assume there's a form for creating recipes)
document.getElementById('createRecipeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('recipeIngredients').value;
    const instructions = document.getElementById('recipeInstructions').value;
    const token = getAuthToken();

    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    try {
        const response = await fetch('/recipes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, ingredients, instructions })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Recipe created successfully');
            window.location.href = 'dashboard.html'; // Redirect to dashboard after creation
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error creating recipe:', error);
        alert('An error occurred while creating the recipe.');
    }
});

// FETCH INDIVIDUAL RECIPE - Fetch and display a specific recipe (on `recipe.html`)
window.addEventListener('DOMContentLoaded', async () => {
    const recipeId = new URLSearchParams(window.location.search).get('id');
    if (!recipeId) {
        alert('No recipe ID provided!');
        return;
    }

    const token = getAuthToken();
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    try {
        const response = await fetch(`/recipes/${recipeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('recipeName').innerText = data.recipe.name;
            document.getElementById('ingredientsList').innerHTML = data.recipe.ingredients.split('\n').map(ingredient => `<li>${ingredient}</li>`).join('');
            document.getElementById('instructions').innerText = data.recipe.instructions;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('An error occurred while fetching the recipe.');
    }
});
