const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'pets.json');

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


app.use((req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = ;
