import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import AppContext from "../store/context";
import { setWorkspacePath } from "../store/action";
import NewProjectModal from "./modal/NewProjectModal";

import "./Welcome.less";
import ExtendEntry from "../extendEntry";

export default function Welcome(): ReactElement {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const [disableOpenButton, setDisableOpenButton] = useState(false);
  const [NewProjectModalVisible, setNewProjectModalVisible] = useState(false);

  const handleNew = (): void => {
    setNewProjectModalVisible(true);
  };

  const handleOpen = async () => {
    setDisableOpenButton(true);
    const res = await window.electronAPI.chooseDirectory();
    setDisableOpenButton(false);
    if (res.filePaths.length) {
      dispatch(setWorkspacePath(res.filePaths[0]));
      navigate("/home/logical");
    }
  };

  return (
    <>
      <div className="welcome-wrapper bg-stone-100">
        <Title>面向ADS的安全攸关场景建模平台</Title>
        <div className="w-10/12">
          <Row gutter={16} className="mt-2 mb-2">
            <Col span={24}>
              <Card title="场景建模" hoverable={true} className="h-52">
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
                    Open Project
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
          <ExtendEntry />
        </div>
      </div>
      <NewProjectModal
        isModalOpen={NewProjectModalVisible}
        handleCancel={() => setNewProjectModalVisible(false)}
      />
    </>
  );
}
