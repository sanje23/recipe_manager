const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Routes
router.get('/', recipeController.getAllRecipes);        // Get all recipes
router.get('/:id', recipeController.getRecipeById);    // Get a recipe by ID
router.post('/', recipeController.createRecipe);       // Create a new recipe
router.put('/:id', recipeController.updateRecipe);     // Update a recipe by ID
router.delete('/:id', recipeController.deleteRecipe);  // Delete a recipe by ID

module.exports = router;
