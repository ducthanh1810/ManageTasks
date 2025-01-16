import { SaveButton, TextField, useForm } from "@refinedev/antd";
import { HttpError, useUpdate, useCreate } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";
import api from "../../../api";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin, theme } from "antd";
import type { FormProps } from "antd";
import { Text } from "../../text";

import React, { useState, useEffect } from "react";
import { abort } from "process";
import { IAbsent } from "../../../model/types";
import TextArea from "@uiw/react-md-editor/lib/components/TextArea/index.nohighlight";

const { useToken } = theme;

type FieldType = {
  name?: string;
  content?: string;
  type?: string;
  date?: Date;
};
type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  reloaded: boolean;
  setReloaded: (reloaded: boolean) => void;
  _absent?: IAbsent;
  type: string;
};

export const AbsentEdit = ({
  opened,
  setOpened,
  reloaded,
  setReloaded,
  _absent,
  type,
}: Props) => {
  const { mutate, isLoading: isUpdating } = useUpdate();
  const { onFinish, mutationResult } = useForm({
    action: "create",
    resource: "absent",
    successNotification: (data, values, resource) => {
      return {
        message: `Create Absent Successfully`,
        description: "Success with no errors",
        type: "success",
      };
    },
  });

  const onSubmit: FormProps<FieldType>["onFinish"] = (values) => {
    type == "create" ? onFinish(values) : updateAbsent(values);
  };

  const updateAbsent = async (value: FieldType) => {
    await mutate({
      resource: "absent/update",
      id: _absent?.id!,
      values: value,
      successNotification: (data, values, resource) => {
        return {
          message: `Update Successfully.`,
          description: "Success with no errors",
          type: "success",
        };
      },
    });
    setReloaded(false);
  };

  const { token } = useToken();

  const closeModal = () => {
    setOpened(false);
  };
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
        <Text strong>Absent Edit</Text>
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
        {opened && (
          <Card>
            <Form onFinish={onSubmit} layout="vertical" initialValues={_absent}>
              <Form.Item label="Name" name="name">
                {type === "create" && <Input placeholder={"Name"} />}
                {type === "show" && <Input />}
                {type === "edit" && <Input />}
              </Form.Item>
              <Form.Item label="Content" name="content">
                {type === "create" && <Input placeholder={"content"} />}
                {type === "show" && <Input />}
                {type === "edit" && <Input />}
              </Form.Item>
              <Form.Item label="Type" name="type">
                {type === "create" && <Input placeholder={"Type"} />}
                {type === "show" && <Input />}
                {type === "edit" && <Input />}
              </Form.Item>
              <Form.Item label="Date" name="date">
                {type === "create" && (
                  <Input type="Date" placeholder={"Date"} />
                )}
                {type === "show" && <Input type="Date" />}
                {type === "edit" && <Input type="Date" />}
              </Form.Item>
              {type !== "show" && (
                <SaveButton
                  type="primary"
                  htmlType="submit"
                  style={{
                    display: "block",
                    marginLeft: "auto",
                  }}
                />
              )}
            </Form>
          </Card>
        )}
      </div>
    </Drawer>
  );
};
