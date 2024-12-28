const Recipe = require('../models/recipeModel'); // Assuming your Recipe model contains these methods

// Get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.getAll(); // Assuming getAll is a method defined in your model
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.getById(req.params.id); // Assuming getById is defined in your model
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ error: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        const newRecipe = await Recipe.create({ name, ingredients, instructions }); // Assuming create is a method in your model
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        const updatedRecipe = await Recipe.update(req.params.id, { name, ingredients, instructions }); // Assuming update is a method in your model
        if (updatedRecipe) {
            res.json(updatedRecipe);
        } else {
            res.status(404).json({ error: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const deleted = await Recipe.delete(req.params.id); // Assuming delete is a method in your model
        if (deleted) {
            res.json({ message: 'Recipe deleted successfully' });
        } else {
            res.status(404).json({ error: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
