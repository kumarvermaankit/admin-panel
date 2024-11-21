import Table, { ColumnType } from "antd/es/table";
import { IWorkOrder } from "../types/workOrderInterfaces";
import { Link } from "react-router-dom";
import { Button, Tag, Image } from "antd";
import { formatLocalDate } from "../../../utility/dateUtils";
import { IMedia } from "../../media/types/mediaInterfaces";
import { IOperation } from "../../operations/types/operationInterfaces";
import { IProfile } from "../../profiles/types/profileInterfaces";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { EditWorkOrderDrawer } from "./EditWorkOrderDrawer";

interface IWorkOrdersTableProps {
  workOrders: IWorkOrder[] | undefined;
  operations: IOperation[] | undefined;
  setSelectedRows: (selectedRows: IWorkOrder[]) => void;
    currentPage: number;
  setCurrentPage: (page: number) => void;
  total: number;
}

export const WorkOrdersTable = ({
  workOrders,
  operations,
  setSelectedRows,
  currentPage,
  setCurrentPage,
  total,
}: IWorkOrdersTableProps) => {
  const [open, setOpen] = useState(false);

  const [wordOrder, setWordOrder] = useState<IWorkOrder | null>(null);

  const columns: ColumnType<IWorkOrder>[] = [
    {
      title: "Work Order No",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: number) => `WO-${id}`,
      fixed: "left" as const,
    },
    {
      title: "Order Item Id",
      dataIndex: ["order_line_item", "id"],
      key: "id",
      width: "80px",
      align: "center" as const,
    },
    {
      title: "Order No",
      dataIndex: ["order_line_item", "order_id"],
      key: "order_id",
      width: "100px",
      render: (id: number) => (
        <Link to={`/orders/${id}`}>
          <Button type="link">{`OR-${id}`}</Button>
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: "120px",
      render: (created_at: string) => formatLocalDate(created_at),
    },
    {
      title: "Image",
      dataIndex: ["order_line_item", "variant", "media"],
      key: "media",
      width: "80px",
      align: "center" as const,
      render: (media: IMedia) => <Image width={50} src={media.url} />,
    },
    {
      title: "SKU",
      dataIndex: ["order_line_item", "variant", "sku"],
      key: "sku",
      width: "80px",
      align: "center",
    },
    {
      title: "Ordered Qty",
      dataIndex: ["order_line_item", "quantity"],
      key: "quantity",
      width: "90px",
      align: "center",
    },
    {
      title: "Mfg Qty",
      dataIndex: ["quantity"],
      key: "quantity",
      width: "80px",
      align: "center",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      width: "110px",
      filters: operations
        ? operations.map((operation: IOperation) => ({
            text: operation.name,
            value: operation.name,
          }))
        : [],
      onFilter: (value, record) =>
        record.operation.name.indexOf(String(value)) === 0,
      render: (operation: IOperation) => (
        <Tag color="#2db7f5">{operation.name.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Assigned to",
      dataIndex: ["profile"],
      key: "profile",
      width: "140px",
      render: (profile: IProfile) => {
        return profile ? (
          <Tag icon={<UserOutlined />} color="blue">
            {`${profile.first_name} ${profile.last_name || ""}`}
          </Tag>
        ) : (
          <Tag color="red">Unassigned</Tag>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      width: "120px",
      render: (due_date: string) =>
        due_date ? (
          formatLocalDate(due_date)
        ) : (
          <Tag color="red">Unassigned</Tag>
        ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: "120px",
      render: (start_date: string) =>
        start_date ? (
          formatLocalDate(start_date)
        ) : (
          <Tag color="red">Unassigned</Tag>
        ),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      width: "120px",
      render: (end_date: string) => (end_date ? formatLocalDate(end_date) : ""),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "120px",
      fixed: "right" as const,
      filters: [
        {
          text: "Completed",
          value: "completed",
        },
        {
          text: "In Progress",
          value: "in_progress",
        },
        {
          text: "Pending",
          value: "pending",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(String(value)) === 0,
      render: (status: string) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "in_progress"
              ? "blue"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "80px",
      fixed: "right" as const,
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setWordOrder(record);
            setOpen(true);
          }}
        />
      ),
    },
  ];

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: IWorkOrder[]) => {
      setSelectedRows(selectedRows);
    },
  };

 

  return (
    <>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        scroll={{ x: 1500, y: 600 }}
        bordered
        dataSource={workOrders}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: 100,
          total: total,
          onChange: (page: number) => setCurrentPage(page),
        }}
      />
      <EditWorkOrderDrawer
        workOrder={wordOrder}
        open={open}
        onClose={() => {
          setWordOrder(null);
          setOpen(false);
        }}
      />
    </>
  );
};
