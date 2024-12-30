import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'b1ubf0evcgt9rfaastqv-mysql.services.clever-cloud.com',
    user: 'uq2dzhhzrenzixsm',
    password: 'kbMEZoJBcka9VPHFyZly',
    database: 'b1ubf0evcgt9rfaastqv',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL Database!');
});

export default db; // Use export default instead of module.exports
