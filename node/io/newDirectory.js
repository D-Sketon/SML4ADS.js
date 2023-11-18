const fs = require('fs/promises');

async function newDirectory(_e, path, name) {
  try {
    await fs.access(`${path}/${name}`);
    _e?.sender.send('ui:openNotification', 'error', 'Error', `Directory ${path}/${name} already exists`);
    return false;
  } catch (error) { }

  const pathName = `${path}/${name}`;
  try {
    await fs.mkdir(pathName);
  } catch (error) {
    _e?.sender.send('ui:openNotification', 'error', 'Error', error.message);
    return false;
  }
  return true;
}

module.exports = newDirectory;