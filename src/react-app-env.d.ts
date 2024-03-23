/// <reference types="react-scripts" />

import { MConfig } from "./model/Config";

export interface IElectronAPI {
  generateTree: (
    folderPath: string,
    excludeFiles?: string[],
    depth?: number
  ) => Promise<any>;
  _generateTree: (
    folderPath: string,
    excludeFiles?: string[],
    depth?: number
  ) => Promise<any>;
  readFile: (path: string, encoding?: BufferEncoding) => Promise<string>;
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
  writeFile: (path: string, content: string) => Promise<boolean>;
  getRelativePath: (from: string, to: string) => Promise<string>;
  getAbsolutePath: (root: string, ...paths: string[]) => Promise<string>;
  readConfig: () => Promise<MConfig>;
  writeConfig: (object: MConfig) => Promise<boolean>;

  chooseFile: (filter: string[]) => Promise<any>;
  chooseDirectory: () => Promise<any>;

  ADSML2Uppaal: (
    workSpacePath: string,
    modelPath: string,
    outputPath: string
  ) => Promise<void>;

  ADSML2OpenScenario: (adsml: string) => Promise<string>;

  generateStl: (odd: string, template: string) => Promise<string>;

  simulate: (params: any, port: number, host?: string) => Promise<any>;
  visualize: (
    type: string,
    path: string,
    cars: any,
    pedestrians: any,
    port: number,
    host?: string
  ) => Promise<any>;
  extendRPC: (
    funcName: string,
    host: string,
    port: string | number,
    ...args: any[]
  ) => Promise<any>;

  evaluateEnvironment: (environment: Environment) => Promise<number>;
  evaluateCar: (cars: MCar[]) => Promise<number>;
  evaluatePedestrian: (pedestrians: MPedestrian[]) => Promise<number>;
  evaluateRider: (riders: MRider[]) => Promise<number>;
  evaluateMap: (map: string) => Promise<number>;
  evaluateTree: (tree: MTree) => Promise<number>;

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

  onVideoFileSelected: (videoFilePath: string) => Promise<{
    type: string;
    videoSource: string;
    duration?: number;
  }>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
