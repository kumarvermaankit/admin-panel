import { Divider, Form, Input, message, Modal } from "antd";
import { useEffect } from "react";
import { OperationForm } from "./OperationForm";
import { IOperationVariables } from "../types/operationInterfaces";
import { useUpdateOperation } from "../hooks/useOperations";

interface EditOperationModalProps {
  open: boolean;
  onClose: () => void;
  operation: IOperationVariables | null;
}

export const EditOperationModal = ({
  open,
  onClose,
  operation,
}: EditOperationModalProps) => {
  const [form] = Form.useForm<IOperationVariables>();
  const { mutate: updateOperation, isPending } = useUpdateOperation();

  useEffect(() => {
    if (operation) {
      form.setFieldsValue(operation);
    }
  }, [operation, form]);

  const handleOk = (values: IOperationVariables) => {
    try {
      updateOperation(values, {
        onSuccess: () => {
          message.success("Operation updated successfully");
          form.resetFields();
          onClose();
        },
        onError: (error) => {
          console.error(error);
          message.error(error.message);
        },
      });
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      loading={isPending}
      title="Edit Operation"
      open={open}
      okText="Save"
      onOk={() => form.submit()}
      onCancel={handleCancel}
    >
      <Divider />
      <Form onFinish={handleOk} form={form} layout="vertical">
        <Form.Item name="id" noStyle>
            <Input type="hidden" />
        </Form.Item>
        <OperationForm />
      </Form>
    </Modal>
  );
};
