import type { MConfig } from "../model/Config";

export enum ActionType {
  CLEAR_STORE = "CLEAR_STORE",
  SET_WORKSPACE_PATH = "SET_WORKSPACE_PATH",
  SET_CONFIG = "SET_CONFIG",
  SET_SAVE_FILE_PATH = "SET_SAVE_FILE_PATH",
  REFRESH_TREE = "REFRESH_TREE",
  ADD_FILE_PATH = "ADD_FILE_PATH",
  REMOVE_FILE_PATH = "REMOVE_FILE_PATH",
  ACTIVATE_FILE_PATH = "ACTIVATE_FILE_PATH",
}

export function setWorkspacePath(workspacePath: string) {
  return {
    type: ActionType.SET_WORKSPACE_PATH,
    payload: workspacePath,
  };
}

export function setConfig(config: MConfig) {
  return {
    type: ActionType.SET_CONFIG,
    payload: config,
  };
}

export function refreshTree() {
  return {
    type: ActionType.REFRESH_TREE,
  };
}

export function clearStore() {
  return {
    type: ActionType.CLEAR_STORE,
  };
}

export function addFilePath(path: string) {
  return {
    type: ActionType.ADD_FILE_PATH,
    payload: {
      path: path.replace(/\\/g, "/"),
      ext: path.split(".").pop(),
    },
  };
}

export function removeFilePath(path: string) {
  return {
    type: ActionType.REMOVE_FILE_PATH,
    payload: {
      path: path.replace(/\\/g, "/"),
    },
  };
}

export function activateFilePath(path: string) {
  return {
    type: ActionType.ACTIVATE_FILE_PATH,
    payload: {
      path: path.replace(/\\/g, "/"),
    },
  };
}

export function setSaveFilePath(path: string) {
  return {
    type: ActionType.SET_SAVE_FILE_PATH,
    payload: {
      path: path.replace(/\\/g, "/"),
    },
  };
}
