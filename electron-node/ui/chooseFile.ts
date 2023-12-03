import { dialog } from "electron";

async function chooseFile(_e: any, filter: string[]) {
  return await dialog.showOpenDialog({
    title: "Please choose a tree file",
    defaultPath: "/",
    filters: [
      {
        name: "filter",
        extensions: filter,
      },
    ],
    buttonLabel: "打开",
  });
}

export default chooseFile;
