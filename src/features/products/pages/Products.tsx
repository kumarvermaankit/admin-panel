import { Divider, Table, Image, Space, message, Tag } from "antd";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import { SectionHeader } from "../../../components/SectionHeader";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  KSpin,
} from "../../../components";
import Wrapper from "../../../components/wrapper";
import { ColumnType } from "antd/es/table";
import { IProduct, IVariant } from "../types/productInterfaces";

export const Products = () => {
  const { data: products, error, isLoading } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const productColumns: ColumnType<IProduct>[] = [
    {
      title: "Sr",
      key: "sr",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: ["media", "url"],
      key: "image",
      width: 100,
      render: (url: string | null) =>
        url ? <Image width={50} height={50} src={url} /> : <></>,
    },

    {
      title: "Category",
      dataIndex: ["categories", "title"],
    },
    {
      title: "SKU's",
      dataIndex: "variants",
      key: "variants",
      render: (variants: IVariant[]) =>
        variants.map((variant) => (
          <Tag key={variant.id} color="blue">
            {variant.sku}
          </Tag>
        )),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space>
          <EditButton route={`/products/edit/${record.id}`} />
          <DeleteButton onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    deleteProduct(id, {
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess: () => {
        message.success("Product deleted successfully");
      },
    });
  };

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper style={{ height: "calc(100vh - 48px)" }}>
      <SectionHeader
        title="Products"
        children={<CreateButton title="Create" route="/products/create" />}
      />
      <Divider />
      <Table
        columns={productColumns}
        dataSource={products}
        bordered
        rowKey="id"
      ></Table>
    </Wrapper>
  );
};
