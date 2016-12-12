'strict mode';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const command = process.argv[2]


if (command === 'read') {

}
else if (command === 'create') {

}
else if (command === 'update') {

}
else if (command === 'destroy') {

}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
}
