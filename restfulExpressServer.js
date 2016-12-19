'use strict';

const express = require('express');
const app = express();

const path = require('path');

// const dataPath = path.join(__dirname, 'pets.json');
const pwPath = path.join(__dirname, 'user.htpasswd');

const auth = require('http-auth');
const basic = auth.basic({
  realm: 'Required',
  file: pwPath,
  msg401: 'Unauthorized'
});

const bodyParser = require('body-parser');
const morgan = require('morgan');

const pets = require('./routes/pets.js');

app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(auth.connect(basic));

app.use(bodyParser.json());

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':body'));

app.use((req, res, next) => {
  if (req.get('Origin') === 'http://experimental.brianjlee.net') {
    res.set({
      'Access-Control-Allow-Origin': 'http://experimental.brianjlee.net',
      'Access-Control-Allow-Credentials': 'true'
    });
  }
  next();
});

// app.use(pets(dataPath)); /* see note in routes/pets.js */
app.use(pets);

app.use((err, req, res, _next) => {
  console.error(err.stack);

  return res.sendStatus(500);
});

app.use((req, res) => {
  return res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
