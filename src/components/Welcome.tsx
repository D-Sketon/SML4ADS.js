import { ReactElement, useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, notification } from "antd";
import Title from "antd/es/typography/Title";
import AppContext from "../store/context";
import { setConfig, setWorkspacePath } from "../store/action";
import NewProjectModal from "./modal/NewProjectModal";
import { MConfig, defaultConfig } from "../model/Config";
import { GLOBAL_CONSTANTS } from "../constants";

import "./Welcome.less";

function Welcome(): ReactElement {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const [disableOpenButton, setDisableOpenButton] = useState(false);
  const [NewProjectModalVisible, setNewProjectModalVisible] = useState(false);

  function handleNew() {
    setNewProjectModalVisible(true);
  }

  async function handleOpen() {
    setDisableOpenButton(true);
    const res = await window.electronAPI.chooseDirectory();
    setDisableOpenButton(false);
    if (res.filePaths.length) {
      dispatch(setWorkspacePath(res.filePaths[0]));
      await validateConfig(res.filePaths[0]);
      navigate("/home");
    }
  }

  async function validateConfig(path: string) {
    const configPath = `${path}/${GLOBAL_CONSTANTS.CONFIG_FILE_DIR}/${GLOBAL_CONSTANTS.CONFIG_FILE_NAME}`;
    try {
      const content = await window.electronAPI.readFile(configPath);
      const config: MConfig = JSON.parse(content);
      if (!config) {
        throw new Error("Invalid config file");
      }
      dispatch(setConfig(config));
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: "Error",
        description: error.message,
      });
      // write default config
      await window.electronAPI.writeJson(configPath, defaultConfig());
      dispatch(setConfig(defaultConfig()));
    }
  }

  return (
    <>
      <div className="welcome-wrapper">
        <Title>Welcome to SML4ADS</Title>
        <div style={{ width: "85%" }}>
          <Row gutter={16} style={{ margin: "10px 0" }}>
            <Col span={24}>
              <Card
                title="场景建模"
                hoverable={true}
                style={{ height: "200px" }}
              >
                <div className="welcome-button">
                  <Button type="link" size="large" onClick={handleNew}>
                    New Project
                  </Button>
                  <Button
                    type="link"
                    size="large"
                    onClick={handleOpen}
                    disabled={disableOpenButton}
                  >
                    Open
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ margin: "10px 0" }}>
            <Col span={8}>
              <Card
                title="因果推理"
                hoverable={true}
                extra={<NavLink to="/causalInference">More</NavLink>}
                style={{ height: "200px" }}
              >
                从时间序列数据中挖掘因果关系，以提高模型的鲁棒性和可解释性。
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="抽象自动机"
                hoverable={true}
                extra={<NavLink to="/intervalizedWFA">More</NavLink>}
                style={{ height: "200px" }}
              >
                构建一个抽象自动机（Intervalized Weighted Finite Automaton,
                i-WFA），以模拟和理解RNN模型对时间序列数据的处理方式。
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="对抗攻击"
                hoverable={true}
                extra={<NavLink to="/adversarialAttack">More</NavLink>}
                style={{ height: "200px" }}
              >
                利用识别出的Vulnerable Negative Samples（VNS）和Target Positive
                Samples（TPS），开发一种对抗性攻击方法，用于测试和改进时间序列数据模型的鲁棒性。
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ margin: "10px 0" }}>
            <Col span={8}>
              <Card
                title="逻辑场景到关键具体场景生成"
                hoverable={true}
                extra={<NavLink to="/criticalSpecificScenarios">More</NavLink>}
                style={{ height: "200px" }}
              >
                将工具前端生成的逻辑场景模型输入，输出具体初始场景。
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="逻辑场景到具体场景生成"
                hoverable={true}
                extra={<NavLink to="/criticalScenarios">More</NavLink>}
                style={{ height: "200px" }}
              >
                将工具前端生成的逻辑场景模型输入，输出具体初始场景。
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="多维时序数据聚类"
                hoverable={true}
                extra={<NavLink to="/timeSeriesClustering">More</NavLink>}
                style={{ height: "200px" }}
              >
                将多维时序数据分类出具有意义的子序列，输出图片。
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ margin: "10px 0" }}>
            <Col span={8}>
              <Card
                title="强化学习建模"
                hoverable={true}
                extra={<NavLink to="/RLModeling">More</NavLink>}
                style={{ height: "200px" }}
              >
                实现对MDP文件的可视化展示，以及模型的动态编辑。
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="在线监测"
                hoverable={true}
                extra={<NavLink to="/onlineMonitor">More</NavLink>}
                style={{ height: "200px" }}
              >
                实现对STL、LTL等规约的在线监测。
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="仿真测试"
                hoverable={true}
                extra={<NavLink to="/simulationTest">More</NavLink>}
                style={{ height: "200px" }}
              >
                实现对自动驾驶系统进行测试。用户可以选择上传自己的感知、规控模型，拼装成一辆自动驾驶车辆。随后用户选择测试场景，评估指标。最终展示测试报告。
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <NewProjectModal
        isModalOpen={NewProjectModalVisible}
        handleCancel={() => setNewProjectModalVisible(false)}
      />
    </>
  );
}

export default Welcome;
