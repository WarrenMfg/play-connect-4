const mysql = require('mysql');

const db = mysql.createConnection({
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'heroku_d6c878d67fe5ca4'
});

db.connect();

module.exports = db;