
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  generateTree: (folderPath, excludeFiles) => ipcRenderer.invoke('io:generateTree',folderPath, excludeFiles),
  readFile: (filePath) => ipcRenderer.invoke('io:readFile', filePath),
  deleteFile: (filePath) => ipcRenderer.invoke('io:deleteFile', filePath),
  newProject: (path, name) => ipcRenderer.invoke('io:newProject', path, name),
  newDirectory: (path, name) => ipcRenderer.invoke('io:newDirectory', path, name),
  newFile: (path, name, ext, content) => ipcRenderer.invoke('io:newFile', path, name, ext, content),
  writeJson: (path, object) => ipcRenderer.invoke('io:writeJson', path, object),
  getRelativePath: (from, to) => ipcRenderer.invoke('io:getRelativePath', from, to),

  chooseFile: (filter) => ipcRenderer.invoke('ui:chooseFile', filter),
  chooseDirectory: () => ipcRenderer.invoke('ui:chooseDirectory'),

  onOpenNotification: (callback) => ipcRenderer.on('ui:onOpenNotification', callback),
  onNewDirectory: (callback) => ipcRenderer.on('ui:onNewDirectory', callback),
  onNewFile: (callback) => ipcRenderer.on('ui:onNewFile', callback),
  onDeleteFile: (callback) => ipcRenderer.on('ui:onDeleteFile', callback),
  onShowSettings: (callback) => ipcRenderer.on('ui:onShowSettings', callback),
  onClearStore: (callback) => ipcRenderer.on('chore:onClearStore', callback),
  onChangeRoute: (callback) => ipcRenderer.on('chore:onChangeRoute', callback),

  offAllOpenNotification: () => ipcRenderer.removeAllListeners('ui:onOpenNotification'),
  offAllNewDirectory: () => ipcRenderer.removeAllListeners('ui:onNewDirectory'),
  offAllNewFile: () => ipcRenderer.removeAllListeners('ui:onNewFile'),
  offAllDeleteFile: () => ipcRenderer.removeAllListeners('ui:onDeleteFile'),
  offAllShowSettings: () => ipcRenderer.removeAllListeners('ui:onShowSettings'),
  offAllClearStore: () => ipcRenderer.removeAllListeners('chore:onClearStore'),
  offAllChangeRoute: () => ipcRenderer.removeAllListeners('chore:onChangeRoute'),
});