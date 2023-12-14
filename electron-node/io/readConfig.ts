import fs from "fs";
import path from "path";

function readConfig(_e: any) {
  const configFilePath = path.join(process.cwd(), "/resources/extraResources/config.json");
  const content = fs.readFileSync(configFilePath, "utf-8");
  if (!content) return new Error("No content in config file");
  return JSON.parse(content);
}

export default readConfig;
