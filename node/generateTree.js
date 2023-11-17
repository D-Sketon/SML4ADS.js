const fs = require('fs');
const path = require('path');
const Crypto = require('crypto');

function generateTree(_e, folderPath, excludeFiles = []) {
  const result = [];

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    if (excludeFiles.includes(file)) {
      return;
    }

    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    const hash = Crypto.createHash('md5').update(filePath).digest('hex');

    if (stats.isDirectory()) {
      const children = generateTree(null, filePath, excludeFiles);
      result.push({
        title: file,
        key: hash,
        children,
      });
    } else {
      result.push({
        title: file,
        key: hash,
        isLeaf: true,
      });
    }
  });
  console.log(result);
  return result;
}

module.exports = generateTree;