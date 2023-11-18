import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Welcome.less";
import { Button, notification } from "antd";
import Title from "antd/es/typography/Title";
import AppContext from "../store/context";
import { setConfig, setWorkspacePath } from "../store/action";
import NewProjectModal from "./modal/NewProjectModal";
import { MConfig, defaultConfig } from "../model/Config";

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
    const configPath = `${path}/.adsml/config.json`;
    try {
      const content = await window.electronAPI.readFile(configPath);
      const config: MConfig = JSON.parse(content);
      if (!config) {
        throw new Error("Invalid config file");
      }
      dispatch(setConfig(config));
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message,
      });
      // write default config
      await window.electronAPI.writeJson(configPath, defaultConfig);
      dispatch(setConfig(JSON.parse(JSON.stringify(defaultConfig))));
    }
  }

  return (
    <>
      <div className="welcome-wrapper">
        <Title>Welcome to SML4ADS</Title>
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
      </div>
      <NewProjectModal
        isModalOpen={NewProjectModalVisible}
        handleCancel={() => setNewProjectModalVisible(false)}
      />
    </>
  );
}

export default Welcome;
