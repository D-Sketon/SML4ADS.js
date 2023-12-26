import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  generateTree: (folderPath: string, excludeFiles?: string[], depth?: number) =>
    ipcRenderer.invoke("io:generateTree", folderPath, excludeFiles, depth),
  _generateTree: (
    folderPath: string,
    excludeFiles?: string[],
    depth?: number
  ) => ipcRenderer.invoke("io:_generateTree", folderPath, excludeFiles, depth),
  readFile: (filePath: string, encoding?: BufferEncoding) =>
    ipcRenderer.invoke("io:readFile", filePath, encoding),
  deleteFile: (filePath: string) =>
    ipcRenderer.invoke("io:deleteFile", filePath),
  newProject: (path: string, name: string) =>
    ipcRenderer.invoke("io:newProject", path, name),
  newDirectory: (path: string, name: string) =>
    ipcRenderer.invoke("io:newDirectory", path, name),
  newFile: (path: string, name: string, ext: string, content?: string) =>
    ipcRenderer.invoke("io:newFile", path, name, ext, content),
  writeJson: (path: string, object: any) =>
    ipcRenderer.invoke("io:writeJson", path, object),
  getRelativePath: (from: string, to: string) =>
    ipcRenderer.invoke("io:getRelativePath", from, to),
  getAbsolutePath: (root: string, ...paths: string[]) =>
    ipcRenderer.invoke("io:getAbsolutePath", root, ...paths),
  readConfig: () => ipcRenderer.invoke("io:readConfig"),
  writeConfig: (object: any) => ipcRenderer.invoke("io:writeConfig", object),

  chooseFile: (filter: string[]) => ipcRenderer.invoke("ui:chooseFile", filter),
  chooseDirectory: () => ipcRenderer.invoke("ui:chooseDirectory"),

  ADSML2Uppaal: (
    workSpacePath: string,
    modelPath: string,
    outputPath: string
  ) =>
    ipcRenderer.invoke(
      "verifier:ADSML2Uppaal",
      workSpacePath,
      modelPath,
      outputPath
    ),

  adversarialAttack: (
    csvPath: string,
    rnnPath: string,
    pklPath: string,
    weightPath: string,
    port?: number,
    host?: string
  ) =>
    ipcRenderer.invoke(
      "rpc:adversarialAttack",
      csvPath,
      rnnPath,
      pklPath,
      weightPath,
      port,
      host
    ),
  causalInference: (
    csvPath: string,
    params: Record<string, any>,
    port?: number,
    host?: string
  ) => ipcRenderer.invoke("rpc:causalInference", csvPath, params, port, host),
  criticalScenarios: (
    carlaPort: number,
    mapPath: string,
    modelPath: string,
    port?: number,
    host?: string
  ) =>
    ipcRenderer.invoke(
      "rpc:criticalScenarios",
      carlaPort,
      mapPath,
      modelPath,
      port,
      host
    ),
  criticalSpecificScenarios: (
    carlaPort: number,
    modelPath: string,
    outputPath: string,
    port?: number,
    host?: string
  ) =>
    ipcRenderer.invoke(
      "rpc:criticalSpecificScenarios",
      carlaPort,
      modelPath,
      outputPath,
      port,
      host
    ),
  intervalizedWFA: (
    csvPath: string,
    rnnPath: string,
    pklPath: string,
    port?: number,
    host?: string
  ) =>
    ipcRenderer.invoke(
      "rpc:intervalizedWFA",
      csvPath,
      rnnPath,
      pklPath,
      port,
      host
    ),
  onlineMonitor: (
    signalPort: string,
    stlArray: string,
    isBase64: boolean,
    port?: number,
    host?: string
  ) =>
    ipcRenderer.invoke(
      "rpc:onlineMonitor",
      signalPort,
      stlArray,
      isBase64,
      port,
      host
    ),
  rLModeling: (csvPath: string, port?: number, host?: string) =>
    ipcRenderer.invoke("rpc:rLModeling", csvPath, port, host),
  simulationTest: (
    csvPath: string,
    scenario: string,
    metrics: string[],
    port?: number,
    host?: string
  ) =>
    ipcRenderer.invoke(
      "rpc:simulationTest",
      csvPath,
      scenario,
      metrics,
      port,
      host
    ),
  timeSeriesClustering: (
    npyPath: string,
    k: number,
    port?: number,
    host?: string
  ) => ipcRenderer.invoke("rpc:timeSeriesClustering", npyPath, k, port, host),

  simulate: (params: any, port: number, host?: string) =>
    ipcRenderer.invoke("rpc:simulate", params, port, host),
  visualize: (
    type: string,
    path: string,
    car: any,
    pedestrians: any,
    port: number,
    host?: string
  ) =>
    ipcRenderer.invoke(
      "rpc:visualize",
      type,
      path,
      car,
      pedestrians,
      port,
      host
    ),
  onVideoFileSelected: (videoFilePath: string) =>
    ipcRenderer.invoke("video:fileSelect", videoFilePath),

  onOpenNotification: (
    callback: (
      event: any,
      type: "success" | "info" | "warning" | "error",
      title: string,
      content: string
    ) => any
  ) => ipcRenderer.on("ui:onOpenNotification", callback),
  onNewDirectory: (callback: (event: any) => any) =>
    ipcRenderer.on("ui:onNewDirectory", callback),
  onNewFile: (callback: (event: any, ext: string) => any) =>
    ipcRenderer.on("ui:onNewFile", callback),
  onDeleteFile: (callback: (event: any) => any) =>
    ipcRenderer.on("ui:onDeleteFile", callback),
  onShowSettings: (callback: (event: any) => any) =>
    ipcRenderer.on("ui:onShowSettings", callback),
  onClearStore: (callback: (event: any) => any) =>
    ipcRenderer.on("chore:onClearStore", callback),
  onChangeRoute: (callback: (event: any, route: string) => any) =>
    ipcRenderer.on("chore:onChangeRoute", callback),

  offAllOpenNotification: () =>
    ipcRenderer.removeAllListeners("ui:onOpenNotification"),
  offAllNewDirectory: () => ipcRenderer.removeAllListeners("ui:onNewDirectory"),
  offAllNewFile: () => ipcRenderer.removeAllListeners("ui:onNewFile"),
  offAllDeleteFile: () => ipcRenderer.removeAllListeners("ui:onDeleteFile"),
  offAllShowSettings: () => ipcRenderer.removeAllListeners("ui:onShowSettings"),
  offAllClearStore: () => ipcRenderer.removeAllListeners("chore:onClearStore"),
  offAllChangeRoute: () =>
    ipcRenderer.removeAllListeners("chore:onChangeRoute"),
});
