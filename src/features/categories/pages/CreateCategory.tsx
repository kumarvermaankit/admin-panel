import { Button, Col, Form, Input, message, Row, Select } from "antd";
import { SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useCategories, useCreateCategory } from "../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import { ICategoryVariables } from "../types/categoryInterfaces";

export const CreateCategory = () => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = async (values: ICategoryVariables) => {
    try {
      await createCategory(values, {
        onSuccess: () => {
          message.success("Category created successfully");
          navigate("/categories");
        },
        onError: (error) => {
          message.error(error.message);
        },
      });
    } catch (error) {
      message.error("Failed to create category");
    }
  };

  return (
    <Wrapper height="calc(100vh - 64px - 32px)">
      <SectionHeader title="Create Category" />
      <Row>
        <Col className="gutter-row" span={6}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Input the title!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="parent_id" label="Parent Category">
              <Select
                placeholder="Select a parent category"
                allowClear
                loading={!categories}
              >
                {categories?.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isPending}>
                Create
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Wrapper>
  );
};
