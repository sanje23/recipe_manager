const mysql = require('mysql');
const db = require('./models/db'); // Assuming db.js handles the MySQL connection

// Function to create the tables
const createTables = () => {
    // Query to create the Recipes table
    const createRecipesTableQuery = `
        CREATE TABLE IF NOT EXISTS recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES new_users(id) ON DELETE CASCADE
        );
    `;

    // Query to create the Users table
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS new_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `;

    // Execute the query to create the Users table
    db.query(createUsersTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating Users table:', err);
        } else {
            console.log('Users table created or already exists.');
            
            // Execute the query to create the Recipes table
            db.query(createRecipesTableQuery, (err, results) => {
                if (err) {
                    console.error('Error creating Recipes table:', err);
                } else {
                    console.log('Recipes table created or already exists.');
                }

                // Close the database connection after creating tables
                db.end();
            });
        }
    });
};

// Call the function to create the tables
createTables();
