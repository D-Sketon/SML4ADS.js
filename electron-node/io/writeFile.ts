import fs from "fs/promises";

async function writeFile(_e: any, path: string, content: string) {
  try {
    await fs.writeFile(path, content);
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
    return false;
  }
  return true;
}

export default writeFile;