
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  generateTree: (folderPath, excludeFiles) => ipcRenderer.invoke('file:generateTree',folderPath, excludeFiles),
  chooseFile: (filter) => ipcRenderer.invoke('file:chooseFile', filter),
  chooseDirectory: () => ipcRenderer.invoke('file:chooseDirectory'),
  readFile: (filePath) => ipcRenderer.invoke('file:readFile', filePath),
});