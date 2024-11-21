import {
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Button,
  Space,
  message,
  Input,
} from "antd";
import { KSpin, SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useCustomers } from "../../customers";
import dayjs from "dayjs";
import { IOrderVariable } from "../types/orderInterfaces";
import { useOrder, useUpdateOrder } from "../hooks/useOrders";
import { useNavigate, useParams } from "react-router-dom";
import { OrderItemsTable } from "../components/OrderItemsTable";
import { useEffect, useState } from "react";

export const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const { data: customers, isLoading: isCategory } = useCustomers();

  const { data: order, error, isLoading } = useOrder(Number(id));
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        id: order.id,
        customer_id: order.customers.id,
        created_at: dayjs(order.created_at),
        delivery_date: dayjs(order.delivery_date),
        order_line_items: order.order_line_items.map((item) => ({
          id: item.id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          rate: item.rate,
          media: item.variant?.media,
        })),
      });
    }
  }, [order, form]);

  const handleDeleteOrderLineItem = (id: number) => {
    if (id) {
      setDeletedIds((prev) => [...prev, id]);
    }
  };

  const handleSubmit = async (values: IOrderVariable) => {
    console.log(values, deletedIds);
    try {
      updateOrder(
        { order: values, deletedIds: deletedIds },
        {
          onSuccess: () => {
            message.success("Order updated successfully");
            navigate("/orders");
          },
          onError: (error) => {
            message.error(error.message);
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <Wrapper marginBottom="20px">
      <SectionHeader
        title="Edit Order"
        children={
          <Space>
            <Button onClick={() => form.submit()} loading={isPending}>
              Update
            </Button>
          </Space>
        }
      />
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          created_at: dayjs(),
          order_line_items: [
            { media: "", product_id: "", quantity: "", rate: "" },
          ],
        }}
      >
        <Form.Item name="id" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Row>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label="Customer"
              name="customer_id"
              rules={[{ required: true, message: "Select customer" }]}
            >
              <Select placeholder="Select Customer" loading={isCategory}>
                {customers?.map((customer) => (
                  <Select.Option key={customer.id} value={customer.id}>
                    {customer.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <Form.Item label="Order Date" name="created_at">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item
              label="Delivery Date"
              name="delivery_date"
              rules={[{ required: true, message: "Delivery Date is required" }]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
        </Row>
        <OrderItemsTable
          form={form}
          onDeleteOrderLineItem={handleDeleteOrderLineItem}
        />
      </Form>
    </Wrapper>
  );
};
