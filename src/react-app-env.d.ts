/// <reference types="react-scripts" />
export interface IElectronAPI {
  generateTree: (folderPath: string, excludeFiles?: string[]) => Promise<any>;
  readFile: (path: string) => Promise<string>;
  deleteFile: (path: string) => Promise<boolean>;
  newProject: (projectName: string, projectPath: string) => Promise<boolean>;
  newDirectory: (path: string, name: string) => Promise<boolean>;
  newFile: (
    path: string,
    name: string,
    ext: string,
    content?: string
  ) => Promise<boolean>;
  writeJson: (path: string, data: any) => Promise<boolean>;
  getRelativePath: (from: string, to: string) => Promise<string>;
  getAbsolutePath: (root: string, ...paths: string[]) => Promise<string>;

  chooseFile: (filter: string[]) => Promise<any>;
  chooseDirectory: () => Promise<any>;

  ADSML2Uppaal: (
    workSpacePath: string,
    modelPath: string,
    outputPath: string
  ) => Promise<void>;

  simulate: (params: any, port: number, host?: string) => Promise<void>;
  pstlMonitor: (signalPath: string, stlArray: string, isBase64: boolean, port?: number, host?: string) => Promise<string>;

  onOpenNotification: (
    callback: (
      event: any,
      type: "success" | "info" | "warning" | "error",
      title: string,
      content: string
    ) => any
  ) => any;
  onNewDirectory: (callback: (event: any) => any) => any;
  onNewFile: (callback: (event: any, ext: string) => any) => any;
  onDeleteFile: (callback: (event: any) => any) => any;
  onShowSettings: (callback: (event: any) => any) => any;
  onClearStore: (callback: (event: any) => any) => any;
  onChangeRoute: (callback: (event: any, route: string) => any) => any;

  offAllOpenNotification: () => any;
  offAllNewDirectory: () => any;
  offAllNewFile: () => any;
  offAllDeleteFile: () => any;
  offAllShowSettings: () => any;
  offAllClearStore: () => any;
  offAllChangeRoute: () => any;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
