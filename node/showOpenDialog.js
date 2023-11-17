const { dialog } = require('electron');

async function showOpenDialog() {
  return await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
}

module.exports = showOpenDialog;