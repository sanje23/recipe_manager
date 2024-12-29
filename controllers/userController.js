const bcrypt = require('bcrypt');
const db = require('../models/db'); // Ensure correct path to your database connection

// User signup controller
const signupController = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO new_users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
};

// User login controller
const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const [user] = await db.query('SELECT * FROM new_users WHERE email = ?', [email]);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Login successful.', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
};

module.exports = { signupController, loginController };
