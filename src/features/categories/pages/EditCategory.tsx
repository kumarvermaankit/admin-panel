import { useNavigate, useParams } from "react-router-dom";
import {
  useCategories,
  useCategory,
  useUpdateCategory,
} from "../hooks/useCategories";
import Wrapper from "../../../components/wrapper";
import { KSpin, SectionHeader } from "../../../components";
import { Button, Col, Divider, Form, Input, message, Row, Select } from "antd";
import { useEffect } from "react";
import { ICategoryVariables } from "../types/categoryInterfaces";

export const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: categories } = useCategories();
  const { data: category, isPending, isError } = useCategory(Number(id));
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        title: category.title,
        parent_id: category.parent?.id,
      });
      console.log(category);
    }
  }, [category, form]);

  const handleSubmit = async (values: ICategoryVariables) => {
    try {
      updateCategory(
        {
          id: Number(id),
          ...values,
        },
        {
          onSuccess: () => {
            message.success("Category updated successfully");
            navigate("/categories");
          },
          onError: (error) => {
            message.error(error.message);
          },
        }
      );
    } catch (error) {
      message.error("Failed to update category");
    }
  };

  if (isPending) return <KSpin />;
  if (isError) return <div>Error loading category data</div>;

  return (
    <Wrapper height="calc(100vh - 48px)">
      <SectionHeader title="Edit Category" />
      <Divider />
      <Row>
        <Col className="gutter-row" span={6}>
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
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
                defaultValue={category?.parent?.title}
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
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Wrapper>
  );
};
