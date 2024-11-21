import { Button, Divider, Form } from "antd";
import { KSpin, SectionHeader } from "../../../components";
import Wrapper from "../../../components/wrapper";
import { CustomerForm } from "../components/CustomerForm";
import { ICustomerVariables } from "../types/customerInterfaces";
import { useCustomer, useUpdateCustomer } from "../hooks/useCustomers";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, error, isLoading } = useCustomer(Number(id));
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();

  const [form] = Form.useForm<ICustomerVariables>();

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        id: customer?.id,
        name: customer.name,
      });
    }
  }, [customer, form]);

  const handleSubmit = (values: ICustomerVariables) => {
    try {
      updateCustomer(
        {
          id: values.id,
          customer: values,
        },
        {
          onSuccess: () => {
            navigate("/customers");
          },
          onError: (error) => {
            console.error(error);
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <KSpin />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper height="calc(100vh - 48px)">
      <SectionHeader
        title="Edit Customer"
        children={
          <Button loading={isUpdating} onClick={() => form.submit()}>
            Save
          </Button>
        }
      />
      <Divider />
      <Form onFinish={handleSubmit} layout="vertical" form={form}>
        <CustomerForm />
      </Form>
    </Wrapper>
  );
};
