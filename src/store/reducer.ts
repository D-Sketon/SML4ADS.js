import { FILE_SUFFIX } from "../constants"
import { defaultConfig } from "../model/Config"
import { ActionType } from "./action"

export const initialState = {
  workspacePath: "",
  // only for refresh
  refreshId: 0,
  // only for save
  saveFilePath: '',
  config: defaultConfig(),
  filePath: [] as {
    path: string,
    ext: FILE_SUFFIX | string,
    isActive: boolean,
  }[],
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
    case ActionType.ADD_FILE_PATH: {
      const isFind = state.filePath.find((p) => p.path === action.payload.path)
      if (isFind) return {
        ...state,
        filePath: state.filePath.map((p) => ({
          ...p,
          isActive: p.path === action.payload.path,
        })),
      }
      return {
        ...state,
        filePath: state.filePath.map((p) => ({
          ...p,
          isActive: false,
        })).concat({
          path: action.payload.path,
          ext: action.payload.ext,
          isActive: true,
        }),
      }
    }
    case ActionType.REMOVE_FILE_PATH: {
      const filtered = state.filePath.filter((p) => p.path !== action.payload.path)
      if (filtered.length && state.filePath.find((p) => p.path === action.payload.path)?.isActive) {
        filtered[0].isActive = true
      }
      return {
        ...state,
        filePath: filtered
      }
    }
    case ActionType.ACTIVATE_FILE_PATH:
      return {
        ...state,
        filePath: state.filePath.map((p) => ({
          ...p,
          isActive: p.path === action.payload.path,
        })),
      }
    case ActionType.SET_SAVE_FILE_PATH:
      return {
        ...state,
        saveFilePath: action.payload.path,
      }
    default:
      return state
  }
}