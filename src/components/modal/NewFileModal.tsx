import { Col, Input, Modal, Row } from "antd";
import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import { refreshTree } from "../../store/action";
import AppContext from "../../store/context";

function NewFileDirectory(props: BaseModalProps & {
  path: string;
  ext: string;
}): ReactElement {
  const { isModalOpen, handleCancel = () => {}, path, ext } = props;

  const { dispatch } = useContext(AppContext);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    await window.electronAPI.newFile(path, name, ext);
    // refresh tree
    dispatch(refreshTree());
    setName("");
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <Modal
      title="New File"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row style={{ display: "flex", alignItems: "center", margin: "15px 0" }}>
        <Col span={6}>File name:</Col>
        <Col span={18}>
          <Input
            placeholder="Please input file name"
            value={name}
            onChange={handleNameChange}
          />
        </Col>
      </Row>
    </Modal>
  );
}

export default NewFileDirectory;
