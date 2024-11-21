import { Divider, Form, message, Modal } from "antd";
import { useCreateOperation } from "../hooks/useOperations";
import { IOperationVariables } from "../types/operationInterfaces";
import { OperationForm } from "./OperationForm";

interface CreateOperationModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateOperationModal = ({
  open,
  onClose,
}: CreateOperationModalProps) => {
  const { mutate: createOperation, isPending } = useCreateOperation();

  const [form] = Form.useForm<IOperationVariables>();

  const handleOk = (values: IOperationVariables) => {
    try {
      createOperation(values, {
        onSuccess: () => {
          message.success("Operation created successfully");
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
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Add Operation"
      open={open}
      okText="Save"
      onOk={() => form.submit()}
      onCancel={handleCancel}
      loading={isPending}
    >
      <Divider />
      <Form onFinish={handleOk} form={form} layout="vertical">
        <OperationForm />
      </Form>
    </Modal>
  );
};
