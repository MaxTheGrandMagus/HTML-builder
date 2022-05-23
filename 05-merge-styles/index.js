const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  }
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesPath, file.name);
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });
      readStream.on('error', (error) => {
        console.log('Something went wrong', error.message);
      });
    }
  }
});