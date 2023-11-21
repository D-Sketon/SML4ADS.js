
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  generateTree: (folderPath: string, excludeFiles?: string[]) => ipcRenderer.invoke('io:generateTree', folderPath, excludeFiles),
  readFile: (filePath: string) => ipcRenderer.invoke('io:readFile', filePath),
  deleteFile: (filePath: string) => ipcRenderer.invoke('io:deleteFile', filePath),
  newProject: (path: string, name: string) => ipcRenderer.invoke('io:newProject', path, name),
  newDirectory: (path: string, name: string) => ipcRenderer.invoke('io:newDirectory', path, name),
  newFile: (path: string, name: string, ext: string, content?: string) => ipcRenderer.invoke('io:newFile', path, name, ext, content),
  writeJson: (path: string, object: any) => ipcRenderer.invoke('io:writeJson', path, object),
  getRelativePath: (from: string, to: string) => ipcRenderer.invoke('io:getRelativePath', from, to),
  getAbsolutePath: (root: string, ...paths: string[]) => ipcRenderer.invoke('io:getAbsolutePath', root, ...paths),

  chooseFile: (filter: string[]) => ipcRenderer.invoke('ui:chooseFile', filter),
  chooseDirectory: () => ipcRenderer.invoke('ui:chooseDirectory'),

  ADSML2Uppaal: (workSpacePath: string, modelPath: string, outputPath: string) => ipcRenderer.invoke('verifier:ADSML2Uppaal', workSpacePath, modelPath, outputPath),

  onOpenNotification: (callback: (event: any,
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    content: string) => any) => ipcRenderer.on('ui:onOpenNotification', callback),
  onNewDirectory: (callback: (event: any) => any) => ipcRenderer.on('ui:onNewDirectory', callback),
  onNewFile: (callback: (event: any, ext: string) => any) => ipcRenderer.on('ui:onNewFile', callback),
  onDeleteFile: (callback: (event: any) => any) => ipcRenderer.on('ui:onDeleteFile', callback),
  onShowSettings: (callback: (event: any) => any) => ipcRenderer.on('ui:onShowSettings', callback),
  onClearStore: (callback: (event: any) => any) => ipcRenderer.on('chore:onClearStore', callback),
  onChangeRoute: (callback: (event: any, route: string) => any) => ipcRenderer.on('chore:onChangeRoute', callback),

  offAllOpenNotification: () => ipcRenderer.removeAllListeners('ui:onOpenNotification'),
  offAllNewDirectory: () => ipcRenderer.removeAllListeners('ui:onNewDirectory'),
  offAllNewFile: () => ipcRenderer.removeAllListeners('ui:onNewFile'),
  offAllDeleteFile: () => ipcRenderer.removeAllListeners('ui:onDeleteFile'),
  offAllShowSettings: () => ipcRenderer.removeAllListeners('ui:onShowSettings'),
  offAllClearStore: () => ipcRenderer.removeAllListeners('chore:onClearStore'),
  offAllChangeRoute: () => ipcRenderer.removeAllListeners('chore:onChangeRoute'),
});