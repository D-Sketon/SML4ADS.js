export enum FILE_SUFFIX {
  TREE = "tree",
  MODEL = "model",
  JSON = "json",
  XML = "xml",
  XODR = "xodr",
  ADSML = "adsml",
}

export enum FILE_TYPE {
  DIRECTORY = "directory",
  FILE = "file",
}

export enum FILE_OPERATION {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  RENAME = "rename",
}

export const GLOBAL_CONSTANTS = {
  CONFIG_FILE_DIR: ".adsml",
  CONFIG_FILE_NAME: "config.json",
};
