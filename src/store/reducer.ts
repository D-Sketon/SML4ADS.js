import { ActionType } from "./action"

export const initialState = {
  workspacePath: "",
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
    default:
      return state
  }
}