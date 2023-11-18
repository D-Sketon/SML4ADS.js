const { dialog } = require('electron');

async function chooseFile(_e, filter) {
  return await dialog.showOpenDialog({
    title: 'Please choose a tree file', 
    defaultPath: '/',
    filters: [
      {
        name: 'filter',
        extensions: filter
      }
    ],
    buttonLabel: '打开'
  })
}

module.exports = chooseFile;