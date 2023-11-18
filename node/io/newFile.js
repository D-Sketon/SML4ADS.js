const fs = require('fs/promises');

async function newFile(_e, path, name, ext, content = '') {
  try {
    await fs.access(`${path}/${name}`);
    _e?.sender.send('ui:openNotification', 'error', 'Error', `File ${path}/${name} already exists`);
    return false;
  } catch (error) { }

  const pathName = `${path}/${name}.${ext}`;
  try {
    await fs.writeFile(pathName, content);
  } catch (error) {
    _e?.sender.send('ui:openNotification', 'error', 'Error', error.message);
    return false;
  }
  return true;
}

module.exports = newFile;