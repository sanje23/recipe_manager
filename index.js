const express = require('express');
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const authenticate = require('./middleWare/authenticate');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the user routes for all /users endpoints
app.use('/users', userRoutes);

// Use the recipe routes for all /recipes endpoints with authentication middleware
app.use('/recipes', authenticate, recipeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
