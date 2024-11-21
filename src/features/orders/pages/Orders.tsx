import { Button, Divider, List, message, Space, Table, Tag } from "antd";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  KSpin,
  SectionHeader,
  ShowButton,
} from "../../../components";
import { IOrder } from "../types/orderInterfaces";
import { formatLocalDate } from "../../../utility/dateUtils";
import { useDeleteOrder, useOrders } from "../hooks/useOrders";
import Wrapper from "../../../components/wrapper";
import { Link } from "react-router-dom";

export const Orders = () => {
  const { data, error, isLoading } = useOrders();
  const { mutate: deleteOrder } = useDeleteOrder();

  const handleDelete = (id: number) => {
    deleteOrder(id, {
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess: () => {
        message.success("Product deleted successfully");
      },
    });
  };

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  const orders = data as IOrder[];

  return (
    <Wrapper style={{ height: "calc(100vh - 48px)" }}>
      <List>
        <SectionHeader
          title="Orders"
          children={<CreateButton title="Create" route="/orders/create" />}
        />
        <Divider />
        <Table
          dataSource={orders}
          rowKey="id"
          columns={[
            {
              title: "Sr",
              key: "sr",
              width: 150,
              render: (_, __, index) => index + 1,
            },
            {
              title: "Order No",
              dataIndex: "id",
              key: "id",
              render: (id: number) => (
                <Link to={`/orders/${id}`}>
                  <Button type="link">{`OR-${id}`}</Button>
                </Link>
              ),
            },
            {
              title: "Order Date",
              dataIndex: "created_at",
              key: "created_at",
              render: (date: string) => formatLocalDate(date),
            },
            {
              title: "Delivery Date",
              dataIndex: "delivery_date",
              key: "delivery_date",
              render: (date: string) => formatLocalDate(date),
            },
            {
              title: "Customer",
              dataIndex: ["customers", "name"],
              key: "customer",
            },
            {
              title: "Delayed By",
              dataIndex: "delivery_date",
              key: "days_delayed",
              align: "center",
              render: (date: string) => {
                const currentDate = new Date();
                const deliveryDate = new Date(date);
                const diffTime = currentDate.getTime() - deliveryDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const daysDelayed = Math.max(0, diffDays);

                return daysDelayed > 0 ? (
                  <Tag color="red">{`${daysDelayed} Days`}</Tag>
                ) : (
                  <></>
                );
              },
            },
            {
              title: "Action",
              key: "action",
              align: "center",
              render: (_, record) => (
                <Space>
                  <ShowButton route={`/orders/${record.id}`} />
                  <EditButton route={`/orders/edit/${record.id}`} />
                  <DeleteButton onClick={() => handleDelete(record.id)} />
                </Space>
              ),
            },
          ]}
        ></Table>
      </List>
    </Wrapper>
  );
};
