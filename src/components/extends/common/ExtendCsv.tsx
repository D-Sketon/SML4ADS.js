import { Table } from "antd";
import { ReactElement } from "react";

interface ExtendCsvProps {
  csvArray: string[][];
}

function ExtendCsv(props: ExtendCsvProps): ReactElement {
  const { csvArray } = props;
  const columns = csvArray.length ? csvArray[0].map((head) => {
    return {
      title: head,
      dataIndex: head,
      key: head,
    };
  }) : [];
  const dataSource = csvArray.slice(1).map((data, index) => {
    return {
      key: index + "",
      ...data.reduce((acc, cur, index) => {
        acc[csvArray[0][index]] = cur;
        return acc;
      }, {} as Record<string, string>),
    };
  });
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      size="small"
      scroll={{ y: 200 }}
    />
  );
}

export default ExtendCsv;
