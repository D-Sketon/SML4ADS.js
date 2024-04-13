import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  InputNumber,
  Progress,
  UploadFile,
  UploadProps,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { ReactElement, useState } from "react";

export default function ImitationLearningTraining(): ReactElement {
  const [csvPath, setCsvPath] = useState<string>("");
  const [file, setFile] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: "file",
    accept: ".csv",
    multiple: false,
    beforeUpload() {
      return false;
    },
    onChange({ fileList }) {
      // @ts-ignore
      setCsvPath(fileList[0].originFileObj?.path);
      setFile(fileList);
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <Card title="模仿学习训练">
        <div className="flex justify-between items-center m-4">
          <div className="flex gap-10 items-center w-40 shrink-0">
            数据集选择
          </div>
          <Dragger {...props} maxCount={1} fileList={file} className="grow">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击上传/拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">请上传CSV文件，大小在1GB以内</p>
          </Dragger>
        </div>
        <Button type="primary" className="w-full">
          上传
        </Button>
        <div className="flex justify-between items-center m-4">
          <div className="flex gap-10 items-center w-40">数据集配置</div>
          <div style={{ width: "100%" }}>
            <div style={{ flex: 1 }}>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">学习率:</div>
                <InputNumber className="w-44" />
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">批量大小:</div>
                <InputNumber className="w-44" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">优化器:</div>
                <InputNumber className="w-44" />
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">迭代次数:</div>
                <InputNumber className="w-44" />
              </div>
            </div>
          </div>
        </div>
        <Button type="primary" className="w-full">
          参数确认
        </Button>
        <div className="flex justify-between items-center m-4">
          <div className="flex gap-10 items-center w-40">训练进度</div>
          <Progress percent={30} />
        </div>
      </Card>
    </div>
  );
}
