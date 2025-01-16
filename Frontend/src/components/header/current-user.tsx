import { Popover, Button } from "antd";
import { CustomAvatar } from "../custom-avatar";
import { useGetIdentity } from "@refinedev/core";
import { Text } from "../text";
import React, { useState, useEffect } from "react";
import { AccountSettings } from "./account-setting";
import { SettingOutlined } from "@ant-design/icons";
import { IProfile, IUser } from "../../model/types";

const CurrentUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user, refetch } = useGetIdentity<IProfile>();
  const [info_user, setInfoUser] = useState(user);
  useEffect(() => {
    setInfoUser(user);
  }, [user]);

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text strong style={{ padding: "12px 20px" }}>
        {info_user?.full_name}
      </Text>
      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined />}
          type="text"
          block
          onClick={() => setIsOpen(true)}
        >
          Account Setting
        </Button>
      </div>
    </div>
  );
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        overlayInnerStyle={{ padding: 0 }}
        overlayStyle={{ zIndex: 999 }}
        content={content}
      >
        <CustomAvatar
          name={info_user?.full_name}
          size="default"
          style={{ cursor: "pointer" }}
        />
      </Popover>
      {user && (
        <AccountSettings
          opened={isOpen}
          setOpened={setIsOpen}
          user={user}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default CurrentUser;
