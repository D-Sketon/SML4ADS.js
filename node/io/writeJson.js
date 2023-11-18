const fs = require('fs/promises');

async function writeJson(_e, path, object) {
  const json = JSON.stringify(object);
  try {
    await fs.writeFile(path, json);
  } catch (error) {
    _e?.sender.send('ui:openNotification', 'error', 'Error', error.message);
    return false;
  }
  return true;
}

module.exports = writeJson;