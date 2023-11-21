import path from 'path';

function getAbsolutePath(_e: any, root: string, ...paths: string[]) {
  return path.resolve(root, ...paths);
}

export default getAbsolutePath;