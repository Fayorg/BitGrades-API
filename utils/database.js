const mariadb = require('mariadb');

// Initialize Pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

// Connect and check for errors
pool.getConnection((err, connection) => {
    if(err){
        console.error("Problem while setting up database...");
        process.exit(1);
    }
    if(connection) connection.release();
    return;
});

module.exports = pool;