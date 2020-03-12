const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./routes.js');

app.use(express.static('./client/dist'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', router);

module.exports.app = app;
app.listen(process.env.PORT || 8080, () => console.log('Listening on port 8080!'));

