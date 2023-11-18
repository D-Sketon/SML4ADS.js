const fs = require('fs/promises');
const writeJson = require('./writeJson');

const defaultConfig = {
  simulationPort: 20225
}

async function newProject(_e, path, name) {
  try {
    await fs.access(`${path}/${name}`);
    _e?.sender.send('ui:openNotification', 'error', 'Error', `Directory ${path}/${name} already exists`);
    return false;
  } catch (error) { }

  const pathName = `${path}/${name}`;
  try {
    await fs.mkdir(pathName);
  } catch (error) {
    _e?.sender.send('ui:openNotification', 'error', 'Error', error);
    return false;
  }

  try {
    await fs.mkdir(`${pathName}/.adsml`);
  } catch (error) {
    _e?.sender.send('ui:openNotification', 'error', 'Error', error);
    return false;
  }

  // use Default.json as a template
  try {
    await writeJson(_e, `${pathName}/.adsml/config.json`, defaultConfig);
  } catch (error) {
    _e?.sender.send('ui:openNotification', 'error', 'Error', error);
    return false;
  }
  _e?.sender.send('ui:openNotification', 'success', 'Success', 'Project created successfully!');
  return true;
}

module.exports = newProject;