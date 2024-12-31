import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../models/db.js'; // Import MySQL connection

const router = express.Router();

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('Authorization');

    if (!token) {
        return res.status(403).json({ message: 'Access denied, token required' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// Route for creating a new recipe (protected)
router.post('/', authenticateToken, (req, res) => {
    const { name, ingredients, instructions } = req.body;
    const userId = req.user.userId;

    if (!name || !ingredients || !instructions) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO recipes (user_id, name, ingredients, instructions) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, name, ingredients, instructions], (err, results) => {
        if (err) {
            console.error('Error creating recipe:', err);
            return res.status(500).json({ message: 'Error creating recipe', error: err });
        }
        return res.status(201).json({ message: 'Recipe created successfully', recipeId: results.insertId });
    });
});

// Route for fetching all recipes (protected)
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT * FROM recipes WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching recipes:', err);
            return res.status(500).json({ message: 'Error fetching recipes', error: err });
        }
        res.json({ recipes: results });
    });
});

// Route for updating a recipe by ID (protected)
router.put('/:id', authenticateToken, (req, res) => {
    const { name, ingredients, instructions } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;

    if (!name || !ingredients || !instructions) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'UPDATE recipes SET name = ?, ingredients = ?, instructions = ? WHERE id = ? AND user_id = ?';
    db.query(query, [name, ingredients, instructions, id, userId], (err, results) => {
        if (err) {
            console.error('Error updating recipe:', err);
            return res.status(500).json({ message: 'Error updating recipe', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found or not authorized to update' });
        }

        res.json({ message: 'Recipe updated successfully' });
    });
});

// Route for deleting a recipe by ID (protected)
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const query = 'DELETE FROM recipes WHERE id = ? AND user_id = ?';
    db.query(query, [id, userId], (err, results) => {
        if (err) {
            console.error('Error deleting recipe:', err);
            return res.status(500).json({ message: 'Error deleting recipe', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found or not authorized to delete' });
        }

        res.json({ message: 'Recipe deleted successfully' });
    });
});

// Route for searching recipes by name (protected)
router.get('/search', authenticateToken, (req, res) => {
    const { query } = req.query;
    const userId = req.user.userId;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = `
        SELECT * FROM recipes 
        WHERE user_id = ? AND name LIKE ?
    `;
    db.query(searchQuery, [userId, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Error searching recipes:', err);
            return res.status(500).json({ message: 'Error searching recipes', error: err });
        }

        res.json({ recipes: results });
    });
});

export default router;
