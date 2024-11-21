import { Divider, Tabs, TabsProps } from "antd";
import { KSpin, SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { useEffect, useState } from "react";
import { IWorkOrder } from "../types/workOrderInterfaces";
import { useOperations } from "../../operations/hooks/useOperations";
import { PrintButton } from "../components/PrintButton";
import { WorkOrdersTable } from "../components/WorkOrdersTable";
import { IOperation } from "../../operations/types/operationInterfaces";
import { useWorkOrders } from "../hooks/useWorkOrders";

export const WorkOrders = () => {
  const { data: operations } = useOperations();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useWorkOrders(currentPage);
  const [selectedRows, setSelectedRows] = useState<IWorkOrder[]>([]);

  const [filteredWorkOrders, setFilteredWorkOrders] = useState<IWorkOrder[]>(
    []
  );

  useEffect(() => {
    setFilteredWorkOrders(data?.data || []);
  }, [data]);

  const handleTabeChange = (key: string) => {
    const operationId = key;
    const filtered = data?.data?.filter(
      (workOrder: IWorkOrder) => workOrder.operation.name === operationId
    );
    setFilteredWorkOrders(filtered || []);
    setSelectedRows([]);
  };

  const workOrders = data?.data;

  const handleSelect = (selectedRows: IWorkOrder[]) => {
    setSelectedRows(selectedRows);
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "All",
      destroyInactiveTabPane: true,
      children: (
        <WorkOrdersTable
          workOrders={workOrders}
          operations={operations}
          setSelectedRows={handleSelect}
          currentPage={currentPage}
          setCurrentPage={handleSetCurrentPage}
          total={data?.total || 0}
        />
      ),
    },
    ...(operations?.map((operation: IOperation) => ({
      destroyInactiveTabPane: true,
      key: operation.name,
      label: operation.name,
      children: (
        <WorkOrdersTable
          workOrders={filteredWorkOrders}
          operations={operations}
          setSelectedRows={handleSelect}
          currentPage={currentPage}
          setCurrentPage={handleSetCurrentPage}
          total={data?.total || 0}
        />
      ),
    })) || []),
  ];

  if (isLoading) {
    return <KSpin />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Wrapper height="calc(100vh - 48px)" style={{ overflow: "auto" }}>
      <SectionHeader
        title="Work Orders"
        children={<PrintButton selectedRows={selectedRows} />}
      />
      <Divider />
      <Tabs
        type="card"
        onChange={(key) => handleTabeChange(key)}
        defaultActiveKey="0"
        items={items}
      />
    </Wrapper>
  );
};
