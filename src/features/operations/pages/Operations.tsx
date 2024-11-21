import { Button, Divider, message, Space, Table, TableColumnsType } from "antd";
import { DeleteButton, KSpin, SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useDeleteOperation, useOperations } from "../hooks/useOperations";
import { EditOutlined, HolderOutlined } from "@ant-design/icons";
import { IOperation, IOperationVariables } from "../types/operationInterfaces";
import { CreateOperationModal } from "../components/CreateOperationModal";
import { useState } from "react";
import { EditOperationModal } from "../components/EditOperationModal";

export const Operations = () => {
  const { data: operations, error, isLoading } = useOperations();
  const { mutate: deleteOperation } = useDeleteOperation();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [operation, setOperation] = useState<IOperationVariables | null>(null);

  const handleDelete = (id: number) => {
    deleteOperation(id, {
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess: () => {
        message.success("Operation deleted successfully");
      },
    });
  };

  const columns: TableColumnsType<IOperation> = [
    {
      key: "sort",
      align: "center",
      width: 60,
      render: () => <HolderOutlined />,
    },
    {
      title: "Operation",
      dataIndex: "name",
    },
    {
      title: "Sequence",
      dataIndex: "sequence",
      width: 100,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setOperation(record);
              setEditModalOpen(true);
            }}
          />
          <DeleteButton size="small" onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper>
      <SectionHeader title="Operations" />
      <Divider />
      <Table
        style={{ width: "500px" }}
        bordered
        pagination={false}
        dataSource={operations}
        rowKey="id"
        columns={columns}
      />
      <Divider />
      <Button onClick={() => setCreateModalOpen(true)} type="dashed">
        Add Operation
      </Button>
      <CreateOperationModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <EditOperationModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        operation={operation}
      />
    </Wrapper>
  );
};
