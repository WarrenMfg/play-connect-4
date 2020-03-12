const routes = require('express').Router();
const db = require('./db.js');

routes.get('/onload', (req, res) => {
  // query db
  db.query('SELECT * FROM scoreboard LIMIT 10', (err, data) => {
    if (err) {
      console.log('error at get /onload', err);
    } else {
      res.send(data);
    }
  });
});

routes.put('/update-score', (req, res) => {
  let params = [req.body.score, req.body.insertId];
  db.query('UPDATE scoreboard SET score=(?) WHERE scoreboard.id=(?)', params, (err, data) => {
    if (err) {
      console.log('error at post /add-score', err);
    } else {
      // send back all data
      db.query('SELECT * FROM scoreboard LIMIT 10', (err, all) => {
        if (err) {
          console.log('error at get /onload', err);
        } else {
          res.send(all);
        }
      });
    }
  });
});

routes.post('/add-score', (req, res) => {
  let params = [req.body.score];
  db.query('INSERT INTO scoreboard (score) VALUE (?)', params, (err, data) => {
    if (err) {
      console.log('error at post /add-score', err);
    } else {
      // send back all data
      db.query('SELECT * FROM scoreboard LIMIT 10', (err, all) => {
        if (err) {
          console.log('error at get /onload', err);
        } else {
          res.send(all);
        }
      });
    }
  });
});

module.exports = routes;