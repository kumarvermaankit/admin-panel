import Wrapper from "../../../components/wrapper";
import {
  EditButton,
  KSpin,
  KTypography,
  SectionHeader,
} from "../../../components";
import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { Col, Divider, Row, Table, Image } from "antd";
import { formatLocalDate } from "../../../utility/dateUtils";
import { formatCurrency } from "../../../utility/helperFunctions";

export const ShowOrder = () => {
  const { id } = useParams();
  const { data: order, isPending, isError } = useOrder(Number(id));


  if (isPending) return <KSpin />;
  if (isError) return <div>Error loading order data</div>;

  const totalQuantity = order.order_line_items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = order.order_line_items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  return (
    <Wrapper height="calc(100vh - 64px - 32px)">
      <SectionHeader
        title={`Order No: OR-${order.id}`}
        children={
          <EditButton route={`/orders/edit/${order.id}`} title="Edit" />
        }
      />
      <Divider />
      <Row>
        <Col className="gutter-row" span={4}>
          <KTypography level={5} type="title">
            {"Order Date"}
          </KTypography>
          <KTypography type="text">
            {formatLocalDate(order.created_at.toString())}
          </KTypography>
        </Col>
        <Col className="gutter-row" span={4}>
          <KTypography level={5} type="title">
            {"Delivery Date"}
          </KTypography>
          <KTypography type="text">
            {formatLocalDate(order.delivery_date.toString())}
          </KTypography>
        </Col>
        <Col>
          <KTypography level={5} type="title">
            {"Customer"}
          </KTypography>
          <KTypography type="text">{order?.customers?.name}</KTypography>
        </Col>
      </Row>
      <Divider />
      <Table
        dataSource={order.order_line_items}
        pagination={false}
        size="small"
        rowKey="id"
        title={() => "Order Items"}
        bordered
        summary={() => (
          <Table.Summary.Row style={{fontWeight:"500"}}>
            <Table.Summary.Cell index={0} colSpan={3}>
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{totalQuantity}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}></Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              {formatCurrency(totalAmount)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
        columns={[
          {
            width: "60px",
            title: "Sr",
            dataIndex: "id",
            render: (_, __, index) => index + 1,
          },
          {
            width: "10%",
            title: "Image",
            dataIndex: ["variant", "media", "url"],
            render: (url: string) =>
              url != null ? <Image width={50} height={50} src={url} /> : <></>,
          },
          {
            title: "SKU",
            dataIndex: ["variant", "sku"],
            key: "sku",
          },
          {
            width: "15%",
            title: "Quantity",
            dataIndex: "quantity",
          },
          {
            width: "15%",
            title: "Rate",
            dataIndex: "rate",
          },
          {
            width: "15%",
            title: "Amount",
            render: (record) => {
              return record.quantity * record.rate;
            },
          },
        ]}
      ></Table>
    </Wrapper>
  );
};
