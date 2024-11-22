/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, message, TimePicker, Select } from "antd";
import { SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetEventsName, useGetLocations } from "../hooks/useEvents";
import { addEvents } from "../api/eventApi";

interface EventOption {
  label: string;
  value: number;
}

interface LocationOption {
  label: string;
  value: number;
}

export const CreateEvents: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: eventNames,
    isLoading: isLoadingEvents,
    error: errorEvents,
  } = useGetEventsName();
  const {
    data: locationNames,
    isLoading: isLoadingLocations,
    error: errorLocations,
  } = useGetLocations();

  if (isLoadingEvents || isLoadingLocations) return <div>Loading data...</div>;
  if (errorEvents) return <div>Error loading event names: {errorEvents.message}</div>;
  if (errorLocations) return <div>Error loading locations: {errorLocations.message}</div>;

  // Dropdown options for event names
// Dropdown options for event names
const eventOptions: EventOption[] =
  Array.isArray(eventNames)
    ? eventNames.map((event: any) => ({
        label: event.name, // Assuming `name` is the property for the event name
        value: event.id, // Assuming `id` is the unique identifier
      }))
    : [];

// Dropdown options for locations
const locationOptions: LocationOption[] =
  Array.isArray(locationNames)
    ? locationNames.map((location: any) => ({
        label: location.name, // Assuming `name` is the property for the location name
        value: location.id, // Assuming `id` is the unique identifier
      }))
    : [];


  const handleSubmit = async (values: {
    event_name: number;
    start_time: moment.Moment;
    end_time: moment.Moment;
    location: number;
  }) => {
    try {
      setIsSubmitting(true);

      const payload = {
        event_name_id: values.event_name, // Selected event ID
        start_time: values.start_time.format("HH:mm:ss"), // Time in "HH:mm:ss" format
        end_time: values.end_time.format("HH:mm:ss"), // Time in "HH:mm:ss" format
        location_id: values.location, // Selected location ID
      };

      // Call the addEvents function with the payload
      await addEvents(payload);
      message.success("Event created successfully");
      navigate("/events"); // Navigate to the events list page
    } catch (err) {
      message.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault(); // Prevent form submission on Enter
  };

  return (
    <Wrapper margin="auto" width="800px">
      <SectionHeader
        title="Create Event"
        children={
          <Button onClick={() => form.submit()} loading={isSubmitting}>
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
        <Wrapper
          style={{
            border: "1px solid #f0f0f0",
            padding: "20px",
            margin: "30px 0",
            boxShadow: "none",
          }}
        >
          {/* Event Name Dropdown */}
          <Form.Item
            name="event_name"
            label="Event Name"
            rules={[{ required: true, message: "Please select an event name" }]}
          >
            <Select options={eventOptions} placeholder="Select an event name" />
          </Form.Item>

          {/* Start Time */}
          <Form.Item
            name="start_time"
            label="Start Time"
            rules={[{ required: true, message: "Please select the start time" }]}
          >
            <TimePicker use12Hours format="h:mm:ss A" />
          </Form.Item>

          {/* End Time */}
          <Form.Item
            name="end_time"
            label="End Time"
            rules={[{ required: true, message: "Please select the end time" }]}
          >
            <TimePicker use12Hours format="h:mm:ss A" />
          </Form.Item>

          {/* Location Dropdown */}
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please select a location" }]}
          >
            <Select options={locationOptions} placeholder="Select a location" />
          </Form.Item>
        </Wrapper>
      </Form>
    </Wrapper>
  );
};
