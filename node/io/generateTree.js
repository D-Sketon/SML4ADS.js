const fs = require('fs');
const path = require('path');

function generateTree(_e, folderPath, excludeFiles = []) {
  const result = [];

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    if (excludeFiles.includes(file)) {
      return;
    }

    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const children = generateTree(null, filePath, excludeFiles);
      result.push({
        title: file,
        key: filePath,
        children,
      });
    } else {
      result.push({
        title: file,
        key: filePath,
        isLeaf: true,
      });
    }
  });
  return result;
}

module.exports = generateTree;