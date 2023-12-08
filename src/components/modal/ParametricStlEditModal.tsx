import { ReactElement, useEffect, useRef, useState } from "react";
import { BaseModalProps } from "./types";
import { Button, Flex, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";

function ParametricStlEditModal(
  props: BaseModalProps & {
    text: string;
    handleSave: (row: any) => void;
    record: any;
  }
): ReactElement {
  const {
    isModalOpen,
    handleCancel = () => {},
    text,
    handleSave,
    record,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [value, setValue] = useState(text);
  const textAreaRef = useRef(null);

  // computed
  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    record.parametricStls = value;
    handleSave(record);
    setConfirmLoading(false);
    handleCancel(e);
  };

  const getPositionForTextArea = (ctrl: any) => {
    let CaretPos = {
      start: 0,
      end: 0,
    };
    if (ctrl.selectionStart) {
      CaretPos.start = ctrl.selectionStart;
    }
    if (ctrl.selectionEnd) {
      CaretPos.end = ctrl.selectionEnd;
    }
    return CaretPos;
  };

  const setCursorPosition = (ctrl: any, pos: any) => {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  };

  const handleClick = (input: string) => {
    // @ts-ignore
    const currentTextArea = textAreaRef!.current.resizableTextArea.textArea;
    let position = getPositionForTextArea(currentTextArea); // 光标的位置
    let length = input.length;
    setValue((value) => {
      return value.slice(0, position.start) + input + value.slice(position.end);
    });
    setTimeout(() => {
      setCursorPosition(currentTextArea, position.start + length);
    });
  };

  return (
    <Modal
      title="Edit parametricStls"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Flex gap="small" wrap="wrap">
        <Button size="small" onClick={() => handleClick(" or ")}>
          {"\\/"}
        </Button>
        <Button size="small" onClick={() => handleClick(" and ")}>
          {"/\\"}
        </Button>
        <Button size="small" onClick={() => handleClick(" implies ")}>
          {"->"}
        </Button>
        <Button size="small" onClick={() => handleClick("always[:]")}>
          {"G"}
        </Button>
        <Button size="small" onClick={() => handleClick("eventually[:]")}>
          {"F"}
        </Button>
        <Button size="small" onClick={() => handleClick("until[:]")}>
          {"U"}
        </Button>
      </Flex>

      <TextArea
        ref={textAreaRef}
        style={{ marginTop: 16, fontFamily: 'Consolas, "Courier New", monospace' }}
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
      />
    </Modal>
  );
}

export default ParametricStlEditModal;
