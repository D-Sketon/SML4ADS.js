export enum ActionType {
  SET_WORKSPACE_PATH = "SET_WORKSPACE_PATH",
}

export function setWorkspacePath(workspacePath: string) {
  return {
    type: ActionType.SET_WORKSPACE_PATH,
    payload: workspacePath,
  };
}