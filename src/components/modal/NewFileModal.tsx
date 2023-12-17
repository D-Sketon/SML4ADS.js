import { Col, Input, Modal, Row } from "antd";
import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import { refreshTree } from "../../store/action";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";
import { defaultModel } from "../../model/Model";
import { defaultTree } from "../../model/Tree";

export default function NewFileDirectory({
  isModalOpen,
  handleCancel = () => {},
  path,
  ext,
}: BaseModalProps & {
  path: string;
  ext: string;
}): ReactElement {
  const { dispatch } = useContext(AppContext);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    let content = "";
    if (ext === FILE_SUFFIX.MODEL) {
      content = JSON.stringify(defaultModel());
    } else if (ext === FILE_SUFFIX.TREE) {
      content = JSON.stringify(defaultTree());
    }
    await window.electronAPI.newFile(path, name, ext, content);
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
      <Row className="flex items-center mt-4 mb-4">
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
