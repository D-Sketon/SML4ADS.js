import { ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./Welcome.less";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import AppContext from "../store/context";
import { setWorkspacePath } from "../store/action";

function Welcome(): ReactElement {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  function handleNew() {}

  function handleOpen() {
    window.electronAPI.showOpenDialog().then((res) => {
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
          <Button type="link" size="large" onClick={handleOpen}>
            Open
          </Button>
        </div>
      </div>
    </>
  );
}

export default Welcome;
