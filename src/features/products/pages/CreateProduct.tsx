import { Button, Form, Modal, message } from "antd";
import { Media, SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useCategories } from "../../categories";
import { useState } from "react";
import { IMedia } from "../../media/types/mediaInterfaces";
import { useCreateProduct } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { IProductVariables } from "../types/productInterfaces";
import { CategorySelect } from "../components/CategorySelect";
import { MediaSelection } from "./MediaSelection";
import { ProductVariants } from "../components/ProductVariants";

export const CreateProduct = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);

  const { data: categories, error, isLoading } = useCategories();
  const { mutate: createProduct, isPending } = useCreateProduct();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const categoriesOptions = categories?.map((category) => ({
    label: category.title,
    value: category.id,
  }));

  const handleSubmit = async (values: IProductVariables) => {
    console.log(values);
    try {
      await createProduct(values);
      message.success("Product created successfully");
      navigate("/products");
    } catch (error) {
      message.error("Failed to create product");
    }
  };

  const handleImageSelect = (media: IMedia | null) => {
    setSelectedImage(media);
    form.setFieldsValue({ media: media });
    setOpen(false);
  };

  const checkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <Wrapper margin="auto" width="800px">
      <SectionHeader
        title="Add product"
        children={
          <Button onClick={() => form.submit()} loading={isPending}>
            Save
          </Button>
        }
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        {/* sku category & media */}
        <Wrapper
          style={{
            border: "1px solid #f0f0f0",
            margin: "30px 0",
            boxShadow: "none",
          }}
        >
          <CategorySelect categoriesOptions={categoriesOptions} />
          <MediaSelection
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setOpen={setOpen}
          />
        </Wrapper>

        {/* Product Options & Variants */}
        <Wrapper
          style={{
            border: "1px solid #f0f0f0",
            margin: "30px 0",
            boxShadow: "none",
          }}
        >
          <ProductVariants form={form} />
        </Wrapper>
      </Form>

      {/* Gallery Popup */}
      <Modal
        title="Media Gallery"
        centered
        style={{ top: -100 }}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1600}
        footer={null}
      >
        <Media onSelect={handleImageSelect} preview={false} />
      </Modal>
    </Wrapper>
  );
};
