import { useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import { FlagOutlined } from "@ant-design/icons";
import { Checkbox, Form, Select, Space } from "antd";
import { stages } from "../../../../../model/types";

import { AccordionHeaderSkeleton } from "../../../../../components";
import { useMemo } from "react";

type Props = {
  id?: string;
  initialValues: {
    type: { value?: string; label?: string };
    completed?: boolean;
  };
  isLoading?: boolean;
};

export const StageForm = ({ id, initialValues, isLoading }: Props) => {
  const { formProps } = useForm({
    action: "edit",
    resource: "tasks/update",
    id: id,
    queryOptions: {
      enabled: false,
    },
    autoSave: {
      enabled: true,
      debounce: 0,
    },
  });
  const selectOptions = useMemo(() => {
    const list: any[] = [];
    stages.map((stage) => {
      list.push({ value: stage, label: stage });
    });
    return list;
  }, []);

  if (isLoading) {
    return <AccordionHeaderSkeleton />;
  }
  return (
    <div style={{ padding: "12px 24px", borderBottom: "1px solid #d9d9d9" }}>
      <Form
        layout="inline"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
        {...formProps}
      >
        <Space size={5}>
          <FlagOutlined />
          <Form.Item noStyle name={"type"} initialValue={initialValues.type}>
            <Select
              popupMatchSelectWidth={false}
              options={selectOptions}
              bordered={false}
              showSearch={false}
              placeholder="Select a stage"
              onSearch={undefined}
              size="small"
            />
          </Form.Item>
        </Space>
        <Form.Item
          noStyle
          name="completed"
          valuePropName="checked"
          initialValue={initialValues.completed}
        >
          <Checkbox>Mark as complete</Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};
