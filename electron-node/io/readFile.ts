import fs from "fs";

function readFile(_e: any, path: string) {
  return fs.readFileSync(path, "utf-8");
}

export default readFile;
