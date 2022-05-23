const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, './secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  }
  for (const file of files) {
    if (file.isFile()) {
      let fileName = file.name.split('.')[0];
      let fileExtension = path.extname(file.name).split('.')[1];
      fs.stat(path.join(__dirname, './secret-folder', file.name), (err, stats) => {
        if (err) {
          throw err;
        } else {
          console.log(`${fileName} - ${fileExtension} - ${stats.size / 1024} KB`);
        }
      });
    }
  }
});