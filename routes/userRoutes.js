const express = require('express');
const { signupController, loginController } = require('../controllers/userController');
const router = express.Router();

// POST route for user signup
router.post('/signup', signupController);

// POST route for user login
router.post('/login', loginController);

module.exports = router;
