import { Col, Form, Input, Row } from "antd";

export const CustomerForm = () => {
  return (
    <Row>
      <Col className="gutter-row" span={6}>
        <Form.Item hidden name="id">
          <Input hidden />
        </Form.Item>
        <Form.Item
          required
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );
};
