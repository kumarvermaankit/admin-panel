import React from "react";
import { Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

interface TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5;
  type?: "title" | "text" | "paragraph";
  children: React.ReactNode;
}

export const KTypography: React.FC<TypographyProps> = ({
  level,
  type = "text",
  children,
}) => {
  switch (type) {
    case "title":
      return <Title level={level}>{children}</Title>;
    case "text":
      return <Text>{children}</Text>;
    case "paragraph":
      return <Paragraph>{children}</Paragraph>;
    default:
      return <Text>{children}</Text>;
  }
};

