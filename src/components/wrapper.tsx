import React, { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  height?: string;
  backgroundColor?: string;
  width?: string;
  margin?: string;
  marginBottom?: string;
  padding?: string;
  borderRadius?: string;
  boxShadow?: string;
  style?: React.CSSProperties;
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
  height = "auto",
  backgroundColor = "#fff",
  width = "auto",
  margin = "0px",
  marginBottom= "0px",
  padding = "24px",
  borderRadius = "8px",
  boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)",
  style,

}) => {
  return (
    <div
      style={{
        margin,
        marginBottom,
        padding,
        backgroundColor,
        borderRadius,
        height,
        width,
        boxShadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
