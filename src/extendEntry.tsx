
import { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import { Card, Col, Row } from "antd";

import { meta as AdversarialAttackMeta } from "./components/extends/AdversarialAttack";
import { meta as CausalBayesianGenerationFuzzyTestMeta } from "./components/extends/CausalBayesianGenerationFuzzyTest";
import { meta as CausalInferenceMeta } from "./components/extends/CausalInference";
import { meta as CriticalScenariosMeta } from "./components/extends/CriticalScenarios";
import { meta as CriticalSpecificScenariosMeta } from "./components/extends/CriticalSpecificScenarios";
import { meta as IntervalizedWFAMeta } from "./components/extends/IntervalizedWFA";
import { meta as OnlineMonitorMeta } from "./components/extends/OnlineMonitor";
import { meta as RLModelingMeta } from "./components/extends/RLModeling";
import { meta as RLTrainingMeta } from "./components/extends/RLTraining";
import { meta as SimulationTestMeta } from "./components/extends/SimulationTest";
import { meta as TimeSeriesAnalysisMeta } from "./components/extends/TimeSeriesAnalysis";
import { meta as TimeSeriesClusteringMeta } from "./components/extends/TimeSeriesClustering";

const extendEntry = (): ReactElement => {
  return (
    <>
      <Row gutter={16} className="mt-2 mb-2">
              <Col span={8}>
                      <Card title={AdversarialAttackMeta.title} extra={<NavLink to="/adversarialAttack">More</NavLink>} className="h-52" hoverable={true}>
                      {AdversarialAttackMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={CausalBayesianGenerationFuzzyTestMeta.title} extra={<NavLink to="/causalBayesianGenerationFuzzyTest">More</NavLink>} className="h-52" hoverable={true}>
                      {CausalBayesianGenerationFuzzyTestMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={CausalInferenceMeta.title} extra={<NavLink to="/causalInference">More</NavLink>} className="h-52" hoverable={true}>
                      {CausalInferenceMeta.description}
                      </Card>
                    </Col>
            </Row>
<Row gutter={16} className="mt-2 mb-2">
              <Col span={8}>
                      <Card title={CriticalScenariosMeta.title} extra={<NavLink to="/criticalScenarios">More</NavLink>} className="h-52" hoverable={true}>
                      {CriticalScenariosMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={CriticalSpecificScenariosMeta.title} extra={<NavLink to="/criticalSpecificScenarios">More</NavLink>} className="h-52" hoverable={true}>
                      {CriticalSpecificScenariosMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={IntervalizedWFAMeta.title} extra={<NavLink to="/intervalizedWFA">More</NavLink>} className="h-52" hoverable={true}>
                      {IntervalizedWFAMeta.description}
                      </Card>
                    </Col>
            </Row>
<Row gutter={16} className="mt-2 mb-2">
              <Col span={8}>
                      <Card title={OnlineMonitorMeta.title} extra={<NavLink to="/onlineMonitor">More</NavLink>} className="h-52" hoverable={true}>
                      {OnlineMonitorMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={RLModelingMeta.title} extra={<NavLink to="/rLModeling">More</NavLink>} className="h-52" hoverable={true}>
                      {RLModelingMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={RLTrainingMeta.title} extra={<NavLink to="/rLTraining">More</NavLink>} className="h-52" hoverable={true}>
                      {RLTrainingMeta.description}
                      </Card>
                    </Col>
            </Row>
<Row gutter={16} className="mt-2 mb-2">
              <Col span={8}>
                      <Card title={SimulationTestMeta.title} extra={<NavLink to="/simulationTest">More</NavLink>} className="h-52" hoverable={true}>
                      {SimulationTestMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={TimeSeriesAnalysisMeta.title} extra={<NavLink to="/timeSeriesAnalysis">More</NavLink>} className="h-52" hoverable={true}>
                      {TimeSeriesAnalysisMeta.description}
                      </Card>
                    </Col>
<Col span={8}>
                      <Card title={TimeSeriesClusteringMeta.title} extra={<NavLink to="/timeSeriesClustering">More</NavLink>} className="h-52" hoverable={true}>
                      {TimeSeriesClusteringMeta.description}
                      </Card>
                    </Col>
            </Row>
    </>
  );
};

export default extendEntry;
  