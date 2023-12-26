/* eslint-disable jsx-a11y/anchor-is-valid */
import { ReactElement, useEffect, useRef, useState } from "react";
import { FILE_SUFFIX } from "../../../constants";
import Table, { ColumnsType } from "antd/es/table";
import { Card, Space } from "antd";
import DeleteConfirmModal from "../../modal/DeleteConfirmModal";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./StreamPlayTech";
import VideoJS from "./VideoJS";

interface SimulationResultProps {
  path: string;
}

interface DataType {
  key: string;
  name: string;
  date: string;
  hasVideo: boolean;
  path: string;
}

export default function SimulationResult({
  path,
}: SimulationResultProps): ReactElement {
  const modelPath = path.slice(
    0,
    -FILE_SUFFIX.VIRTUAL_SIMULATION_RESULT.length - 1
  );
  const recordFolderPath =
    modelPath.split("/").slice(0, -1).join("/") + "/.records";

  const [tableData, setTableData] = useState<DataType[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePath, setDeletePath] = useState("");
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [videoOptions, setVideoOptions] = useState<any>({
    autoplay: true,
    controls: true,
    width: "300px",
    height: "300px",
    responsive: true,
    fluid: true,
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Video",
      dataIndex: "hasVideo",
      key: "hasVideo",
      render: (hasVideo) => (hasVideo ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setIsDeleteModalOpen(true);
              setDeletePath(record.path);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const asyncFn = async () => {
      const tree = await window.electronAPI.generateTree(
        recordFolderPath,
        [],
        1
      );
      const recordList: any[] = tree[0].children;
      const partialData: Partial<DataType>[] = recordList.map(
        (record: any, index) => {
          const fileName: string[] = record.title.split("_");
          const date = fileName.shift() + " " + fileName.shift();
          const simulationName = fileName.join("_")
            ? fileName.join("_")
            : "Untitled";
          return {
            key: index + "",
            name: simulationName,
            date,
            path: record.key,
          };
        }
      );
      (
        await Promise.all(
          recordList.map((record: any) =>
            window.electronAPI.generateTree(
              record.key.replace(/\\/g, "/") + "/scenario/img",
              [],
              1
            )
          )
        )
      ).forEach((children: any[], index) => {
        partialData[index].hasVideo = children[0].children.length > 0;
      });
      setTableData([...partialData] as DataType[]);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowSelection = {
    onChange: async (
      selectedRowKeys: React.Key[],
      selectedRows: DataType[]
    ) => {
      setSelectedRows(selectedRows);
      if (selectedRows[0].hasVideo) {
        const videoPath = `${selectedRows[0].path.replace(
          /\\/g,
          "/"
        )}/scenario/mp4/default.mp4`;
        const message = await window.electronAPI.onVideoFileSelected(videoPath);
        setVideoOptions({
          autoplay: true,
          controls: true,
          width: "300px",
          height: "300px",
          responsive: true,
          fluid: true,
          sources: [
            {
              src: message.videoSource,
              type: "video/mp4",
            },
          ],
          techOrder: ["StreamPlay"],
          StreamPlay: { duration: message.duration },
        });
      }
    },
  };

  return (
    <>
      <div>
        <Card className="box-border m-2 ml-0" style={{ height: "300px" }}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size="small"
            scroll={{ y: 200 }}
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
          />
        </Card>
        <div className="flex m-2 ml-0 mt -0">
          <Card
            className="box-border m-2 ml-0 mt-0 w-full"
            style={{ height: "300px;" }}
          ></Card>
          <VideoJS options={videoOptions} />
        </div>
      </div>
      <DeleteConfirmModal
        isModalOpen={isDeleteModalOpen}
        path={deletePath}
        handleCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
