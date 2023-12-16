import { Button, Col, Input, Modal, Row } from "antd";
import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import { setWorkspacePath } from "../../store/action";
import AppContext from "../../store/context";
import { useNavigate } from "react-router-dom";

function NewProjectModal(props: BaseModalProps): ReactElement {
  const { isModalOpen, handleCancel = () => {} } = props;

  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [path, setPath] = useState("");
  const [name, setName] = useState("");

  const handleChoose = async () => {
    const path = await window.electronAPI.chooseDirectory();
    setPath(path.filePaths[0]);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    const isSuccess = await window.electronAPI.newProject(path, name);
    if (isSuccess) {
      dispatch(setWorkspacePath(`${path}/${name}`));
      navigate("/home/logical");
    }
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <Modal
      title="New Project"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Directory:</Col>
        <Col span={18} className="flex">
          <Button type="primary" className="mr-4" onClick={handleChoose}>
            Choose
          </Button>
          <Input value={path} onChange={handlePathChange} />
        </Col>
      </Row>
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Project name:</Col>
        <Col span={18}>
          <Input
            placeholder="Please input project name"
            value={name}
            onChange={handleNameChange}
          />
        </Col>
      </Row>
    </Modal>
  );
}

export default NewProjectModal;
