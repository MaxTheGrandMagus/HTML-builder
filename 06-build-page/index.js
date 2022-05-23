const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const distHtml = path.join(projectDist, 'index.html');
const distCss = path.join(projectDist, 'style.css');
const distAssets = path.join(projectDist, 'assets');

const templateHtml = path.join(__dirname, 'template.html');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const componentsFolder = path.join(__dirname, 'components');

fs.mkdir(projectDist, { recursive: true }, err => {
  if (err) {
    throw err;
  }

  copyDir(assetsFolder, distAssets);

  createHtml(templateHtml, componentsFolder, distHtml);

  const writeStreamCss = fs.createWriteStream(distCss);
  fs.readdir(stylesFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    }
    for (let file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesFolder, file.name);
        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.on('data', (chunk) => {
          writeStreamCss.write(chunk);
        });
        readStream.on('error', (error) => {
          console.log('Something went wrong', error.message);
        });
      }
    }
  });
});

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

async function createHtml(_templateHtml, _componentsFolder, _distHtml) {
  let html = '';
  const readTemplateHtml = await fsp.readFile(_templateHtml, 'utf-8');
  const readComponents = await fsp.readdir(_componentsFolder, { withFileTypes: true });
  html += readTemplateHtml;
  for (let file of readComponents) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      if (html.includes(`{{${file.name.split('.')[0]}}}`)) {
        const readHtml = await fsp.readFile(path.join(_componentsFolder, file.name), 'utf-8');
        html = html.replace(`{{${file.name.split('.')[0]}}}`, readHtml);
      }
    }
  }
  const writeStreamIndexHtml = fs.createWriteStream(_distHtml);
  writeStreamIndexHtml.write(html);
}