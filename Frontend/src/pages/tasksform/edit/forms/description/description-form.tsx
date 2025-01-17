import { useForm } from "@refinedev/antd";

import MDEditor from "@uiw/react-md-editor";
import { Button, Form, Space } from "antd";

import { ITask } from "../../../../../model/types";

type Props = {
  id?: string;
  initialValues: {
    description?: ITask["content"];
  };
  cancelForm: () => void;
};

export const DescriptionForm = ({ id, initialValues, cancelForm }: Props) => {
  const { formProps, saveButtonProps } = useForm({
    action: "edit",
    resource: "tasks/update",
    id: id,
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      cancelForm();
    },
  });

  console.log("initialValues", initialValues);

  return (
    <>
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item noStyle name="description">
          <MDEditor
            defaultValue={initialValues.description}
            preview="edit"
            data-color-mode="light"
            height={250}
          />
        </Form.Item>
      </Form>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginTop: "12px",
        }}
      >
        <Space>
          <Button type="default" onClick={cancelForm}>
            Cancel
          </Button>
          <Button {...saveButtonProps} type="primary">
            Save
          </Button>
        </Space>
      </div>
    </>
  );
};
