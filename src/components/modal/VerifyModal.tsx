import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BaseModalProps } from "./types";
import {
  type FormInstance,
  Modal,
  Form,
  type InputRef,
  Input,
  Table,
  Popconfirm,
  Button,
  notification,
  Col,
  Row,
} from "antd";
import AppContext from "../../store/context";
import { refreshTree, setSaveFilePath } from "../../store/action";
import { MModel, defaultModel } from "../../model/Model";
import { checkModel } from "../content/model/utils/check";
import { FILE_SUFFIX } from "../../constants";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  requirements: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        className="m-0"
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap pr-6" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  requirements: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export default function VerifyModal({
  isModalOpen,
  handleCancel = () => {},
}: BaseModalProps): ReactElement {
  const { state, dispatch } = useContext(AppContext);
  const { filePath, saveFilePath, workspacePath } = state;
  const activatedFile = filePath.find((file) => file.isActive);

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [writePath, setWritePath] = useState<string>(
    activatedFile?.path.replace(/model$/g, FILE_SUFFIX.XML) ?? ""
  );

  const modelRef = useRef(defaultModel());
  const [count, setCount] = useState(0);

  // computed
  useEffect(() => {
    if (activatedFile?.path)
      setWritePath(activatedFile.path.replace(/model$/g, FILE_SUFFIX.XML));
  }, [activatedFile]);

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      if (isModalOpen && saveFilePath === "$$\ua265SAVE\ua265$$") {
        dispatch(setSaveFilePath(""));
        try {
          const modelContent = await window.electronAPI.readFile(
            activatedFile!.path
          );
          if (modelContent) {
            const model: MModel = JSON.parse(modelContent);
            checkModel(model);
            const source = model.requirements.map((r, i) => ({
              key: i,
              requirements: r,
            }));
            setDataSource(source);
            setCount(source.length);
            modelRef.current = model;
          }
        } catch (error: any) {
          console.error(error);
          notification.error({
            message: "Error",
            description: error.message,
          });
        }
      }
    };
    asyncFn();
  }, [activatedFile, dispatch, isModalOpen, saveFilePath]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "requirements",
      dataIndex: "requirements",
      width: "80%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      // @ts-ignore
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      requirements: "Please input requirement",
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    modelRef.current.requirements = dataSource.map((d) => d.requirements);
    try {
      // Update requirements of the activated model
      await window.electronAPI.writeJson(activatedFile!.path, modelRef.current);
      await window.electronAPI.ADSML2Uppaal(
        workspacePath,
        activatedFile!.path,
        writePath
      );
      notification.success({
        message: "Success",
        description: `Verify successfully!\nPlease check ${writePath}`,
      });
      dispatch(refreshTree());
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <Modal
      title="Verify"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div>
        <Button onClick={handleAdd} type="primary" className="mb-4">
          Add a requirement
        </Button>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          size="middle"
          columns={columns as ColumnTypes}
          pagination={false}
          scroll={{ y: 300 }}
        />
        <Row className="flex items-center mt-4 mb-4">
          <Col span={6}>Ouput file path:</Col>
          <Col span={18}>
            <Input
              // eslint-disable-next-line no-template-curly-in-string
              placeholder="default: ${projectPath}/${modelName}.xml"
              value={writePath}
              onChange={(e) => {
                setWritePath(e.target.value);
              }}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
