import db from './db.js'; // Ensure you're importing the MySQL connection correctly

// Function to create a new user
export const createUser = (userData, callback) => {
    const { username, email, password } = userData;
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    db.query(query, [username, email, password], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Function to find a user by email
export const findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};