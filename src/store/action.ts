export enum ActionType {
  SET_WORKSPACE_PATH = "SET_WORKSPACE_PATH",
  REFRESH_TREE = "REFRESH_TREE",
}

export function setWorkspacePath(workspacePath: string) {
  return {
    type: ActionType.SET_WORKSPACE_PATH,
    payload: workspacePath,
  };
}

export function refreshTree() {
  return {
    type: ActionType.REFRESH_TREE,
  };
}