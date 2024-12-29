const bcrypt = require('bcryptjs');
const db = require('./db'); // Assuming db.js is in the parent directory

// Signup Function
const signupUser = (username, email, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return callback(err);

        const query = 'INSERT INTO new_users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    });
};

// Login Function
const loginUser = (email, password, callback) => {
    const query = 'SELECT * FROM new_users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback('No user found');

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return callback(err);
            if (isMatch) {
                // Exclude the password field from the user object
                const { password, ...userWithoutPassword } = user; // Remove password from response
                callback(null, userWithoutPassword);  // Send user details without the password
            } else {
                callback('Invalid credentials');
            }
        });
    });
};

module.exports = { signupUser, loginUser };
