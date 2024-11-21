import { Form, Select } from "antd";

export const CategorySelect = ({
  categoriesOptions,
}: {
  categoriesOptions: { label: string; value: number }[] | undefined;
}) => {
  return (
    <Form.Item label="Category" name="category_id">
      <Select options={categoriesOptions} />
    </Form.Item>
  );
};
