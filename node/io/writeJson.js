const fs = require('fs/promises');

async function writeJson(_e, path, object) {
  const json = JSON.stringify(object);
  try {
    await fs.writeFile(path, json);
  } catch (_error) {
    _e?.sender.send('ui:openNotification', 'error', 'Error', _error);
  }
}

module.exports = writeJson;