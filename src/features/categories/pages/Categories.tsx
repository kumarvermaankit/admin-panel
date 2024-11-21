import { Divider, message, Space, Table } from "antd";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  KSpin,
  SectionHeader,
} from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useCategories, useDeleteCategory } from "../hooks/useCategories";
import { ICategory } from "../types/categoryInterfaces";
import { useState } from "react";

export const Categories = () => {
  const { data: categories, error, isLoading } = useCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  const handleDelete = (id: number) => {
    deleteCategory(id, {
      onError: (error) => {
        setDeleteError(error.message);
        message.error(`Failed to delete category: ${error.message}`);
      },
      onSuccess: () => {
        setDeleteError(null);
        message.success("Category deleted successfully");
      },
    });
  };

  return (
    <Wrapper height="calc(100vh - 64px - 32px)">
      <SectionHeader
        title="Categories"
        children={<CreateButton route="/categories/create" title="Create" />}
      />
      <Divider />
      {deleteError && <div style={{ color: "red" }}>{deleteError}</div>}
      <Table
      bordered
        dataSource={categories}
        rowKey="id"
        columns={[
          {
            title: "Sr",
            key: "sr",
            width: 150,
            render: (_, __, index) => index + 1,
          },
          {
            title: "Category",
            dataIndex: "title",
            key: "title",
          },
          {
            title: "Parent Category",
            key: "parentCategory",
            render: (record: ICategory) =>
              record.parent ? record.parent.title : "",
          },
          {
            title: "Actions",
            key: "actions",
            render: (record) => (
              <Space>
                <EditButton route={`/categories/edit/${record.id}`} />
                <DeleteButton
                  onClick={() => handleDelete(record.id)}
                  loading={isDeleting}
                />
              </Space>
            ),
          },
        ]}
      />
    </Wrapper>
  );
};
