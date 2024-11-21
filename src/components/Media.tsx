import {
  Card,
  Col,
  List,
  Pagination,
  Row,
  Image,
  Button,
  Upload,
  message,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import { IMedia } from "../features/media/types/mediaInterfaces";
import {
  useCreateMedia,
  useDeleteMedia,
  useMedia,
} from "../features/media/hooks/useMedia";
import { KSpin } from "./KSpin";
import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";

interface MediaProps {
  onSelect?: (media: IMedia | null) => void;
  cardHeight?: number;
  preview?: boolean;
}

export const Media: React.FC<MediaProps> = ({
  onSelect,
  cardHeight = 250,
  preview,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useMedia(currentPage);
  const { mutate: createMedia, isPending: isUploading } = useCreateMedia();
  const { mutate: deleteMedia } = useDeleteMedia();

  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    setLoadingImages(true);
  }, [currentPage]);

  const handleImageLoad = () => {
    setLoadingImages(false);
  };

  const handleUpload = (file: RcFile) => {
    createMedia(file, {
      onSuccess: () => {
        message.success(`${file.name} uploaded successfully.`);
      },
      onError: (error) => {
        message.error(`Failed to upload ${file.name}. Error: ${error.message}`);
      },
    });
    return false; // Prevent upload from happening twice
  };

  const handleDelete = (media: IMedia) => {
    deleteMedia(media, {
      onSuccess: () => {
        message.success(`Deleted media with ID: ${media.file_name}`);
      },
      onError: (error) => {
        message.error(
          `Failed to delete media with ID: ${media.file_name}. Error: ${error.message}`
        );
      },
    });
  };

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <List>
      <Row align="middle" style={{ marginBottom: "16px", marginTop: "16px" }}>
        <Upload beforeUpload={handleUpload} showUploadList={false}>
          <Button
            icon={<CloudUploadOutlined />}
            loading={isUploading}
            disabled={isUploading}
          >
            Upload
          </Button>
        </Upload>
      </Row>
      <Row gutter={[16, 16]}>
        {data?.data.map((media) => (
          <Col xs={12} sm={8} md={6} lg={4} xl={3} key={media.id}>
            <Card
              size="small"
              style={{ height: cardHeight, padding: "2px" }}
              loading={loadingImages}
              cover={
                <Image
                  height={200}
                  preview={preview}
                  alt={media.url}
                  src={media.url}
                  placeholder={true}
                  onLoad={handleImageLoad}
                />
              }
              onClick={() => onSelect && onSelect(media)}
            >
              <Popconfirm
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleDelete(media);
                }}
                onCancel={(e) => {
                  e?.stopPropagation();
                }}
                title="Are you sure delete this this Image?"
                okText="Yes"
                cancelText="No"
              >
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  style={{ position: "absolute", top: 4, right: 4 }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>

              <Card.Meta title={media.file_name} />
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        style={{ marginTop: "16px", textAlign: "center" }}
        current={currentPage}
        total={data?.total}
        pageSize={16}
        onChange={(page) => setCurrentPage(page)}
      />
    </List>
  );
};
