const recipeForm = document.getElementById('recipe-form');
const recipesContainer = document.getElementById('recipes');
const searchBar = document.getElementById('search-bar');
const API_URL = '/recipes'; // Your API URL for fetching, adding, and updating recipes

// Function to filter recipes based on the search query
function filterRecipes(query, recipes) {
    return recipes.filter(recipe => {
        // Convert the search query and recipe fields to lowercase for case-insensitive matching
        const searchQuery = query.toLowerCase();
        const recipeName = recipe.name.toLowerCase();
        const recipeIngredients = recipe.ingredients.toLowerCase();

        // Check if the query matches either the name or ingredients
        return recipeName.includes(searchQuery) || recipeIngredients.includes(searchQuery);
    });
}

// Function to render recipes
function renderRecipes(recipes) {
    recipesContainer.innerHTML = ''; // Clear existing content
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <button class="edit-button" data-id="${recipe.id}">Edit</button>
            <button class="delete-button" data-id="${recipe.id}">Delete</button>
        `;
        recipesContainer.appendChild(recipeDiv);
    });

    // Attach edit and delete event listeners
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeId = e.target.getAttribute('data-id');
            fetchAndEditRecipe(recipeId); // Fetch and load the recipe for editing
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const recipeId = e.target.getAttribute('data-id');
            await deleteRecipe(recipeId);
        });
    });
}

// Fetch and display recipes with optional search filter
async function fetchRecipes(query = '') {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const filteredRecipes = filterRecipes(query, data);
        renderRecipes(filteredRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Add event listener to the search bar
searchBar.addEventListener('input', (e) => {
    const query = e.target.value;
    fetchRecipes(query); // Fetch and filter recipes based on the query
});

// Add a new recipe
recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, ingredients, instructions })
        });
        recipeForm.reset();
        fetchRecipes(); // Refresh the list after adding
    } catch (error) {
        console.error('Error adding recipe:', error);
    }
});

// Delete a recipe
async function deleteRecipe(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchRecipes(); // Refresh the list after deleting
    } catch (error) {
        console.error('Error deleting recipe:', error);
    }
}

// Open the edit modal with the current recipe data
function openEditModal(recipe) {
    document.getElementById('edit-name').value = recipe.name;
    document.getElementById('edit-ingredients').value = recipe.ingredients;
    document.getElementById('edit-instructions').value = recipe.instructions;
    document.getElementById('edit-id').value = recipe.id;
    document.getElementById('edit-modal').style.display = 'block';
}

// Fetch the recipe by ID for editing
async function fetchAndEditRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const recipe = await response.json();
        openEditModal(recipe); // Open the modal and populate it with data
    } catch (error) {
        console.error('Error fetching recipe for edit:', error);
    }
}

// Update recipe
async function updateRecipe(e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const ingredients = document.getElementById('edit-ingredients').value;
    const instructions = document.getElementById('edit-instructions').value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, ingredients, instructions })
        });

        if (response.ok) {
            document.getElementById('edit-modal').style.display = 'none';
            fetchRecipes(); // Refresh the list after updating
        } else {
            console.error('Failed to update recipe');
        }
    } catch (error) {
        console.error('Error updating recipe:', error);
    }
}

// Close the modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});

// Attach the update event listener to the edit form
document.getElementById('edit-form').addEventListener('submit', updateRecipe);

// Initial load of recipes
fetchRecipes();
