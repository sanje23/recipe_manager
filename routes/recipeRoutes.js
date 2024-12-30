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
    const userId = req.user.userId; // Get userId from the token

    // Validate that all required fields are present
    if (!name || !ingredients || !instructions) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Query to insert a new recipe into the database
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

    // Query to fetch recipes for the authenticated user
    const query = 'SELECT * FROM recipes WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching recipes:', err);
            return res.status(500).json({ message: 'Error fetching recipes', error: err });
        }

        // Return the list of recipes as a JSON response
        res.json({ recipes: results });
    });
});

export default router;
