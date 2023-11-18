
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  generateTree: (folderPath, excludeFiles) => ipcRenderer.invoke('io:generateTree',folderPath, excludeFiles),
  readFile: (filePath) => ipcRenderer.invoke('io:readFile', filePath),
  newProject: (path, name) => ipcRenderer.invoke('io:newProject', path, name),
  writeJson: (path, object) => ipcRenderer.invoke('io:writeJson', path, object),

  chooseFile: (filter) => ipcRenderer.invoke('ui:chooseFile', filter),
  chooseDirectory: () => ipcRenderer.invoke('ui:chooseDirectory'),

  openNotification: (callback) => ipcRenderer.on('ui:openNotification', callback)
});