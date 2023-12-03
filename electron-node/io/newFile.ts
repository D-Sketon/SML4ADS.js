import fs from "fs/promises";

async function newFile(
  _e: any,
  path: string,
  name: string,
  ext: string,
  content = ""
) {
  try {
    await fs.access(`${path}/${name}`);
    _e?.sender.send(
      "ui:onOpenNotification",
      "error",
      "Error",
      `File ${path}/${name} already exists`
    );
    return false;
  } catch (error) {}

  const pathName = `${path}/${name}.${ext}`;
  try {
    await fs.writeFile(pathName, content);
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
    return false;
  }
  return true;
}

export default newFile;
