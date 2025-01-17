import { SaveButton, useForm } from "@refinedev/antd";
import { HttpError, useUpdate } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";
import api from "../../../providers/api";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin, theme } from "antd";

import { CustomAvatar } from "../../custom-avatar";
import { Text } from "../../text";
import { IProfile, IUser } from "../../../model/types";
import React, { useState, useEffect } from "react";

const { useToken } = theme;

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  user: IProfile;
  refetch: () => void;
};

export const AccountSettings = ({
  opened,
  setOpened,
  user,
  refetch,
}: Props) => {
  const [full_name, setFullName] = useState(user.full_name);
  const [position, setPosition] = useState(user.position);
  const [email, setEmail] = useState(user.email);
  const { mutate, isLoading: isUpdating } = useUpdate();
  const { token } = useToken();

  useEffect(() => {
    setFullName(user.full_name);
    setEmail(user.email);
  }, []);

  const updateUser = async () => {
    await mutate({
      resource: "profile/update",
      id: user.user.toString(),
      values: { full_name, email, position },
      successNotification: (data, values, resource) => {
        refetch();
        return {
          message: `Update Account Successfully`,
          description: "Success with no errors",
          type: "success",
        };
      },
    });
  };

  const closeModal = () => {
    setOpened(false);
  };

  if (isUpdating) {
    return (
      <Drawer
        open={opened}
        width={756}
        styles={{
          body: {
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: { background: token.colorBgBlur, padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: token.colorBgBlur,
        }}
      >
        <Text strong>Account Settings</Text>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => closeModal()}
        />
      </div>
      <div
        style={{
          padding: "16px",
        }}
      >
        <Card>
          <Form layout="vertical">
            <CustomAvatar
              shape="square"
              name={full_name}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            <Form.Item label="Name" name="name">
              <Input
                type="text"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={full_name}
              />
            </Form.Item>
            <Form.Item label="Position" name="position">
              <Input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder={position}
              />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={email}
              />
            </Form.Item>
          </Form>
          <SaveButton
            onClick={updateUser}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </Card>
      </div>
    </Drawer>
  );
};
