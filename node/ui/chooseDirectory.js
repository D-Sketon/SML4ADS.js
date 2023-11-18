const { dialog } = require('electron');

async function chooseDirectory() {
  return await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
}

module.exports = chooseDirectory;