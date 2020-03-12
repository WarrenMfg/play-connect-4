// did not have enough time to dedicate to learning mongoDB yet

const mysql = require('mysql');

const db = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'connectFour'
});

db.connect();

module.exports = db;