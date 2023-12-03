import fs from "fs";
import _path from "path";

function deleteFile(_e: any, path: string) {
  try {
    let stat = fs.statSync(path);
    if (!stat.isDirectory()) {
      fs.unlinkSync(path);
    } else {
      let files = fs.readdirSync(path);
      for (let i = 0; i < files.length; i++) {
        let newPath = _path.join(path, files[i]);
        let stat = fs.statSync(newPath);
        if (stat.isDirectory()) {
          deleteFile(_e, newPath);
        } else {
          fs.unlinkSync(newPath);
        }
      }
      fs.rmdirSync(path);
    }
    _e?.sender.send(
      "ui:onOpenNotification",
      "success",
      "Success",
      "Files deleted successfully!"
    );
    return true;
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
    return false;
  }
}

export default deleteFile;
