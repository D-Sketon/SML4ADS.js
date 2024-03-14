import React, { ReactElement, useEffect, useReducer, useState } from "react";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Welcome from "./components/Welcome";
import AppContext from "./store/context";
import Home from "./components/Home";
import { initialState, reducer } from "./store/reducer";
import "./App.less";
import { notification } from "antd";
import { clearStore, setConfig } from "./store/action";
import SettingsModal from "./components/modal/SettingsModal";
import { MConfig } from "./model/Config";
import extendRouter from "./extendRouter";

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
    window.electronAPI.onShowSettings((_e) => {
      setShowSettingsModalVisible(true);
    });
    return () => {
      window.electronAPI.offAllOpenNotification();
      window.electronAPI.offAllClearStore();
      window.electronAPI.offAllChangeRoute();
      window.electronAPI.offAllShowSettings();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // read config
  useEffect(() => {
    const asyncFn = async () => {
      const config: MConfig = await window.electronAPI.readConfig();
      dispatch(setConfig(config));
    };
    asyncFn();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Routes>
        <Route path="/home/*" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        {extendRouter()}
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
