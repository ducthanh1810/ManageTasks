import { useForm } from "@refinedev/antd";
import { Button, DatePicker, Form, Space, theme } from "antd";
import dayjs from "dayjs";

import { ITask } from "../../../../../model/types";

type Props = {
  id?: string;
  initialValues: {
    dueDate?: ITask["date"];
  };
  cancelForm: () => void;
};

export const DueDateForm = ({ id, initialValues, cancelForm }: Props) => {
  const { token } = theme.useToken();
  const { formProps, saveButtonProps } = useForm({
    resource: "tasks/update",
    action: "edit",
    id: id,
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      cancelForm();
    },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item
          noStyle
          name="date"
          getValueProps={(value) => {
            if (!value) return { value: undefined };
            return { value: dayjs(value) };
          }}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              showSecond: false,
              format: "HH:mm",
            }}
            style={{ backgroundColor: token.colorBgBlur }}
          />
        </Form.Item>
      </Form>
      <Space>
        <Button type="default" onClick={cancelForm}>
          Cancel
        </Button>
        <Button {...saveButtonProps} type="primary">
          Save
        </Button>
      </Space>
    </div>
  );
};
