import { dialog } from "electron";

async function chooseDirectory() {
  return await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
}

export default chooseDirectory;
