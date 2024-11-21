import { IMedia } from "../../media/types/mediaInterfaces";
import { Button, Card, Form, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const MediaSelection = ({
  selectedImage,
  setOpen,
}: {
  selectedImage: IMedia | null;
  setSelectedImage: (media: IMedia | null) => void;
  setOpen: (open: boolean) => void;
}) => (
  <Form.Item
    name="media"
    initialValue=""
    rules={[
      {
        required: true,
        message: "Image is not selected",
      },
    ]}
  >
    {selectedImage ? (
      <Card
        hoverable
        size="small"
        style={{ width: "200px" }}
        styles={{ body: { padding: 2, margin: 0 } }}
      >
        <Form.Item noStyle>
          <Image
            preview={false}
            onClick={() => setOpen(true)}
            alt={selectedImage.file_name}
            src={selectedImage.url}
            style={{ height: 200 }}
          />
        </Form.Item>
        {/* <Button
          shape="circle"
          icon={<DeleteOutlined />}
          style={{ position: "absolute", top: 4, right: 4, zIndex: 1 }}
          onClick={() => setSelectedImage(null)}
        /> */}
      </Card>
    ) : (
      <Button
        type="dashed"
        onClick={() => setOpen(true)}
        style={{ height: "150px", width: "150px" }}
      >
        <PlusOutlined />Select Image
      </Button>
    )}
  </Form.Item>
);
