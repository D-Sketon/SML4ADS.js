const path = require('path');

function getAbsolutePath(_e, root, ...paths) {
  return path.resolve(root, ...paths);
}

module.exports = getAbsolutePath;