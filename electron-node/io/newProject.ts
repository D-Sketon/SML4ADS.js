import fs from "fs/promises";
import writeJson from "./writeJson";

const defaultConfig = {
  simulationPort: 20225,
};

async function newProject(_e: any, path: string, name: string) {
  try {
    await fs.access(`${path}/${name}`);
    _e?.sender.send(
      "ui:onOpenNotification",
      "error",
      "Error",
      `Directory ${path}/${name} already exists`
    );
    return false;
  } catch (error) {}

  const pathName = `${path}/${name}`;
  try {
    await fs.mkdir(pathName);
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
    return false;
  }

  try {
    await fs.mkdir(`${pathName}/.adsml`);
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
    return false;
  }

  // use Default.json as a template
  try {
    await writeJson(_e, `${pathName}/.adsml/config.json`, defaultConfig);
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
    return false;
  }
  _e?.sender.send(
    "ui:onOpenNotification",
    "success",
    "Success",
    "Project created successfully!"
  );
  return true;
}

export default newProject;
