import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { MouseEventHandler, PointerEventHandler } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  onClick?: PointerEventHandler<HTMLButtonElement> &
    MouseEventHandler<HTMLElement>;
  title?: string;
  route?: string;
  size?: "small" | "middle" | "large";
}

interface DeleteButtonProps {
  onClick?: ((e?: React.MouseEvent<HTMLElement>) => void) | undefined;
  title?: string;
  id?: string;
  loading?: boolean;
  size?: "small" | "middle" | "large";
}

export const CreateButton: React.FC<ButtonProps> = ({ title, route = "" }) => {
  return (
    <Link to={route}>
      <Button type="primary" icon={<PlusSquareOutlined />}>
        {title}
      </Button>
    </Link>
  );
};

export const ShowButton: React.FC<ButtonProps> = ({
  onClick,
  title,
  route = "",
}) => {
  return (
    <Link to={route}>
      <Button icon={<EyeOutlined />} onClick={onClick}>
        {title}
      </Button>
    </Link>
  );
};

export const EditButton: React.FC<ButtonProps> = ({
  title,
  route = "",
  size,
}) => {
  return (
    <Link to={route}>
      <Button size={size} icon={<EditOutlined />}>
        {title}
      </Button>
    </Link>
  );
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  title,
  loading,
  size,
}) => {
  return (
    <Popconfirm
      onConfirm={onClick}
      title="Are you sure delete this this record?"
      okText="Yes"
      cancelText="No"
    >
      <Button size={size} danger icon={<DeleteOutlined />} loading={loading}>
        {title}
      </Button>
    </Popconfirm>
  );
};
