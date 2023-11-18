
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  generateTree: (folderPath, excludeFiles) => ipcRenderer.invoke('io:generateTree',folderPath, excludeFiles),
  readFile: (filePath) => ipcRenderer.invoke('io:readFile', filePath),
  deleteFile: (filePath) => ipcRenderer.invoke('io:deleteFile', filePath),
  newProject: (path, name) => ipcRenderer.invoke('io:newProject', path, name),
  newDirectory: (path, name) => ipcRenderer.invoke('io:newDirectory', path, name),
  newFile: (path, name, ext, content) => ipcRenderer.invoke('io:newFile', path, name, ext, content),
  writeJson: (path, object) => ipcRenderer.invoke('io:writeJson', path, object),

  chooseFile: (filter) => ipcRenderer.invoke('ui:chooseFile', filter),
  chooseDirectory: () => ipcRenderer.invoke('ui:chooseDirectory'),

  openNotification: (callback) => ipcRenderer.on('ui:openNotification', callback)
});