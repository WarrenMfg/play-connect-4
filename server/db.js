const mysql = require('mysql');

const db = mysql.createConnection({
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'connectFour'
});

db.connect();

module.exports = db;