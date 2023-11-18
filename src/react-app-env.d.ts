/// <reference types="react-scripts" />
export interface IElectronAPI {
  generateTree: (folderPath: string, excludeFiles?: string[]) => Promise<any>;
  readFile: (path: string) => Promise<string>;
  newProject: (projectName: string, projectPath: string) => Promise<boolean>;
  writeJson: (path: string, data: any) => Promise<void>;

  chooseFile: (filter: string[]) => Promise<any>;
  chooseDirectory: () => Promise<any>;

  openNotification: (callback: (event: any,
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    content: string) => any) => any;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
