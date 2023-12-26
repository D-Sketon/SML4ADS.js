import fs from "fs";

function readFile(_e: any, path: string, encoding: BufferEncoding='utf-8') {
  return fs.readFileSync(path, encoding);
}

export default readFile;
