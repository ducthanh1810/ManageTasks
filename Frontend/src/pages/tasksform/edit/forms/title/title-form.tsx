import React, { useMemo } from "react";

import { useForm } from "@refinedev/antd";
import { HttpError, useInvalidate } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { Form, Skeleton } from "antd";

import { Text } from "../../../../../components/text";
import { ITask } from "../../../../../model/types";

const TitleInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const onTitleChange = (newTitle: string) => {
    onChange?.(newTitle);
  };

  return (
    <Text
      editable={{
        onChange: onTitleChange,
      }}
      style={{ width: "98%" }}
    >
      {value}
    </Text>
  );
};

type Props = {
  id?: ITask["id"];
  task?: ITask;
  initialValues: {
    title?: ITask["title"];
  };
  isLoading?: boolean;
};

export const TitleForm = ({ id, task, initialValues, isLoading }: Props) => {
  const invalidate = useInvalidate();

  const { formProps } = useForm({
    action: "edit",
    resource: "tasks/update",
    id: id,
    queryOptions: {
      enabled: false,
    },
    warnWhenUnsavedChanges: false,
    autoSave: {
      enabled: true,
    },
    onMutationSuccess: () => {
      invalidate({ invalidates: ["list"], resource: "tasks" });
    },
  });

  React.useEffect(() => {
    formProps.form?.setFieldsValue(initialValues);
  }, [initialValues.title]);

  if (isLoading) {
    return (
      <Skeleton.Input
        size="small"
        style={{ width: "95%", height: "22px" }}
        block
      />
    );
  }

  return (
    <Form {...formProps} initialValues={initialValues}>
      <Form.Item noStyle name="title">
        <TitleInput />
      </Form.Item>
    </Form>
  );
};
