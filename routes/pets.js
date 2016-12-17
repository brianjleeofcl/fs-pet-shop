const newRouter = function (dataPath) {
  const fs = require('fs');

  const express = require('express');
  const router = express.Router();

  router.get('/pets', (req, res, next) => {
    fs.readFile(dataPath, 'utf8', (err, json) => {
      if (err) {
        return next(err);
      }

      const data = JSON.parse(json);

      res.send(data);
    });
  });

  router.post('/pets', (req, res, next) => {
    fs.readFile(dataPath, 'utf8', (readErr, json) => {
      if (readErr) {
        return next(readErr);
      }

      const dataArray = JSON.parse(json);
      const { name, age, kind } = req.body;

      if (name && age && kind) {
        const newPet = { name, age: parseInt(age), kind }
        dataArray.push(newPet);

        fs.writeFile(dataPath, JSON.stringify(dataArray), (writeErr) => {
          if (writeErr) {
            return next(writeErr);
          }

          res.send(newPet);
        });
      }
      else {
        res.sendStatus(400);
      }
    });
  });

  router.get('/pets/:id', (req, res, next) => {
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

  router.patch('/pets/:id', (req, res, next) => {
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
          pet.age = parseInt(age || dataArray[index].age);
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

  router.delete('/pets/:id', (req, res, next) => {
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

  return router
};

module.exports = newRouter;
