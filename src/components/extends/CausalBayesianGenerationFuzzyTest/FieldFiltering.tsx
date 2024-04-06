import { Button, Checkbox, Table, TableProps } from "antd";
import { ReactElement } from "react";

export default function FieldFiltering(): ReactElement {
  const header = ["a", "b", "c", "d"];

  const columns: TableProps<any>["columns"] = [
    {
      title: "",
      dataIndex: "_",
      key: "_",
      width: 50
    },
    ...header.map((h) => {
      return {
        title: (
          <div>
            <Checkbox>{h}</Checkbox>
          </div>
        ),
        dataIndex: h,
        key: h,
      };
    }),
  ];

  const tableData = Array.from({ length: 10 }).map((_, i) => {
    return header.reduce(
      (acc, h) => {
        acc[h] = `${h}-${i}`;
        return acc;
      },
      { _: i } as Record<string, any>
    );
  });

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
        <Button type="primary" className="grow">
          上一步
        </Button>
        <Button type="primary" className="grow">
          下一步
        </Button>
      </div>
    </div>
  );
}
