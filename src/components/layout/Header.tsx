import { Avatar } from "antd";
import { Header } from "antd/es/layout/layout";

export const KHeader = () => {
  return (
    <Header
      style={{
        background: "#fff",
        padding: 0,
        boxShadow: "0.5px 0 2px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Avatar
        style={{
          marginRight: "24px",
          backgroundColor: "#f56a00",
          verticalAlign: "middle",
        }}
        size="large"
        gap={4}
      >
        U
      </Avatar>
    </Header>
  );
};
