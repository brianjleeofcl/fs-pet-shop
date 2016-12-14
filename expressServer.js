'use strict';

const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'pets.json');

const bodyParser = require('body-parser');

app.disable('x-powered-by');

app.use(bodyParser.json());

app.get('/pets', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, json) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    const data = JSON.parse(json);

    res.send(data);
  });
});

app.post('/pets', (req, res) => {
  fs.readFile(dataPath, 'utf8', (readErr, json) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }
    console.log('post check');
    const dataArray = JSON.parse(json);
    const name = req.body.name;
    const age = req.body.age;
    const kind = req.body.kind;

    if (name && age && kind) {
      dataArray.push({name, age, kind});

      fs.writeFile(dataPath, JSON.stringify(dataArray), (writeErr) => {
        if (writeErr) {
          console.error(writeErr.stack);
          return res.sendStatus(500);
        }

        res.send({name, age, kind});
      });
    }
    else {
      res.sendStatus(400);
    }
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, json) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    const dataArray = JSON.parse(json);
    const index = req.params.id;

    if (dataArray[index]) {
      res.send(dataArray[index]);
    }
    else {
      res.sendStatus(404);
    }
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
