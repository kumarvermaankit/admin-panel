/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Divider, Table, Image, Button } from "antd";
import { SectionHeader } from "../../../components/SectionHeader";
import { KSpin } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useArtist } from "../hooks/useArtist";
import { useMediaUrl } from "../hooks/useAppMedia";

const MediaImage: React.FC<{ media_id: string }> = ({ media_id }) => {
  const { data: mediaUrl, isLoading } = useMediaUrl(media_id);

  if (isLoading) return <div>Loading...</div>;
  return mediaUrl ? <Image width={50} height={50} src={mediaUrl} /> : <div>No Image</div>;
};

const Artists: React.FC = () => {
  const { data: artists, isLoading, error } = useArtist();

  const artistColumns = [
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
      key: "media_id",
      render: (media_id: string) => <MediaImage media_id={media_id} />,
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
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    // {
    //   title: "Location Id",
    //   dataIndex: "location_id",
    //   key: "location_id",
    // },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (record: { id: number }) => (
    //     <Space>
    //       <Button type="link" onClick={() => handleEdit(record.id)}>
    //         Edit
    //       </Button>
    //       <Button danger type="link" onClick={() => handleDelete(record.id)}>
    //         Delete
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper style={{ height: "calc(100vh - 48px)" }}>
      <SectionHeader
        title="Artists"
        children={<Button type="primary">Add Artist</Button>}
      />
      <Divider />
      <Table
        columns={artistColumns}
        dataSource={Array.isArray(artists) ? artists : []}
        bordered
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Wrapper>
  );
};

export default Artists;
