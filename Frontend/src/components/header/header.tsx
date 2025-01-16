import CurrentUser from "./current-user";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  Typography,
  theme,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  0: {
    email: string;
    id: Float32Array;
    username: string;
  };
};
export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);
  const [info_user, setInfoUser] = useState(user?.[0]);

  useEffect(() => {
    setInfoUser(user?.[0]);
  }, [user]);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }
  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Space align="center" size="middle">
          <CurrentUser />
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};

export default Header;
