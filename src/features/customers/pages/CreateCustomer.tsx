import { Button, Divider, Form, message } from "antd";
import { SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { ICustomerVariables } from "../types/customerInterfaces";
import { useCreateCustomer } from "../hooks/useCustomers";
import { useNavigate } from "react-router-dom";
import { CustomerForm } from "../components/CustomerForm";

export const CreateCustomer = () => {
  const [form] = Form.useForm<ICustomerVariables>();
  const { mutate: createCustomer, isPending } = useCreateCustomer();
  const navigate = useNavigate();

  const handleSubmit = (values: ICustomerVariables) => {
    createCustomer(values, {
      onSuccess: () => {
        message.success("Customer created successfully");
        form.resetFields();
        navigate("/customers");
      },
      onError: (error) => {
        message.error(error.message);
      },
    });
  };

  return (
    <Wrapper height="calc(100vh - 48px)">
      <SectionHeader
        title="Create Customer"
        children={<Button loading={isPending} onClick={() => form.submit()}>Save</Button>}
      />
      <Divider />
      <Form onFinish={handleSubmit} layout="vertical" form={form}>
        <CustomerForm />
      </Form>
    </Wrapper>
  );
};
