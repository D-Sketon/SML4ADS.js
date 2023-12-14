import fs from "fs/promises";
import path from "path";

async function writeConfig(_e: any, object: any) {
  const configFilePath = path.join(process.cwd(), "/resources/extraResources/config.json");
  const json = JSON.stringify(object);
  try {
    await fs.writeFile(configFilePath, json);
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
    return false;
  }
  return true;
}

export default writeConfig;
