/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Divider, Table, Input, Button, Space, message } from "antd";
import { SectionHeader } from "../../../components/SectionHeader";
import { KSpin } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useGetEmergencyContacts, useEditEmergencyContact } from "../hooks/useEmergencyContacts";

type EmergencyContact = {
  id: number;
  name: string;
  location_id: string;
  emergency_contact_cat_id: string;
  phone_numbers: string[];
};

export const EmergencyContacts: React.FC = () => {
  const { data: emergencyContacts, isLoading, error } = useGetEmergencyContacts();
  const { mutate: editEmergencyContact } = useEditEmergencyContact();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<EmergencyContact | null>(null);
  const isEditing = (record: EmergencyContact) => record.id === editingKey;

  const handleEdit = (record: EmergencyContact) => {
    setEditingKey(record.id);
    setEditingRecord({ ...record });
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingRecord(null);
  };

  const handleSave = async () => {
    if (editingRecord) {
      const { id, name, phone_numbers } = editingRecord;

      editEmergencyContact(
        { id, updates: { name, phone_numbers } },
        {
          onSuccess: () => {
            message.success("Emergency contact updated successfully!");
            setEditingKey(null);
            setEditingRecord(null);
          },
          onError: (err) => {
            message.error("Failed to update emergency contact.");
            console.error(err);
          },
        }
      );
    }
  };

  const handlePhoneChange = (value: string) => {
    setEditingRecord((prev) =>
      prev
        ? {
            ...prev,
            phone_numbers: value.split(",").map((num) => num.trim()),
          }
        : null
    );
  };

  const handleNameChange = (value: string) => {
    setEditingRecord((prev) =>
      prev
        ? {
            ...prev,
            name: value,
          }
        : null
    );
  };

  const contactColumns = [
    {
      title: "Sr",
      key: "sr",
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: EmergencyContact) =>
        isEditing(record) ? (
          <Input
            value={editingRecord?.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        ) : (
          record.name
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
      title: "Category ID",
      dataIndex: "emergency_contact_cat_id",
      key: "emergency_contact_cat_id",
    },
    {
      title: "Phone Numbers",
      dataIndex: "phone_numbers",
      key: "phone_numbers",
      render: (_: string, record: EmergencyContact) =>
        isEditing(record) ? (
          <Input
            value={editingRecord?.phone_numbers.join(", ")}
            onChange={(e) => handlePhoneChange(e.target.value)}
          />
        ) : (
          record.phone_numbers.length > 0 ? (
            <ul style={{ paddingLeft: "20px" }}>
              {record.phone_numbers.map((phone, index) => (
                <li key={index}>{phone}</li>
              ))}
            </ul>
          ) : (
            "N/A"
          )
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: EmergencyContact) =>
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
        title="Emergency Contacts"
        // children={<CreateButton title="Add Contact" route="/emergency-contacts/create" />}
      />
      <Divider />
      <Table<EmergencyContact>
        columns={contactColumns}
        dataSource={emergencyContacts as EmergencyContact[]}
        bordered
        rowKey="id"
      />
    </Wrapper>
  );
};

export default EmergencyContacts;
