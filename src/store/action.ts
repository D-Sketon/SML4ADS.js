import type { MConfig } from "../model/Config";

export enum ActionType {
  CLEAR_STORE = "CLEAR_STORE",
  SET_WORKSPACE_PATH = "SET_WORKSPACE_PATH",
  SET_CONFIG = "SET_CONFIG",
  REFRESH_TREE = "REFRESH_TREE",
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
