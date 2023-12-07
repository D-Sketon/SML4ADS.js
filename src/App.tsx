import React, { ReactElement, useEffect, useReducer, useState } from "react";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Welcome from "./components/Welcome";
import AppContext from "./store/context";
import Home from "./components/Home";
import { initialState, reducer } from "./store/reducer";
import "./App.less";
import { notification } from "antd";
import { clearStore } from "./store/action";
import SettingsModal from "./components/modal/SettingsModal";
import OnlineMonitor from "./components/extends/OnlineMonitor";

type NotificationType = "success" | "info" | "warning" | "error";

function App(): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const [showSettingsModalVisible, setShowSettingsModalVisible] =
    useState(false);

  useEffect(() => {
    window.electronAPI.onOpenNotification(
      (_e, type: NotificationType, title, content) => {
        notification[type]({
          message: title,
          description: content,
        });
      }
    );
    window.electronAPI.onClearStore((_e) => {
      dispatch(clearStore());
    });
    window.electronAPI.onChangeRoute((_e, route) => {
      navigate(route);
    });
    return () => {
      window.electronAPI.offAllOpenNotification();
      window.electronAPI.offAllClearStore();
      window.electronAPI.offAllChangeRoute();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.electronAPI.onShowSettings((_e) => {
      if (state.workspacePath) setShowSettingsModalVisible(true);
      else {
        notification.warning({
          message: "Warning",
          description: "Please open a project first",
        });
      }
    });
    return () => {
      window.electronAPI.offAllShowSettings();
    };
  }, [state.workspacePath]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/onlineMonitor" element={<OnlineMonitor />} />
        <Route path="/" element={<Navigate to="/welcome" />} />
      </Routes>
      <SettingsModal
        isModalOpen={showSettingsModalVisible}
        handleCancel={() => setShowSettingsModalVisible(false)}
      />
    </AppContext.Provider>
  );
}

export default App;
