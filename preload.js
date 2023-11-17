
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  generateTree: (folderPath, excludeFiles) => ipcRenderer.invoke('file:generateTree',folderPath, excludeFiles),
  chooseFile: (filter) => ipcRenderer.invoke('file:chooseFile', filter),
  showOpenDialog: () => ipcRenderer.invoke('file:showOpenDialog'),
});