import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { KSider } from "./Sider";
const { Content } = Layout;

export const BasicLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#F4F7FE",
        marginLeft: 200,
      }}
    >
      <KSider />
      <Layout>
        {/* <KHeader /> */}
        <Content style={{ margin: "24px 24px 0", overflow: "initial" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
