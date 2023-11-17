const fs = require('fs');

function readFile(_e, path) {
  return fs.readFileSync(path, 'utf-8');
}

module.exports = readFile;