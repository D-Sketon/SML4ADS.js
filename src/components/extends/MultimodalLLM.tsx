import { InboxOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  FloatButton,
  Input,
  UploadProps,
} from "antd";
import { UploadFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

export const meta = {
  title: "多模态大语言模型推理",
  description: "多模态大语言模型推理",
};

export default function MultimodalLLM(): ReactElement {
  const navigate = useNavigate();
  const [file, setFile] = useState<UploadFile[]>([]);
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("result");

  const props: UploadProps = {
    name: "file",
    listType: "picture",
    multiple: false,
    beforeUpload() {
      return false;
    },
    onChange({ fileList }) {
      setFile([
        {
          ...fileList[0],
          // @ts-ignore
          url: URL.createObjectURL(fileList[0].originFileObj),
        },
      ]);
    },
  };

  const handleSubmit = async () => {

  }

  return (
    <div className="extend-wrapper h-screen overflow-auto bg-stone-100">
      <div className="flex gap-10 m-5">
        <div className="flex flex-col flex-grow gap-5">
          <Card title="Upload">
            <Dragger {...props} maxCount={1} fileList={file}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Card>
          <Card title="Question">
            <Input.TextArea
              rows={2}
              placeholder="Please input your text"
              value={input}
              onInput={(e) => setInput(e.currentTarget.value)}
            />
          </Card>
          <div className="flex gap-5">
            <Button
              type="primary"
              className="flex-grow"
              danger
              onClick={() => {
                setInput("");
              }}
            >
              Clear
            </Button>
            <Button type="primary" className="flex-grow" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>

        <div className="flex flex-col flex-grow gap-5">=
          <Card title="Answer">
            <Input.TextArea autoSize value={result}/>
          </Card>
        </div>
      </div>

      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}
