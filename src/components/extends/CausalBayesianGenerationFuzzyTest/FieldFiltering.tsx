import { Button, Checkbox, Table, TableProps } from "antd";
import Papa from "papaparse";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { ProjectType } from ".";

export default function FieldFiltering({
  setKey,
  projectData,
  setProjectData,
}: {
  setKey: (key: string) => void;
  projectData: ProjectType;
  setProjectData: (data: any) => void;
}): ReactElement {
  const handleCheckboxChange = useCallback(
    (e: any, h: string) => {
      if (e.target.checked) {
        setProjectData((data: ProjectType) => {
          return {
            ...data,
            selectedColumns: [...data.selectedColumns, h],
          };
        });
      } else {
        setProjectData((data: ProjectType) => {
          return {
            ...data,
            selectedColumns: data.selectedColumns.filter((col) => col !== h),
          };
        });
      }
    },
    [setProjectData]
  );

  useEffect(() => {
    const asyncFn = async () => {
      if (projectData.csvPath !== "点击上传csv文件") {
        const csvText = (
          await window.electronAPI.readFile(projectData.csvPath)
        ).trim();
        setProjectData((data: ProjectType) => {
          return {
            ...data,
            csvArray: Papa.parse(csvText).data as string[][],
          };
        });
      }
    };
    asyncFn();
  }, [projectData.csvPath, setProjectData]);

  const [header, setHeader] = useState<string[]>([]);

  useEffect(() => {
    if (projectData.csvArray.length) {
      setHeader(projectData.csvArray[0]);
    }
  }, [projectData.csvArray]);

  const [columns, setColumns] = useState<TableProps<any>["columns"]>([]);

  useEffect(() => {
    if (header.length) {
      const columns = [
        {
          title: "",
          dataIndex: "_",
          key: "_",
          width: 50,
        },
        ...header.map((h) => {
          return {
            title: (
              <div>
                <Checkbox onChange={(e) => handleCheckboxChange(e, h)} checked={projectData.selectedColumns.includes(h)}>
                  {h}
                </Checkbox>
              </div>
            ),
            dataIndex: h,
            key: h,
          };
        }),
      ];
      setColumns(columns);
    }
  }, [handleCheckboxChange, header, projectData.selectedColumns]);

  const [tableData, setTableData] = useState<TableProps<any>["dataSource"]>([]);

  useEffect(() => {
    if (projectData.csvArray.length) {
      const tableData = projectData.csvArray.slice(1).map((row, i) => {
        return header.reduce(
          (acc, h, j) => {
            acc[h] = row[j];
            return acc;
          },
          { _: i, key: i } as Record<string, any>
        );
      });
      setTableData(tableData);
    }
  }, [header, projectData.csvArray]);

  return (
    <div className="flex flex-col gap-10">
      <Table
        columns={columns}
        size="small"
        dataSource={tableData}
        scroll={{ y: 300 }}
        pagination={false}
      ></Table>
      <div className="flex w-full gap-5">
        <Button type="primary" className="grow" onClick={() => setKey("3")}>
          上一步
        </Button>
        <Button type="primary" className="grow" onClick={() => setKey("5")}>
          下一步
        </Button>
      </div>
    </div>
  );
}
