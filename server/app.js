import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Import for ES module compatibility
import { userRouter } from './routes/userRoutes.js';
import authenticateJWT from './middleWare/authenticate.js';  // If using middleware for authentication

// Get the current directory from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the userRouter for user registration, login, and find routes
app.use('/users', userRouter);

// Example: Protected route (requires authentication)
app.get('/profile', authenticateJWT, (req, res) => {
    // Logic for profile
    res.json({ message: 'User profile details' });
});

// Default route to send the index.html file (handled by static file middleware)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});