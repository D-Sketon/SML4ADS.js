import React, { ReactElement, useReducer } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./components/Welcome";
import AppContext from "./store/context";
import Home from "./components/Home";
import { initialState, reducer } from "./store/reducer";
import './App.less';

function App(): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Navigate to="/welcome" />}></Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
