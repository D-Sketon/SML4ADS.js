import path from 'path';

function getRelativePath(_e: any, from: string, to: string) {
  return path.relative(from, to);
}

export default getRelativePath;