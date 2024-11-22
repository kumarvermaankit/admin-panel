import { useState } from "react";
import { Divider, Table, Typography, Switch, Empty } from "antd";
import { SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import SearchWithChips from "../../../components/SearchWithChips";
import { useEmployeeLocation } from "../hooks/useEmployee";
import { editEmployeesData } from "../api/employeeApi";
import { useQueryClient } from "@tanstack/react-query";

const { Title, Text } = Typography;

const groupEmployeeData = (data: Array<{
  employee_id: number;
  location_id: number;
  feedback_submitted: boolean;
  bus_arrival_access: boolean;
  is_admin: boolean;
  registration_count_access: boolean;
}>) => {
  const grouped = data.reduce((acc: Array<{
    employee_id: number;
    locations: Array<{
      location_id: number;
      feedback_submitted: boolean;
      bus_arrival_access: boolean;
      is_admin: boolean;
      registration_count_access: boolean;
    }>;
  }>, entry) => {
    const existing = acc.find((item) => item.employee_id === entry.employee_id);
    if (existing) {
      existing.locations.push({
        location_id: entry.location_id,
        feedback_submitted: entry.feedback_submitted,
        bus_arrival_access: entry.bus_arrival_access,
        is_admin: entry.is_admin,
        registration_count_access: entry.registration_count_access,
      });
    } else {
      acc.push({
        employee_id: entry.employee_id,
        locations: [
          {
            location_id: entry.location_id,
            feedback_submitted: entry.feedback_submitted,
            bus_arrival_access: entry.bus_arrival_access,
            is_admin: entry.is_admin,
            registration_count_access: entry.registration_count_access,
          },
        ],
      });
    }
    return acc;
  }, []);
  return grouped;
};

const EmployeeAccess = () => {
  const queryClient = useQueryClient(); 
  const [ids, setIds] = useState<number[]>([]);

  const { data, isLoading, isError, error } = useEmployeeLocation(ids);

  const handleChipsUpdate = (newChips: string[]) => {
    const numericIds = newChips.map((chip) => Number(chip)).filter((id) => !isNaN(id));
    setIds(numericIds);
  };

  const handleFieldChange = async (
    employee_id: number,
    location_id: number,
    field: string,
    value: boolean
  ) => {
    console.log(`Updating ${field} for employee ${employee_id}, location ${location_id} to ${value}`);
  
    // Optimistic update
    queryClient.setQueryData(["employee_location", ids], (oldData: any) => {
      if (!oldData) return oldData;
  
      return oldData.map((employee) => {
        if (employee.employee_id === employee_id) {
          employee.locations = employee.locations.map((location) => {
            if (location.location_id === location_id) {
              return { ...location, [field]: value };
            }
            return location;
          });
        }
        return employee;
      });
    });
  
    // Perform the actual update
    const response = await editEmployeesData(employee_id, location_id, { [field]: value });
  
    if (response.error) {
      console.error(`Failed to update ${field}:`, response.error);
      queryClient.invalidateQueries(["employee_location", ids]); // Fallback
    } else {
      console.log(`Successfully updated ${field}:`, response.data);
      // Refetch to ensure fresh data
      await queryClient.refetchQueries(["employee_location", ids], { exact: true });
    }
  };

  const locationColumns = (employee_id: number) => [
    { title: "Location ID", dataIndex: "location_id", key: "location_id" },
    {
      title: "Bus Arrival Access",
      dataIndex: "bus_arrival_access",
      key: "bus_arrival_access",
      render: (value: boolean, record: { location_id: number }) => (
        <Switch
          checked={value}
          onChange={(checked) =>
            handleFieldChange(employee_id, record.location_id, "bus_arrival_access", checked)
          }
        />
      ),
    },
    {
      title: "Registration Count Access",
      dataIndex: "registration_count_access",
      key: "registration_count_access",
      render: (value: boolean, record: { location_id: number }) => (
        <Switch
          checked={value}
          onChange={(checked) =>
            handleFieldChange(employee_id, record.location_id, "registration_count_access", checked)
          }
        />
      ),
    },
    {
      title: "Feedback Submitted",
      dataIndex: "feedback_submitted",
      key: "feedback_submitted",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      title: "Is Admin",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
  ];

  const processedData = data ? groupEmployeeData(data) : [];

  return (
    <Wrapper style={{ height: "calc(100vh - 48px)" }}>
      <SectionHeader title="Access" />
      <Divider />
      <SearchWithChips
        placeholder="Type Employee ID and press Enter or ','"
        onUpdateChips={handleChipsUpdate}
      />
      <Divider />
      {isLoading ? (
        <div>Loading employee data...</div>
      ) : isError ? (
        <div>Error fetching employee data: {error?.message}</div>
      ) : ids.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Text type="secondary">Please enter employee IDs in the search bar above to load data.</Text>
        </div>
      ) : processedData.length === 0 ? (
        <Empty description="No data available" />
      ) : (
        processedData.map((employee) => (
          <div key={employee.employee_id} style={{ marginBottom: "24px" }}>
            <Title level={4}>Employee ID: {employee.employee_id}</Title>
            <Table
              columns={locationColumns(employee.employee_id)}
              dataSource={employee.locations}
              pagination={false}
              rowKey={(record) => record.location_id}
            />
          </div>
        ))
      )}
    </Wrapper>
  );
};

export default EmployeeAccess;
