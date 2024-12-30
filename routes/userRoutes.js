import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel.js'; // Import user model methods

const userRouter = express.Router();

// Route to create a new user (register)
userRouter.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // First, check if the email is already in use
    findUserByEmail(email, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking email', error: err });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Email doesn't exist, proceed with user creation
        createUser({ username, email, password }, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating user', error: err });
            }
            res.status(201).json({ message: 'User created successfully', userId: results.insertId });
        });
    });
});

// Route to find a user by email
userRouter.get('/find', (req, res) => {
    const { email } = req.query;

    findUserByEmail(email, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error finding user', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: results[0] });
    });
});

// Route to log in a user (issue JWT token)
userRouter.post('/login', (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, (err, users) => {
        if (err || !users.length) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = users[0];  // Assuming only one user is returned

        // Here you should compare the password with a hash (not just directly as shown)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate JWT if passwords match
        const token = jwt.sign({ userId: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login successful',
            token
        });
    });
});

// Export the userRouter
export { userRouter };
