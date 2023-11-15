
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  generateTree: () => ipcRenderer.invoke('file:generateTree'),
  chooseFile: () => ipcRenderer.invoke('file:chooseFile')
});