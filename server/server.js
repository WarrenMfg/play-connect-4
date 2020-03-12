const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./routes.js');
const path = require('path');

app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api', router);

app.listen(process.env.PORT || 8080, () => console.log('Listening on port 8080!'));
module.exports.app = app;

