import {
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Button,
  message,
} from "antd";
import { KSpin, SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useCustomers } from "../../customers";
import dayjs from "dayjs";
import { IOrderVariable } from "../types/orderInterfaces";
import { useCreateOrder } from "../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import { OrderItemsTable } from "../components/OrderItemsTable";

export const CreateOrder = () => {
  const { data: customers, isLoading: isCategory } = useCustomers();

  const { mutate: createOrder, isPending } = useCreateOrder();

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: IOrderVariable) => {
    console.log(values);
    try {
      createOrder(values, {
        onSuccess: () => {
          message.success("Order created successfully");
          navigate("/orders");
        },
        onError: (error) => {
          message.error(error.message);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isCategory) {
    return <KSpin />;
  }

  return (
    <>
      <Wrapper>
        <SectionHeader
          title="Create Order"
          children={
            <Button onClick={() => form.submit()} loading={isPending}>
              Save
            </Button>
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
              { media: "", variant_id: "", quantity: "", rate: "" },
            ],
          }}
        >
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
                rules={[
                  { required: true, message: "Delivery Date is required" },
                  {
                    validator: (_, value) => {
                      if (value.isBefore(dayjs(), "day")) {
                        return Promise.reject(
                          "Delivery Date should be greater than today"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>
          <OrderItemsTable form={form} />
        </Form>
      </Wrapper>
    </>
  );
};
