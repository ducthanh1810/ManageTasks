import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useResourceParams } from "@refinedev/core";
import { DatePicker, Form, Input, Select, theme } from "antd";
import { CustomAvatar, SelectOptionWithAvatar } from "@/components";
import { ICustomer, IProject } from "@/model/types";
import dayjs from "dayjs";

export const ProjectForm = () => {
  const { token } = theme.useToken();
  const { id } = useResourceParams();
  const {
    saveButtonProps,
    formProps,
    formLoading,
    queryResult: queryResultProject,
  } = useForm<IProject>({
    resource: "project",
    action: "edit",
    id: id,
    redirect: false,
  });
  const { title } = queryResultProject?.data?.data || {};

  const { selectProps: selectPropsUsers, queryResult: queryResultUsers } =
    useSelect<ICustomer>({
      resource: "customers",
      optionLabel: "name",
      pagination: {
        mode: "off",
      },
    });

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      breadcrumb={false}
    >
      <Form {...formProps} layout="vertical">
        <CustomAvatar
          shape="square"
          name={title || "Project"}
          src={formProps?.initialValues?.image}
          style={{
            width: 96,
            height: 96,
            marginBottom: "24px",
          }}
        />
        <Form.Item
          label="Customer"
          name="customer"
          initialValue={formProps?.initialValues?.customer}
        >
          <Select
            {...selectPropsUsers}
            options={
              queryResultUsers.data?.data?.map(({ id, name }) => ({
                value: id,
                label: <SelectOptionWithAvatar name={name} />,
              })) ?? []
            }
          />
        </Form.Item>
        <Form.Item label="Title" name="title">
          <Input placeholder="Please enter title" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Please enter description" />
        </Form.Item>
        <Form.Item
          label="Expiration Date"
          name="expiration_date"
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
        <Form.Item label="Completed" name="completed">
          <Select options={TypeOptions} />
        </Form.Item>
      </Form>
    </Edit>
  );
};

const TypeOptions: {
  label: string;
  value: boolean;
}[] = [
  {
    label: "Unfinished",
    value: false,
  },
  {
    label: "Finished",
    value: true,
  },
];
