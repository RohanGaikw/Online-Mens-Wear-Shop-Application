const mysql = require('mysql');

// Create connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: 'admin123',  // Your MySQL password
    database: 'wms' // Your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;
