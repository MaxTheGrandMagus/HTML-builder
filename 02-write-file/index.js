const fs = require('fs');
const path = require('path');

const stream = fs.createWriteStream(path.join(__dirname, '../02-write-file') + '/text.txt');

process.stdout.write('Hello there! Type in some stuff: ');

process.stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.stdout.write('See ya!');
    process.exit();
  }
  stream.write(data);
});

process.on('SIGINT', () => {
  process.stdout.write('See ya!');
  process.exit();
});