import { Form, Input } from "antd";

export const OperationForm = () => {
  return (
    <>
      <Form.Item
        label="Operation Name"
        name="name"
        rules={[{ required: true, message: "Operation is required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Sequence"
        name="sequence"
        rules={[{ required: true, message: "Sequence is required" }]}
      >
        <Input type="number" />
      </Form.Item>
    </>
  );
};
