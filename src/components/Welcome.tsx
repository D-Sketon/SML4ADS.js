import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Welcome.less";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import AppContext from "../store/context";
import { setWorkspacePath } from "../store/action";
import NewProjectModal from "./modal/NewProjectModal/index.";

function Welcome(): ReactElement {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const [disableOpenButton, setDisableOpenButton] = useState(false);
  const [NewProjectModalVisible, setNewProjectModalVisible] = useState(false);

  function handleNew() {
    setNewProjectModalVisible(true)
  }

  function handleOpen() {
    setDisableOpenButton(true);
    window.electronAPI.chooseDirectory().then((res) => {
      setDisableOpenButton(false);
      if (res.filePaths.length) {
        dispatch(setWorkspacePath(res.filePaths[0]));
        navigate("/home");
      }
    });
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
