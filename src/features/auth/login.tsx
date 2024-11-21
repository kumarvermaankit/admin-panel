import { Form, Input, Button, Card, Image } from "antd";
import { ILogin } from "../../interfaces";
import Wrapper from "../../components/wrapper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: ILogin) => {
    try {
     await login(values.email, values.password);
     navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper height="100vh" backgroundColor="#F4F7FE">
      <div style={{  
        marginTop: "calc(50vh - 270px)", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center" ,
        gap: "20px"
        }}>
      <Image src="/logo.png" width="300px" height="200px" preview={false} />
      <Card
        title="LOGIN"
        bordered={false}
        style={{ width: 500, margin: "auto" }}
      >
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item<ILogin>
            label="Email"
            name="email"
            labelAlign="right"
            rules={[
              {
                required: true,
                message: " Input your email!",
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<ILogin>
            label="Password"
            name="password"
            labelAlign="right"
            rules={[{ required: true, message: "Input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      </div>
    </Wrapper>
  );
};
