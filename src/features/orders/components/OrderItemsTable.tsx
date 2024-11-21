import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Form,
  Select,
  Table,
  Image,
  InputNumber,
  Space,
  Button,
  FormInstance,
  Typography,
} from "antd";
import { useFetchProductVariants } from "../hooks/useOrders";
import { KSpin } from "../../../components";
const { Text } = Typography;

interface OrderLineItem {
  variant_id: number;
  quantity: number;
  rate: number;
  media: { url: string };
}

interface IOrderItemsTableProps {
  form: FormInstance;
  onDeleteOrderLineItem?: (id: number) => void;
}

export const OrderItemsTable = ({
  form,
  onDeleteOrderLineItem,
}: IOrderItemsTableProps) => {
  const { data: variants, isLoading: isVariant } = useFetchProductVariants();

  const order_line_items = Form.useWatch(
    "order_line_items",
    form
  ) as OrderLineItem[];

  if (isVariant) {
    return <KSpin />;
  }

  return (
    <Form.List name="order_line_items">
      {(fields, { add, remove }) => (
        <>
          <Form.Item hidden name={["order_line_items", "id"]}>
            <InputNumber hidden />
          </Form.Item>
          <Table
            size="middle"
            dataSource={fields}
            pagination={false}
            rowKey="key"
            bordered
            summary={() => {
              const totalQuantity = order_line_items?.reduce(
                (acc, curr) => acc + (curr?.quantity || 0),
                0
              );
              const totalAmount = order_line_items?.reduce(
                (acc, curr) => acc + (curr?.quantity || 0) * (curr?.rate || 0),
                0
              );
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text strong>Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">
                    {totalQuantity ? <Text strong>{totalQuantity}</Text> : null}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}></Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="center">
                    {totalAmount ? <Text strong>₹ {totalAmount}</Text> : null}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}></Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
            title={() => "Order Items"}
            columns={[
              {
                title: "Sr",
                width: 60,
                render: (_, __, index) => index + 1,
              },
              {
                title: "Image",
                width: "10%",
                render: (_, field) => (
                  <Form.Item style={{ margin: 0 }}>
                    <Image
                      fallback="/placeholder.png"
                      width={50}
                      src={form.getFieldValue([
                        "order_line_items",
                        field.name,
                        "media",
                        "url",
                      ])}
                    />
                  </Form.Item>
                ),
              },
              {
                title: "Item",
                dataIndex: "id",
                render: (_, field) => (
                  <Form.Item
                    style={{ margin: 0 }}
                    name={[field.name, "variant_id"]}
                    rules={[{ required: true, message: "Select Item" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select SKU"
                      filterOption={(input, option) =>
                        (option?.children?.toString() ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      optionFilterProp="children"
                      onChange={(value) => {
                        const variant = variants?.find((v) => v.id === value);
                        form.setFieldsValue({
                          ["order_line_items"]: {
                            [field.name]: {
                              media: variant?.media,
                            },
                          },
                        });
                        console.log("variant", variant?.media);
                      }}
                    >
                      {variants?.map((variant) => (
                        <Select.Option
                          key={variant.id}
                          value={variant.id}
                          title={variant.sku}
                        >
                          {variant.sku}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ),
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                width: "10%",
                align: "center",
                render: (_, field) => (
                  <Form.Item
                    style={{ margin: 0 }}
                    name={[field.name, "quantity"]}
                    rules={[{ required: true, message: "Enter quantity" }]}
                  >
                    <InputNumber min={1} />
                  </Form.Item>
                ),
              },
              {
                title: "Rate",
                dataIndex: "rate",
                width: "10%",
                align: "center",
                render: (_, field) => (
                  <Form.Item
                    style={{ margin: 0 }}
                    name={[field.name, "rate"]}
                    rules={[{ required: true, message: "Enter rate" }]}
                  >
                    <InputNumber min={1} />
                  </Form.Item>
                ),
              },
              {
                title: "Amount",
                align: "center",
                width: "10%",
                render: (_, field) => (
                  <Form.Item
                    style={{ margin: 0 }}
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues !== curValues
                    }
                  >
                    {() => {
                      const quantity = form.getFieldValue([
                        "order_line_items",
                        field.name,
                        "quantity",
                      ]);
                      const rate = form.getFieldValue([
                        "order_line_items",
                        field.name,
                        "rate",
                      ]);
                      const totalAmount = quantity * rate;
                      return totalAmount ? <Text>₹ {totalAmount}</Text> : null;
                    }}
                  </Form.Item>
                ),
              },
              {
                title: "Action",
                align: "center",
                width: "10%",
                render: (_, field) => (
                  <Space>
                    <Button onClick={() => add()} icon={<PlusOutlined />} />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        const id = form.getFieldValue([
                          "order_line_items",
                          field.name,
                          "id",
                        ]);
                        if (id) {
                          onDeleteOrderLineItem?.(id);
                        }
                        remove(field.name);
                      }}
                    />
                  </Space>
                ),
              },
            ]}
          ></Table>
          <Button
            type="dashed"
            style={{ marginTop: "20px" }}
            onClick={() => add()}
          >
            Add Order Line Item
          </Button>
        </>
      )}
    </Form.List>
  );
};
