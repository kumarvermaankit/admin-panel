/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Divider, Table, message, Space, Button } from "antd";
import TimePicker from "react-time-picker"; // Import React-Time-Picker
import "react-time-picker/dist/TimePicker.css"; // Optional CSS for styling
import { SectionHeader } from "../../../components/SectionHeader";
import { KSpin } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useEvents } from "../hooks/useEvents";
import { editEvents } from "../api/eventApi";

interface Event {
  id: number;
  event_name: string;
  start_time: string;
  end_time: string;
  location_id: string;
  locations: object
}

const Events: React.FC = () => {
  const { data: events, error, isLoading } = useEvents();
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>([]);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<Event | null>(null);

  useEffect(() => {
    if (Array.isArray(events)) {
      setUpdatedEvents(events);
    } else if (events && "error" in events) {
      console.error("Error fetching events:", events.error);
    }
  }, [events]);

  const isEditing = (record: Event) => record.id === editingKey;

  const handleSave = async () => {
    if (editingRecord) {
      const { id, start_time, end_time } = editingRecord;

      try {
        const response = await editEvents(id, { start_time, end_time });

        if (response.error) {
          message.error("Failed to save changes.");
        } else {
          const updatedData = [...updatedEvents];
          const index = updatedData.findIndex((item) => item.id === id);

          if (index > -1) {
            updatedData[index] = { ...updatedData[index], start_time, end_time };
            setUpdatedEvents(updatedData);
          }

          setEditingKey(null);
          setEditingRecord(null);
          message.success("Changes saved successfully!");
        }
      } catch (err) {
        message.error("Unexpected error occurred while saving changes.");
        console.error(err);
      }
    }
  };

  const handleEdit = (record: Event) => {
    setEditingKey(record.id);
    setEditingRecord({ ...record });
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingRecord(null);
  };

  const handleTimeChange = (field: keyof Event, value: string | null) => {
    if (editingRecord && value) {
      setEditingRecord({
        ...editingRecord,
        [field]: value, // React-Time-Picker returns time in "HH:mm" format
      });
    }
  };

  const eventColumns = [
    {
      title: "Sr",
      key: "sr",
      width: 80,
      render: (_: unknown, __: unknown, index: number) => index + 1,
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
      render: (_: string, record: Event) =>
        isEditing(record) ? (
          <TimePicker
            value={editingRecord?.id === record.id ? editingRecord.start_time : ""}
            onChange={(value) => handleTimeChange("start_time", value)}
            format="HH:mm"
            disableClock
          />
        ) : (
          record.start_time || "N/A"
        ),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (_: string, record: Event) =>
        isEditing(record) ? (
          <TimePicker
            value={editingRecord?.id === record.id ? editingRecord.end_time : ""}
            onChange={(value) => handleTimeChange("end_time", value)}
            format="HH:mm"
            disableClock
          />
        ) : (
          record.end_time || "N/A"
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
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Event) =>
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
        // children={<CreateButton title="Create Event" route="/events/create" />}
      />
      <Divider />
      <Table<Event>
        columns={eventColumns}
        dataSource={updatedEvents}
        bordered
        rowKey="id"
      />
    </Wrapper>
  );
};

export default Events;
