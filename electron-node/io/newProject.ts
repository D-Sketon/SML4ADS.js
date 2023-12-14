import fs from "fs/promises";

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

  _e?.sender.send(
    "ui:onOpenNotification",
    "success",
    "Success",
    "Project created successfully!"
  );
  return true;
}

export default newProject;
