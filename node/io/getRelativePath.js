const path = require('path');

function getRelativePath(_e, from, to) {
  return path.relative(from, to);

}

module.exports = getRelativePath;