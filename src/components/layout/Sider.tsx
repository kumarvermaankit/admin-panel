import {
  // AppstoreOutlined,
  // BarsOutlined,
  LogoutOutlined,
  PictureOutlined,
  RollbackOutlined,
  // PictureOutlined,
  // ScheduleOutlined,
  // ShoppingCartOutlined,
  // ToolOutlined,
  // UserOutlined,
} from "@ant-design/icons";
import { Button, Image, Menu, MenuProps, Popconfirm } from "antd";
import Sider from "antd/es/layout/Sider";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";

type MenuItem = Required<MenuProps>["items"][number];

// const items: MenuItem[] = [
//   {
//     key: "1",
//     label: "Products",
//     icon: <BarsOutlined />,
//     children: [
//       {
//         key: "/products",
//         label: "Products",
//         icon: <BarsOutlined />,
//       },
//       {
//         key: "/categories",
//         label: "Categories",
//         icon: <AppstoreOutlined />,
//       },
//     ],
//   },
//   {
//     key: "2",
//     label: "Orders",
//     icon: <ShoppingCartOutlined />,
//     children: [
//       {
//         key: "/orders",
//         label: "Orders",
//         icon: <ShoppingCartOutlined />,
//       },
//       {
//         key: "/customers",
//         label: "Customers",
//         icon: <UserOutlined />,
//       },
//     ],
//   },
//   {
//     key: "3",
//     label: "Production",
//     icon: <ToolOutlined />,
//     children: [
//       {
//         key: "/work-orders",
//         label: "Work Orders",
//         icon: <ScheduleOutlined />,
//       },
//       {
//         key: "/operations",
//         label: "Operations",
//         icon: <ToolOutlined />,
//       },
//     ],
//   },

//   {
//     key: "/media",
//     label: "Media",
//     icon: <PictureOutlined />,
//   },
// ];

const items: MenuItem[] = [
  {
        key: "/employee-access",
        label: "Employee Access",
        icon: <RollbackOutlined />,
      },
      {
        key: "/events",
        label: "Events",
        icon: <RollbackOutlined />,
      },
      {
        key: "/emergency-contacts",
        label: "Emergency Contacts",
        icon: <RollbackOutlined />,
      },
      {
        key: "/media",
        label: "Media",
        icon: <PictureOutlined />,
      },
];

export const KSider = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const onClick: MenuProps["onClick"] = async (e) => {
    navigate(e.key);
  };
  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#fff",
        boxShadow: "0.5px 0 2px rgba(0, 0, 0, 0.1)",
        zIndex: 1,
      }}
    >
      <div 
       style={{
        display: "flex",
        flexDirection: "column",
        gap: "45px"
      }}
      >
      <Link to={"/"}>
        <div
          className="logo"
          style={{ height: "32px", margin: "16px" }}
        >
          <Image src="/logo.png" preview={false} />
        </div>
      </Link>
      <Menu
        onClick={onClick}
        items={items}
        defaultSelectedKeys={["1"]}
        mode="inline"
      />

      <div
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          textAlign: "center",
          padding: "10px",
          background: "#fff",
        }}
      >
        <Popconfirm
          onConfirm={async () => {
            await logout();
            navigate("/login");
          }}
          title="Are you sure logout?"
          okText="Yes"
          cancelText="No"
        >
          <Button style={{ width: "100%" }} icon={<LogoutOutlined />}>
            Logout
          </Button>
        </Popconfirm>
      </div>
      </div>
    </Sider>
  );
};
