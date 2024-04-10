import { Button, Card, notification } from "antd";
import { ReactElement } from "react";
import { ProjectType } from ".";
import { FILE_SUFFIX } from "../../../constants";

export default function Upload({
  setKey,
  projectData,
  setProjectData
}: {
  setKey: (key: string) => void;
  projectData: ProjectType;
  setProjectData: (data: ProjectType) => void;
}): ReactElement {

  const handleChooseCsvFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.CSV]);
    if (res.filePaths.length) {
      setProjectData({ ...projectData, csvPath: res.filePaths[0] });
    }
  };

  const handleNext = () => {
    if (projectData.csvPath === '点击上传csv文件') {
      notification.error({
        message: '请先上传csv文件',
      });
      return;
    }
    setKey("4");
  }

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg mb-3">{projectData.csvPath}</div>
          <div className="flex w-full justify-center gap-5">
            <Button type="primary" onClick={handleChooseCsvFile}>上传</Button>
          </div>
        </div>
      </Card>
      <Button type="primary" onClick={handleNext}>下一步</Button>
    </div>
  );
}
