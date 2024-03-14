
import React, { ReactElement } from "react";
import { Route } from "react-router-dom";
import AdversarialAttack from "./components/extends/AdversarialAttack";
import CausalInference from "./components/extends/CausalInference";
import CriticalScenarios from "./components/extends/CriticalScenarios";
import CriticalSpecificScenarios from "./components/extends/CriticalSpecificScenarios";
import IntervalizedWFA from "./components/extends/IntervalizedWFA";
import OnlineMonitor from "./components/extends/OnlineMonitor";
import RLModeling from "./components/extends/RLModeling";
import RLTraining from "./components/extends/RLTraining";
import SimulationTest from "./components/extends/SimulationTest";
import TimeSeriesAnalysis from "./components/extends/TimeSeriesAnalysis";
import TimeSeriesClustering from "./components/extends/TimeSeriesClustering";

const extendRouter = (): ReactElement => {
  return (
    <React.Fragment>
      <Route path="/adversarialAttack" element={<AdversarialAttack />} />
<Route path="/causalInference" element={<CausalInference />} />
<Route path="/criticalScenarios" element={<CriticalScenarios />} />
<Route path="/criticalSpecificScenarios" element={<CriticalSpecificScenarios />} />
<Route path="/intervalizedWFA" element={<IntervalizedWFA />} />
<Route path="/onlineMonitor" element={<OnlineMonitor />} />
<Route path="/rLModeling" element={<RLModeling />} />
<Route path="/rLTraining" element={<RLTraining />} />
<Route path="/simulationTest" element={<SimulationTest />} />
<Route path="/timeSeriesAnalysis" element={<TimeSeriesAnalysis />} />
<Route path="/timeSeriesClustering" element={<TimeSeriesClustering />} />
    </React.Fragment>
  );
};

export default extendRouter;
  