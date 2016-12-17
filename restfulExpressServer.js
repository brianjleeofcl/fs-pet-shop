'use strict';

const express = require('express');
const app = express();


const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'pets.json');
const pwPath = path.join(__dirname, 'user.htpasswd');

const auth = require('http-auth');
const basic = auth.basic({
  realm: 'Required',
  file: pwPath,
  msg401: 'Unauthorized'
});

const bodyParser = require('body-parser');

const pets = require('./routes/pets.js');

app.disable('x-powered-by');

app.use(auth.connect(basic));

app.use(bodyParser.json());

app.use(pets(dataPath))

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
