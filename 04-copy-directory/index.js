const fsp = require('fs/promises');
const path = require('path');
const originalPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

async function copyDir(original, copy) {
  await fsp.mkdir(copy, { recursive: true }, err => {
    if (err) {
      throw err;
    }
  });
  
  const readOriginal = await fsp.readdir(original, { withFileTypes: true });
  const readCopy = await fsp.readdir(copy);

  for (let item of readOriginal) {
    if (item.isFile()) {
      fsp.copyFile(path.join(original, item.name), path.join(copy, item.name));
    }
    if(item.isDirectory()) {
      copyDir(path.join(original, item.name), path.join(copy, item.name));
    }
  }

  for (let item of readCopy) {
    fsp.access(path.join(original, item))
      .catch(() => {
        fsp.rm(path.join(copy, item), { recursive: true });
      });
  }
}

copyDir(originalPath, copyPath);