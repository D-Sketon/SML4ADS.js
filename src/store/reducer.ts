import { MConfig, defaultConfig } from "../model/Config"
import { ActionType } from "./action"

export const initialState = {
  workspacePath: "",
  refreshId: 0,
  config: JSON.parse(JSON.stringify(defaultConfig)) as MConfig,
}

interface Action {
  type: ActionType
  payload?: any
}

export const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_WORKSPACE_PATH:
      return {
        ...state,
        workspacePath: action.payload,
      }
    case ActionType.SET_CONFIG:
      return {
        ...state,
        config: action.payload,
      }
    case ActionType.REFRESH_TREE:
      return {
        ...state,
        refreshId: state.refreshId + 1,
      }
    case ActionType.CLEAR_STORE:
      return {
        ...JSON.parse(JSON.stringify(initialState)),
      }
    default:
      return state
  }
}