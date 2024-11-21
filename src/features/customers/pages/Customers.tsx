import {Divider, message, Space, Table } from "antd";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  KSpin,
  SectionHeader,
} from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useCustomers, useDeleteCustomer } from "../hooks/useCustomers";
import { ColumnType } from "antd/es/table";
import { ICustomer } from "../types/customerInterfaces";

export const Customers = () => {
  const { data: customers, error, isLoading } = useCustomers();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const handleDelete = (id: number) => {
    deleteCustomer(id, {
      onError: (error) => {
        message.error(`Failed to delete customer: ${error.message}`);
      },
      onSuccess: () => {
        message.success("Customer deleted successfully");
      },
    });
  };

  const columns: ColumnType<ICustomer>[] = [
    {
      title: "Sr",
      key: "sr",
      width: 150,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space>
          <EditButton route={`/customers/edit/${record.id}`} />
          <DeleteButton
            onClick={() => handleDelete(record.id)}
            loading={isDeleting}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper height="calc(100vh - 48px)">
      <SectionHeader
        title="Customers"
        children={<CreateButton route="/customers/create" title="Create" />}
      />
      <Divider />
      <Table dataSource={customers} rowKey="id" columns={columns} />
    </Wrapper>
  );
};
