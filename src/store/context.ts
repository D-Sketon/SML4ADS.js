import { createContext } from "react";
import { initialState } from "./reducer";

const AppContext = createContext<{
  state: typeof initialState;
  dispatch: (...args: any) => any;
}>({
  state: initialState,
  dispatch: () => {},
});

export default AppContext;
