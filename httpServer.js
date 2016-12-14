'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'pets.json');

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  if (method === 'GET' && url.startsWith('/pets')) {
    const index = url.match(/\/([^/]*)$/)[1];

    fs.readFile(dataPath, 'utf8', (readError, data) => {
      if (readError) {
        console.error(readError.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal server error');

        return;
      }

      if (index === 'pets' || index === '') {
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
      else {
        const petArray = JSON.parse(data);
        const outputData = JSON.stringify(petArray[index]);

        if (outputData) {
          res.setHeader('Content-Type', 'application/json');
          res.end(outputData);
        }
        else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found');
        }
      }
    });
  }
  else if (method === 'POST' && url === '/pets') {
    const requestBuffer = [];

    req.on('data', (chunk) => {
      requestBuffer.push(chunk);
    }).on('end', () => {
      const requestBody = Buffer.concat(requestBuffer).toString();
      const requestData = JSON.parse(requestBody);

      if (requestData.age && requestData.name && requestData.kind) {
        fs.readFile(dataPath, 'utf8', (readError, data) => {
          if (readError) {
            console.error(readError.stack);

            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal server error');

            return;
          }

          const dataArray = JSON.parse(data);
          const newPet = {
            age: requestData.age,
            kind: requestData.kind,
            name: requestData.name
          };

          dataArray.push(newPet);

          const dataJSON = JSON.stringify(dataArray);

          fs.writeFile(dataPath, dataJSON, (writeError) => {
            if (writeError) {
              console.error(writeError.stack);

              res.statusCode = 500;
              res.setHeader('Content-Type', 'text/plain');
              res.end('Internal server error');

              return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newPet));
          });
        });
      }
      else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request');
      }
    });
  }
  else if (method === 'POST') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = server;
