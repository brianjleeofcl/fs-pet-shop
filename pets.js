#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const command = process.argv[2];

if (command === 'read') {
  fs.readFile(dataPath, 'utf8', (error, data) => {
    if (error) {
      throw error;
    }

    const dataArray = JSON.parse(data);
    const index = process.argv[3];

    if (index && dataArray[index]) {
      console.log(dataArray[index]);
    } else if (index) {
      console.error(`Usage: ${node} ${file} ${command} INDEX`);
      process.exit(1);
    } else {
      console.log(dataArray);
    }
  });
}
else if (command === 'create') {
  const age = parseInt(process.argv[3]);
  const kind = process.argv[4];
  const name = process.argv[5];

  if (age && kind && name) {
    fs.readFile(dataPath, 'utf8', (readError, data) => {
      if (readError) {
        throw readError;
      }

      const dataArray = JSON.parse(data);
      const newPet = {};

      newPet.age = age;
      newPet.kind = kind;
      newPet.name = name;
      dataArray.push(newPet);

      const dataJSON = JSON.stringify(dataArray);

      fs.writeFile(dataPath, dataJSON, (writeError) => {
        if (writeError) {
          throw writeError;
        }

        console.log(newPet);
      });
    });
  } else {
    console.error(`Usage: ${node} ${file} ${command} AGE KIND NAME`);
    process.exit(1);
  }
}
else if (command === 'update') {
  const index = parseInt(process.argv[3]);
  const age = parseInt(process.argv[4]);
  const kind = process.argv[5];
  const name = process.argv[6];

  if (index && age && kind && name) {
    fs.readFile(dataPath, 'utf8', (readError, data) => {
      if (readError) {
        throw readError;
      }

      const dataArray = JSON.parse(data);

      if (dataArray[index]) {
        const updatedPet = {};

        updatedPet.age = age;
        updatedPet.kind = kind;
        updatedPet.name = name;
        dataArray[index] = updatedPet;

        const dataJSON = JSON.stringify(dataArray);

        fs.writeFile(dataPath, dataJSON, (writeError) => {
          if (writeError) {
            throw write
          }

          console.log(updatedPet);
        })
      } else {
        console.error(`Usage: ${node} ${file} ${command} INDEX AGE KIND NAME`);
        process.exit(1);
      }
    })
  }
  else {
    console.error(`Usage: ${node} ${file} ${command} INDEX AGE KIND NAME`);
    process.exit(1);
  }
}
else if (command === 'destroy') {
  const index = parseInt(process.argv[3]);

  fs.readFile(dataPath, 'utf8', (readError, data) => {
    if (readError) {
      throw readError;
    }

    const dataArray = JSON.parse(data);

    if (dataArray[index]) {
      const destroyedPet = dataArray.splice(index, 1);

      const dataJSON = JSON.stringify(dataArray);

      fs.writeFile(dataPath, dataJSON, (writeError) => {
        if (writeError) {
          throw writeError;
        }

        console.log(...destroyedPet);
      })
    }
    else {
      console.error(`Usage: ${node} ${file} ${command} INDEX`);
      process.exit(1);
    }
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
