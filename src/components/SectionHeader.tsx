import { Flex, Typography } from "antd";
import React, { ReactNode } from "react";
const { Title } = Typography;

interface SectionHeaderProps {
  title: string;
  children?: ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  children,
}) => {
  return (
    <Flex justify="space-between">
      <Title style={{ color: "#434343", margin:"0" }} level={5}>
        {title}
      </Title>
      {children}
    </Flex>
  );
};
