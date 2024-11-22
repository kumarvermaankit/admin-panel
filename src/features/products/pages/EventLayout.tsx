import React, { useState, useEffect } from "react";
import { Divider, Table, TimePicker, message, Space, Button } from "antd";
import moment from "moment"; // Import moment for time handling
import { SectionHeader } from "../../../components/SectionHeader";
import { CreateButton, KSpin } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useEvents } from "../hooks/useEvents";

const Events = () => {
  const { data: events, error, isLoading } = useEvents();
  const [updatedEvents, setUpdatedEvents] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null); // Track the current editing record

  // Sync `updatedEvents` with `events` whenever `events` changes
  useEffect(() => {
    if (events) {
      setUpdatedEvents(events);
    }
  }, [events]);

  const isEditing = (record) => record.id === editingKey;

  const handleSave = () => {
    if (editingRecord) {
      const { id, start_time, end_time } = editingRecord;
      const newData = updatedEvents.map((item) =>
        item.id === id ? { ...item, start_time, end_time } : item
      );
      setUpdatedEvents(newData);
      setEditingKey(null);
      setEditingRecord(null);

      // Optionally send the updated values to the server
      // Replace this with your API call
      message.success("Changes saved successfully!");
    }
  };

  const handleEdit = (record) => {
    setEditingKey(record.id);
    setEditingRecord({ ...record });
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingRecord(null);
  };

  const handleTimeChange = (field, time, timeString) => {
    setEditingRecord((prev) => ({
      ...prev,
      [field]: timeString,
    }));
  };

  const eventColumns = [
    {
      title: "Sr",
      key: "sr",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Event Name",
      dataIndex: "event_name",
      key: "event_name",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (_, record) =>
        isEditing(record) ? (
          <TimePicker
            use12Hours
            format="h:mm:ss A"
            value={
              editingRecord?.id === record.id
                ? moment(editingRecord.start_time, "h:mm:ss A")
                : null
            }
            onChange={(time, timeString) =>
              handleTimeChange("start_time", time, timeString)
            }
          />
        ) : (
          record.start_time || "N/A"
        ),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (_, record) =>
        isEditing(record) ? (
          <TimePicker
            use12Hours
            format="h:mm:ss A"
            value={
              editingRecord?.id === record.id
                ? moment(editingRecord.end_time, "h:mm:ss A")
                : null
            }
            onChange={(time, timeString) =>
              handleTimeChange("end_time", time, timeString)
            }
          />
        ) : (
          record.end_time || "N/A"
        ),
    },
    {
      title: "Location ID",
      dataIndex: "location_id",
      key: "location_id",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
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
      <SectionHeader
        title="Events"
        children={<CreateButton title="Create Event" route="/events/create" />}
      />
      <Divider />
      <Table
        columns={eventColumns}
        dataSource={updatedEvents}
        bordered
        rowKey="id"
      />
    </Wrapper>
  );
};

export default Events;
