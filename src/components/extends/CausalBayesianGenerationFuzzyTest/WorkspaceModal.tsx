import {
  Button,
  Col,
  Input,
  Modal,
  notification,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
} from "antd";
import { ReactElement, useState } from "react";
import { BaseModalProps } from "../../modal/types";
import { useNavigate } from "react-router-dom";

export default function WorkspaceModal({
  isModalOpen,
  handleCancel = () => {},
  workspacePath,
  setWorkspacePath,
}: BaseModalProps & {
  workspacePath: string;
  setWorkspacePath: (path: string) => void;
}): ReactElement {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [path, setPath] = useState("");
  const [name, setName] = useState("");

  const handleChoose = async () => {
    const path = await window.electronAPI.chooseDirectory();
    setPath(path.filePaths[0]);
  };

  const handleChooseWorkspace = async () => {
    setConfirmLoading(true);
    const path = await window.electronAPI.chooseDirectory();
    setWorkspacePath(path.filePaths[0]);
    setConfirmLoading(false);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    if (value === 1) {
      if (workspacePath === "") {
        setConfirmLoading(false);
        notification.error({
          message: "Error",
          description: "Please choose a workspace",
        });
        return;
      }
      setConfirmLoading(false);
      handleCancel(e);
      return;
    }
    if (path === "" || name === "") {
      setConfirmLoading(false);
      notification.error({
        message: "Error",
        description: "Please input directory and project name",
      });
      return;
    }
    const isSuccess = await window.electronAPI.newProject(path, name);
    if (isSuccess) {
      setWorkspacePath(`${path}/${name}`);
    }
    setConfirmLoading(false);
    handleCancel(e);
  };

  const [value, setValue] = useState(1);
  const navigate = useNavigate();

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <Modal
      title="Workspace"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={(e) => {
        handleCancel(e);
        navigate("/");
      }}
      keyboard={false}
      maskClosable={false}
      closable={false}
    >
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1} className="flex items-center h-10">
            Open Workspace
            {value === 1 ? (
              <>
                <Button
                  type="primary"
                  className="ml-4"
                  onClick={handleChooseWorkspace}
                >
                  Open
                </Button>
                <span className="overflow-hidden text-ellipsis">
                  {workspacePath}
                </span>
              </>
            ) : null}
          </Radio>
          <Radio value={2}>New Workspace</Radio>
          {value === 2 ? (
            <>
              <Row className="flex items-center mt-4 mb-4">
                <Col span={6}>Directory:</Col>
                <Col span={18} className="flex">
                  <Button
                    type="primary"
                    className="mr-4"
                    onClick={handleChoose}
                  >
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
            </>
          ) : null}
        </Space>
      </Radio.Group>
    </Modal>
  );
}
