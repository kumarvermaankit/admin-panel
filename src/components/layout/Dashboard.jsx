import { Card, Row, Col } from "antd";

export const Dashboard = () => {
  const cardData = [
    { title: "Users", description: "Manage users", key: "1" },
    { title: "Orders", description: "View and manage orders", key: "2" },
    { title: "Products", description: "Manage product inventory", key: "3" },
    { title: "Reports", description: "View analytics and reports", key: "4" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {cardData.map((card) => (
          <Col key={card.key} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={card.title}
              bordered={true}
              hoverable
              style={{ textAlign: "center" }}
            >
              <p>{card.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
