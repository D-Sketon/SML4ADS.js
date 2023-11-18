/// <reference types="react-scripts" />
export interface IElectronAPI {
  generateTree: (folderPath: string, excludeFiles?: string[]) => Promise<any>;
  readFile: (path: string) => Promise<string>;
  deleteFile: (path: string) => Promise<boolean>;
  newProject: (projectName: string, projectPath: string) => Promise<boolean>;
  newDirectory: (path: string, name: string) => Promise<boolean>;
  newFile: (path: string, name: string, ext: string, content?: string) => Promise<boolean>;
  writeJson: (path: string, data: any) => Promise<boolean>;

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
