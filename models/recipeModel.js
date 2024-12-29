const db = require('./db');

const Recipe = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM recipes', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM recipes WHERE id = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    },

    create: (recipe) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO recipes SET ?', recipe, (err, results) => {
                if (err) reject(err);
                else resolve({ id: results.insertId, ...recipe });
            });
        });
    },

    update: (id, recipe) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE recipes SET ? WHERE id = ?', [recipe, id], (err, results) => {
                if (err) reject(err);
                else resolve(results.affectedRows > 0 ? { id, ...recipe } : null);
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM recipes WHERE id = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results.affectedRows > 0);
            });
        });
    }
};

module.exports = Recipe;