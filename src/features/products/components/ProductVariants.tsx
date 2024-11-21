import {
  DeleteOutlined,
  PictureOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  Image,
  Modal,
  Card,
  Col,
  Row,
  FormInstance,
  Typography,
  Divider,
} from "antd";
import { Media } from "../../../components";
import { useEffect, useState } from "react";
import { IMedia } from "../../media/types/mediaInterfaces";
import { IProduct, IProductVariables } from "../types/productInterfaces";
import { fetchVariantBySku } from "../api/productsApi";
const { Text } = Typography;

interface IProductVariantsProps {
  form: FormInstance;
  product?: IProduct;
  onDeleteVariant?: (id: number) => void;
}

export const ProductVariants = ({
  form,
  product,
  onDeleteVariant,
}: IProductVariantsProps) => {
  const queryClient = new QueryClient();
  const modal = Modal;

  const [selectedMedia, setSelectedMedia] = useState<IMedia[]>([]);

  useEffect(() => {
    const media = product?.variants.map((variant) => variant.media);
    setSelectedMedia(media?.map((media) => media as IMedia) || []);
  }, [product]);

  const handleImageSelection = async (key: number) => {
    const fields = form.getFieldsValue();
    const variants = fields.variants as IProductVariables["variants"];
    modal.info({
      zIndex: 1000,
      icon: null,
      footer: null,
      title: "Select Image",
      width: "80%",
      content: (
        <QueryClientProvider client={queryClient}>
          <Media
            onSelect={(media) => {
              if (media) {
                setSelectedMedia((prev) => {
                  const updatedMedia = [...prev];
                  updatedMedia[key] = media;
                  return updatedMedia;
                });
                form.setFieldsValue({
                  variants: variants.map((variant, index) =>
                    index === key ? { ...variant, media: media } : variant
                  ),
                });
                modal.destroyAll();
              }
            }}
            preview={false}
          />
        </QueryClientProvider>
      ),
    });
  };

  return (
    <>
      <Text>Variants</Text>
      <Divider />
      <Form.Item name="deleteIds" hidden>
        <Input type="hidden" />
      </Form.Item>
      <Form.List
        name="variants"
        initialValue={[{ sku: "", price: 0, media: undefined }]}
      >
        {(variants, { add, remove }) => (
          <>
            {variants.map(({ key, name, ...restField }) => (
              <Row
                key={key}
                gutter={16}
                style={{ marginBottom: "12px" }}
                align="middle"
              >
                <Col>
                  {selectedMedia[key] ? (
                    <Form.Item style={{ padding: 0, margin: 0 }}>
                      <Card
                        hoverable
                        size="small"
                        styles={{ body: { padding: 2, margin: 0 } }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "media"]}
                          noStyle
                          valuePropName="src"
                          getValueProps={(value) => value}
                        >
                          <Image
                            preview={false}
                            onClick={() => handleImageSelection(key)}
                            src={selectedMedia[key].url}
                            alt="Product Image"
                            style={{
                              height: "60px",
                              width: "60px",
                              margin: 0,
                              padding: 0,
                            }}
                          />
                        </Form.Item>
                      </Card>
                    </Form.Item>
                  ) : (
                    <Button
                      type="dashed"
                      style={{ height: "60px", width: "60px" }}
                      onClick={() => handleImageSelection(key)}
                    >
                      <PictureOutlined />
                    </Button>
                  )}
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "sku"]}
                    label="SKU"
                    validateTrigger={["onBlur"]}
                    rules={[
                      { required: true, message: "Missing SKU" },
                      {
                        validator: async (_, value) => {
                          const fields = form.getFieldsValue();
                          const variantId = fields.variants[key].id;

                          // Skip validation if the value hasn't changed or variantId exists and the SKU is the same
                          if (variantId) {
                            const existingVariant = await fetchVariantBySku(
                              variantId
                            );
                            if (
                              existingVariant?.sku.toLowerCase() ===
                              value.toLowerCase()
                            ) {
                              return Promise.resolve();
                            }
                          }

                          // Otherwise, check if SKU exists in the database
                          try {
                            const existingSku = await fetchVariantBySku(
                              value.toLowerCase()
                            );

                            // If an existing SKU is found and it's not for the current variant, reject with an error
                            if (
                              existingSku &&
                              (!variantId || existingSku.id !== variantId)
                            ) {
                              return Promise.reject("SKU already exists");
                            }

                            return Promise.resolve();
                          } catch {
                            // If SKU is not found, resolve the validation
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <Input placeholder="SKU"/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    label="Price"
                    name={[name, "price"]}
                  >
                    <Input placeholder="₹ 0.00" />
                  </Form.Item>
                </Col>

                <Col span={2}>
                  <div>
                    {variants.length > 1 && (
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          const variantId = form.getFieldValue([
                            "variants",
                            key,
                            "id",
                          ]);
                          if (variantId !== undefined) {
                            onDeleteVariant?.(variantId);
                          }
                          remove(name);
                        }}
                      />
                    )}
                  </div>
                </Col>
              </Row>
            ))}
            <Button type="link" icon={<PlusCircleOutlined />} onClick={add}>
              Add variants
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
};
