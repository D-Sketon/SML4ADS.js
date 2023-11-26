import fs from 'fs';
import path from 'path';

type FileTreeType = {
  title: string,
  key: string,
  isLeaf?: boolean,
  children?: FileTreeType[],
};

function generateTree(_e: any,folderPath: string, excludeFiles?: string[]) {
  const result: FileTreeType[] = [];
  const folderName = path.basename(folderPath);
  result.push({
    title: folderName,
    key: folderPath,
    children: _generateTree(_e, folderPath, excludeFiles),
  });
  return result;
}

function _generateTree(_e: any, folderPath: string, excludeFiles: string[] = []) {
  const result: FileTreeType[] = [];

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    if (excludeFiles.includes(file)) {
      return;
    }

    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const children = _generateTree(null, filePath, excludeFiles);
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

export default generateTree;