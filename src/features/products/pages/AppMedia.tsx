/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-debugger */
import React, { useState } from "react";
import {
  Divider,
  Table,
  Image,
  Space,
  Button,
  Select,
  Modal,
  message,
} from "antd";
import { SectionHeader } from "../../../components/SectionHeader";
import { KSpin } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useAppMedia, useMediaUrl } from "../hooks/useAppMedia";
import { Media } from "../../../components";
import { updateAppMedia } from "../api/appMedia";
import { IMedia } from "../../media/types/mediaInterfaces";


const MediaImage: React.FC<{ media_id: string }> = ({ media_id }) => {
  const { data: mediaUrl, isLoading } = useMediaUrl(media_id);

  if (isLoading) return <div>Loading...</div>;
  return mediaUrl ? <Image width={50} height={50} src={mediaUrl} /> : <div>No Image</div>;
};

const AppMedia: React.FC = () => {
  const { data: appMedia, isLoading, error, refetch } = useAppMedia();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [openMediaModal, setOpenMediaModal] = useState(false);

  const isEditing = (record: any) => record.id === editingKey;

  const handleEdit = (record: any) => {
    setEditingKey(record.id);
    setEditingRecord({ ...record });
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingRecord(null);
  };

  const handleSave = async () => {
    if (editingRecord) {
      try {
        await updateAppMedia(editingRecord.id, {
          name: editingRecord.name,
          media_id: editingRecord.media_id,
          language: editingRecord.language,
        });
        message.success("Media details updated successfully!");
        setEditingKey(null);
        setEditingRecord(null);
        refetch();
      } catch (err) {
        message.error("Failed to update media details.");
        console.error(err);
      }
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditingRecord((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMediaSelect = (media: IMedia | null) => {
    if (media) {
      setEditingRecord((prev: any) => ({
        ...prev,
        media_id: media.id,
        media_name: media.file_name, // Update the selected media name
      }));
    }
    setOpenMediaModal(false);
  };
  

  const mediaColumns = [
    {
      title: "Sr",
      key: "sr",
      width: 80,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Media",
      dataIndex: "media_id",
      key: "media",
      render: (media_id: string, record: any) =>
        isEditing(record) ? (
          <Space>
            <Button type="link" onClick={() => setOpenMediaModal(true)}>
              Select Media
            </Button>
            {editingRecord?.media_name && (
              <span style={{ marginLeft: "8px", color: "#1890ff" }}>
                {editingRecord.media_name}
              </span>
            )}
          </Space>
        ) : (
          <MediaImage media_id={media_id} />
        ),
    },
    {
      title: "Location Name",
      key: "location_info",
      render: (_: unknown, record: any) => {
        const locationName = record.locations?.name || "N/A";
        const eventDate = record.locations?.event_date
          ? new Date(record.locations.event_date).toLocaleDateString()
          : "No Date";

        return `${locationName} - ${eventDate}`;
      },
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (_: string, record: any) =>
        isEditing(record) ? (
          <Select
            style={{ width: "100%" }}
            value={editingRecord.language}
            onChange={(value) => handleFieldChange("language", value)}
            options={[
              { label: "English", value: "english" },
              { label: "Hindi", value: "hindi" },
            ]}
          />
        ) : record.language === "english"
          ? "English"
          : record.language === "hindi"
          ? "Hindi"
          : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: any) =>
        isEditing(record) ? (
          <Space>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        ) : (
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        ),
    },
  ];

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper style={{ height: "calc(100vh - 48px)" }}>
      <SectionHeader title="App Media" />
      <Divider />
      <Table
        columns={mediaColumns}
        dataSource={Array.isArray(appMedia) ? appMedia : []}
        bordered
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      {/* Media Modal for Selecting Media */}
      <Modal
        title="Select Media"
        centered
        open={openMediaModal}
        onCancel={() => setOpenMediaModal(false)}
        footer={null}
        width={1600}
      >
        <Media 
        onSelect={(media: IMedia | null) => handleMediaSelect(media)}        
        preview={false} />
      </Modal>
    </Wrapper>
  );
};

export default AppMedia;
