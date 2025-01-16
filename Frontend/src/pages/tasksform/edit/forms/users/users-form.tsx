import { log } from "@antv/g2plot/lib/utils";
import { useForm, useSelect } from "@refinedev/antd";
import { HttpError, useInvalidate, useUpdate } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import { Button, Form, Select, Space } from "antd";
import React, { useRef, useState } from "react";

type Props = {
  taskId?: string;
  initialValues: {
    users?: { label: string; value: string }[];
  };
  cancelForm: () => void;
};

type initialValues = {
  users?: { label: string; value: string }[];
};

interface User {
  id: string;
  last_name: string;
}

export const UsersForm = ({ taskId, initialValues, cancelForm }: Props) => {
  const invalidate = useInvalidate();
  const [default_value, setInitialValues] =
    useState<initialValues>(initialValues);
  const { mutate, isLoading: isUpdating } = useUpdate();
  const [form] = Form.useForm<{ users: any }>();
  const selectRef = useRef();
  // const { formProps, saveButtonProps } = useForm({
  //   resource: "tasks/update",
  //   action: "edit",
  //   id: taskId,
  //   queryOptions: {
  //     enabled: false,
  //   },
  //   redirect: false,
  // });
  const { selectProps } = useSelect<User>({
    resource: "users/name",
    optionLabel: "last_name",
    optionValue: "id",
  });

  const handleChange = (value: any) => {
    var user: string = "";
    value.map((value: any) => {
      user = user + `${value.label}, ${value.value}|`;
    });
    mutate(
      {
        resource: "tasks/update",
        id: taskId!,
        values: { users: user },
        successNotification: false,
      },
      {
        onSuccess: () => {
          setInitialValues({ users: value });
        },
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <Form
        form={form}
        style={{ width: "100%" }}
        initialValues={default_value}
        autoComplete="off"
      >
        <Form.Item noStyle name="users">
          <Select
            {...selectProps}
            labelInValue
            className="selectNames"
            dropdownStyle={{ padding: "0px" }}
            style={{ width: "100%" }}
            onChange={(value) => handleChange(value)}
            mode="multiple"
          />
        </Form.Item>
      </Form>
      <Space>
        <Button type="default" onClick={cancelForm}>
          Save
        </Button>
      </Space>
    </div>
  );
};
