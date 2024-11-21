import { Card, Row, Col } from "antd";
import { useBusesArrivalCount, useFeedbackCount, useLoginCount, useRegistrationsCount, useSpinWheelQuizCount } from "../../features/products/hooks/useDashboard";

export const Dashboard = () => {
  const { data: registrationCount } = useRegistrationsCount();
  const { data: loginCount } = useLoginCount()
  const { data: quizCount } = useSpinWheelQuizCount();
  const { data: busArrivalCount } = useBusesArrivalCount();
  const { data: feedbackCount } = useFeedbackCount();
  const cardData = [
    { title: "Registrations", value: registrationCount, key: "1" },
    { title: "Logins", value: loginCount, key: "2" },
    { title: "Quiz", value: quizCount , key: "3" },
    { title: "Bus Arrivals", value: busArrivalCount , key: "4" },
    { title: "Feedback Submissions", value: feedbackCount , key: "5" },

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
              <p>{card.value}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
