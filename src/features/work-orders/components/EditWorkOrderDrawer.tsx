import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Image,
  Space,
  message,
} from "antd";
import { IWorkOrder, IWorkOrderVariables } from "../types/workOrderInterfaces";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useProfiles } from "../../profiles/hooks/useProfiles";
import { KSpin } from "../../../components";
import { useUpdateWorkOrder } from "../hooks/useWorkOrders";

interface EditWorkOrderDrawerProps {
  open: boolean;
  onClose: () => void;
  workOrder: IWorkOrder | null;
}

export const EditWorkOrderDrawer = ({
  open,
  onClose,
  workOrder,
}: EditWorkOrderDrawerProps) => {
  const [form] = Form.useForm<IWorkOrder>();
  const { data: profiles, isLoading } = useProfiles();
  const { mutate: updateWorkOrder, isPending } = useUpdateWorkOrder();

  useEffect(() => {
    if (workOrder) {
      form.setFieldsValue(workOrder);
    }
  }, [workOrder, form]);

  if (isLoading) {
    return <KSpin />;
  }

  if (!profiles) {
    return <Row justify="center">No profiles found</Row>;
  }

  const handleOk = (values: IWorkOrder) => {
    console.log(values);
    const newValues = {
      id: values.id,
      status: values.status,
      profile: values.profile,
    } as IWorkOrderVariables;

    console.log(newValues);
    try {
      updateWorkOrder(newValues, {
        onSuccess: () => {
          message.success("Work Order updated successfully");
          form.resetFields();
          onClose();
        },
        onError: (error) => {
          message.error(error.message);
        },
      });
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <Drawer
      maskClosable={false}
      width={500}
      footer={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            loading={isPending}
            onClick={() => form.submit()}
            type="primary"
          >
            Submit
          </Button>
        </Space>
      }
      title={`Edit Work Order: WO-${workOrder?.id}`}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item
          label="Date"
          name="created_at"
          getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
        >
          <DatePicker disabled format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item label="Image" name={["order_line_item", "variant", "media"]}>
          <Image
            width={70}
            src={workOrder?.order_line_item.variant.media?.url}
          />
        </Form.Item>
        <Form.Item label="Work Order No" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item label="SKU" name={["order_line_item", "variant", "sku"]}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Ordered Quantity"
          name={["order_line_item", "quantity"]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item label="Operation" name={["operation", "name"]}>
          <Select disabled />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Please select a profile" }]}
          label="Assigned to"
          name={["profile", "id"]}
        >
          <Select placeholder="Select Karigar">
            {profiles?.map((profile) => (
              <Select.Option key={profile.id} value={profile.id}>
                {profile.first_name} {profile.last_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select placeholder="Select Status">
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="in_progress">In Progress</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
