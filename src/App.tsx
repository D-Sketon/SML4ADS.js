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
import OnlineMonitor from "./components/extends/OnlineMonitor";
import CausalInference from "./components/extends/CausalInference";
import IntervalizedWFA from "./components/extends/IntervalizedWFA";
import AdversarialAttack from "./components/extends/AdversarialAttack";
import TimeSeriesClustering from "./components/extends/TimeSeriesClustering";
import RLModeling from "./components/extends/RLModeling";
import CriticalSpecificScenarios from "./components/extends/CriticalSpecificScenarios";
import CriticalScenarios from "./components/extends/CriticalScenarios";
import SimulationTest from "./components/extends/SimulationTest";
import { MConfig } from "./model/Config";
import RLTraining from "./components/extends/RLTraining";
import TimeSeriesAnalysis from "./components/extends/TimeSeriesAnalysis";

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
        <Route path="/onlineMonitor" element={<OnlineMonitor />} />
        <Route path="/causalInference" element={<CausalInference />} />
        <Route path="/intervalizedWFA" element={<IntervalizedWFA />} />
        <Route path="/adversarialAttack" element={<AdversarialAttack />} />
        <Route
          path="/timeSeriesClustering"
          element={<TimeSeriesClustering />}
        />
        <Route path="/RLModeling" element={<RLModeling />} />
        <Route
          path="/criticalSpecificScenarios"
          element={<CriticalSpecificScenarios />}
        />
        <Route path="/criticalScenarios" element={<CriticalScenarios />} />
        <Route path="/simulationTest" element={<SimulationTest />} />
        <Route path="/RLTraining" element={<RLTraining />} />
        <Route path="/timeSeriesAnalysis" element={<TimeSeriesAnalysis />} />
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
