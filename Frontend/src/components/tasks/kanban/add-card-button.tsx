import React from "react";
import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, theme } from "antd";
import { Text } from "../../text";

const { useToken } = theme;

interface Props {
  onClick: () => void;
}
export const KabanAddCardButton = ({
  children,
  onClick,
}: React.PropsWithChildren<Props>) => {
  const { token } = useToken();
  return (
    <Button
      size="large"
      icon={<PlusSquareOutlined className="md" />}
      style={{
        margin: "16px",
        backgroundColor: token.colorBgBlur,
      }}
      onClick={onClick}
    >
      {children ?? (
        <Text size="md" type="secondary">
          Add new card
        </Text>
      )}
    </Button>
  );
};
