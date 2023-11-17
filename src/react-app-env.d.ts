/// <reference types="react-scripts" />
export interface IElectronAPI {
  generateTree: (folderPath: string, excludeFiles?: string[]) => Promise<any>;
  chooseFile: (filter: string[]) => Promise<any>;
  showOpenDialog: () => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
