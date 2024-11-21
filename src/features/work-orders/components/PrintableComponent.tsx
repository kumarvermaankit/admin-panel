import { Table, Image } from "antd";
import React from "react";
import { IWorkOrder } from "../types/workOrderInterfaces";
import { ColumnType } from "antd/es/table";

interface IPrintableComponentProps {
  selectedRows: IWorkOrder[];
}

export const PrintableComponent = React.forwardRef<
  HTMLDivElement,
  IPrintableComponentProps
>(({ selectedRows }, ref) => {
  const columns: ColumnType<IWorkOrder>[] = [
    {
      title: "Sr",
      dataIndex: "sr",
      key: "sr",
      width: "80px",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Work Order No",
      dataIndex: "id",
      key: "id",
      width: "120px",
      render: (id) => `WO-${id}`,
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "160px",
      render: (_, row) => (
        <Image
          src={row.order_line_item.variant.media?.url}
          alt="Product"
          width={150}
          height={150}
          style={{ objectFit: "cover" }}
        />
      ),
      align: "center",
    },
    {
      title: "SKU",
      dataIndex: ["order_line_item", "variant", "sku"],
      key: "sku",
      align: "center",
    },
    {
      title: "Ordered Qty",
      dataIndex: ["order_line_item", "quantity"],
      key: "quantity",
      align: "center",
    },
    {
      title: "Operation",
      dataIndex: ["operation", "name"],
      key: "operation",
      align: "center",
    },
  ];

  const dataSource = selectedRows.map((row) => ({
    ...row,
    key: row.id,
  }));

  return (
    <div ref={ref}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        style={{ margin: "20px" }}
      />
    </div>
  );
});
