const Recipe = require('../models/recipeModel');

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.user.id });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error });
    }
};

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error });
    }
};

exports.createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe({ ...req.body, userId: req.user.id });
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error });
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found or not authorized' });
        }
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recipe not found or not authorized' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error });
    }
};
