import React, { useRef } from 'react';
import { Button, Space, Typography } from 'antd';
import ReactToPrint from 'react-to-print';
import { PrintableComponent } from '../components/PrintableComponent';
import { IWorkOrder } from '../types/workOrderInterfaces';

const { Text } = Typography;

export const PrintButton: React.FC<{ selectedRows: IWorkOrder[] }> = ({ selectedRows }) => {
  const componentRef = useRef(null);

  return (
    <Space>
      {selectedRows.length > 0 && <Text>{selectedRows.length} items</Text>}
      <ReactToPrint
        trigger={() => (
          <Button disabled={selectedRows.length === 0}>
            Print Selected
          </Button>
        )}
        content={() => componentRef.current}
      />
      <div style={{ display: 'none' }}>
        <PrintableComponent
          selectedRows={selectedRows}
          ref={componentRef}
        />
      </div>
    </Space>
  );
};