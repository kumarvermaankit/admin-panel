import { Button, Form, Modal, message } from "antd";
import { Media, SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useCategories } from "../../categories";
import { useState, useEffect } from "react";
import { IMedia } from "../../media/types/mediaInterfaces";
import { useUpdateProduct, useFetchProductById } from "../hooks/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import {
  IProductVariables,
  IVariantVariables,
} from "../types/productInterfaces";
import { CategorySelect } from "../components/CategorySelect";
import { MediaSelection } from "./MediaSelection";
import { ProductVariants } from "../components/ProductVariants";

export const EditProduct = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategories();
  const {
    data: product,
    error: productError,
    isLoading: productLoading,
  } = useFetchProductById(Number(id));
  const { mutate: editProduct, isPending } = useUpdateProduct();

  // console.log(product);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
      setSelectedImage(product.media);
    }
  }, [product, form]);

  if (categoriesLoading || productLoading) return <div>Loading...</div>;
  if (categoriesError) return <div>Error: {categoriesError.message}</div>;
  if (productError) return <div>Error: {productError.message}</div>;

  const categoriesOptions = categories?.map((category) => ({
    label: category.title,
    value: category.id,
  }));

  const handleSubmit = async (values: IProductVariables) => {
    const variants = form
      .getFieldValue("variants")
      .map((variant: IVariantVariables) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        product_id: variant.product_id,
        media: variant.media,
      }));
    console.log(deletedIds);

    const productValues = {
      ...values,
      variants: variants,
      id: product?.id,
    };

    try {
      await editProduct({ product: productValues, deletedIds: deletedIds });
      message.success("Product updated successfully");
      navigate("/products");
    } catch (error) {
      message.error("Failed to update product");
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

  const handleDeleteVariant = (id: number) => {
    if (id) {
      setDeletedIds((prev) => [...prev, id]);
    }
  };

  return (
    <Wrapper margin="auto" width="800px">
      <SectionHeader
        title="Edit product"
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
          <ProductVariants
            form={form}
            product={product}
            onDeleteVariant={handleDeleteVariant}
          />
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
