const db = require('../models/db'); // MySQL connection

const createRecipe = (recipeData, callback) => {
    const query = `
        INSERT INTO recipes (name, ingredients, instructions, user_id) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [recipeData.name, recipeData.ingredients, recipeData.instructions, recipeData.user_id];
    db.query(query, values, callback);
};

const getRecipesByUserId = (userId, callback) => {
    const query = 'SELECT * FROM recipes WHERE user_id = ?';
    db.query(query, [userId], callback);
};

module.exports = {
    createRecipe,
    getRecipesByUserId,
};
