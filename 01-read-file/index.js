const fs = require('fs');
const path = require('path');
const readStream = fs.createReadStream(path.join(__dirname, '../01-read-file') + '/text.txt', 'utf8');
let data = '';
readStream.on('data', (chunk) => {
  data += chunk;
}).on('end', () => {
  console.log(data);
});