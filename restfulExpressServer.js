'use strict';

const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'pets.json');

const bodyParser = require('body-parser');

app.disable('x-powered-by');

app.use(bodyParser.json());

app.get('/pets', (req, res, next) => {
  fs.readFile(dataPath, 'utf8', (err, json) => {
    if (err) {
      return next(err);
    }

    const data = JSON.parse(json);

    res.send(data);
  });
});

app.post('/pets', (req, res, next) => {
  fs.readFile(dataPath, 'utf8', (readErr, json) => {
    if (readErr) {
      return next(readErr);
    }

    const dataArray = JSON.parse(json);
    const { name, age, kind } = req.body;

    if (name && age && kind) {
      dataArray.push({ name, age, kind });

      fs.writeFile(dataPath, JSON.stringify(dataArray), (writeErr) => {
        if (writeErr) {
          return next(writeErr);
        }

        res.send({ name, age, kind });
      });
    }
    else {
      res.sendStatus(400);
    }
  });
});

app.get('/pets/:id', (req, res, next) => {
  fs.readFile(dataPath, 'utf8', (err, json) => {
    if (err) {
      return next(err);
    }

    const dataArray = JSON.parse(json);
    const index = req.params.id;

    if (dataArray[index]) {
      res.send(dataArray[index]);
    }
    else {
      next();
    }
  });
});

app.patch('/pets/:id', (req, res, next) => {
  fs.readFile(dataPath, 'utf8', (readErr, json) => {
    if (readErr) {
      next(readErr);
    }

    const dataArray = JSON.parse(json);
    const index = req.params.id;

    if (dataArray[index]) {
      const { name, age, kind } = req.body;

      if (name || age || kind) {
        const pet = {};
        pet.name = name || dataArray[index].name;
        pet.age = age || dataArray[index].age;
        pet.kind = kind || dataArray[index].kind;

        dataArray[index] = pet;
        const newJSON = JSON.stringify(dataArray);

        fs.writeFile(dataPath, newJSON, (writeErr) => {
          if (writeErr) {
            next(writeErr);
          }

          res.send(pet);
        });
      }
      else {
        res.sendStatus(400);
      }
    }
    else {
      next();
    }
  });
});

app.delete('/pets/:id', (req, res, next) => {
  fs.readFile(dataPath, 'utf8', (readErr, json) => {
    if (readErr) {
      next(readErr);
    }

    const dataArray = JSON.parse(json);
    const index = req.params.id;

    if (dataArray[index]) {
      const pet = dataArray.splice(index, 1)[0];
      const newJSON = JSON.stringify(dataArray);

      fs.writeFile(dataPath, newJSON, (writeErr) => {
        if (writeErr) {
          next(writeErr);
        }

        res.send(pet);
      });
    }
    else {
      next();
    }
  });
});

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
