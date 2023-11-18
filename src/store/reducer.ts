import { ActionType } from "./action"

export const initialState = {
  workspacePath: "",
  refreshId: 0,
}

interface Action {
  type: ActionType
  payload: any
}

export const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_WORKSPACE_PATH:
      return {
        ...state,
        workspacePath: action.payload,
      }
    case ActionType.REFRESH_TREE:
      return {
        ...state,
        refreshId: state.refreshId + 1,
      }
    default:
      return state
  }
}