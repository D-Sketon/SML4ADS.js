/// <reference types="react-scripts" />
export interface IElectronAPI {
  generateTree: (folderPath: string, excludeFiles?: string[]) => Promise<any>;
  chooseFile: (filter: string[]) => Promise<any>;
  chooseDirectory: () => Promise<any>;
  readFile: (path: string) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
