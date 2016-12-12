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
      process.exit(1)
    } else {
      console.log(dataArray);
    }
  })
}
else if (command === 'create') {
  const age = process.argv[3];
  const kind = process.argv[4];
  const name = process.argv[5];

  if (age && kind && name) {
    fs.readFile(dataPath, 'utf8', (readError, data) => {
      if (readError) {
        throw readError;
      }

      const dataArray = JSON.parse(data);
      const newPet = {};

      newPet.age = parseInt(age);
      newPet.kind = kind;
      newPet.name = name;
      dataArray.push(newPet);

      fs.writeFile(dataPath, dataArray, (writeError) => {
        if (writeError) {
          throw writeError;
        }

        console.log(`${name} (${kind}, ${age}) added.`);
      })
    })
  } else {
    console.error(`Usage: ${node} ${file} ${command} AGE KIND NAME`);
    process.exit(1);
  }
}
else if (command === 'update') {

}
else if (command === 'destroy') {

}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
