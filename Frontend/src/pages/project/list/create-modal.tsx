import { useModalForm, useSelect } from "@refinedev/antd";
import { type HttpError, useGo } from "@refinedev/core";

import { DatePicker, Form, Input, Modal, Select, theme } from "antd";

import { SelectOptionWithAvatar } from "@/components";

import { ICustomer, IProfile } from "@/model/types";

export const ProjectCreateModal = () => {
  const go = useGo();
  const { token } = theme.useToken();

  const goToListPage = () => {
    go({
      to: { resource: "projects", action: "list" },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm<IProfile[]>({
    action: "create",
    defaultVisible: true,
    resource: "projects",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
  });

  const { selectProps, queryResult } = useSelect<ICustomer>({
    resource: "customers",
    optionLabel: "name",
  });

  return (
    <Modal
      {...modalProps}
      mask={true}
      onCancel={goToListPage}
      title="Add new project"
      width={512}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Project name"
          name="title"
          rules={[{ required: true }]}
        >
          <Input placeholder="Please enter company name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          initialValue={""}
          rules={[{ required: false }]}
        >
          <Input placeholder="Please enter description" />
        </Form.Item>
        <Form.Item
          label="Expiration Date"
          name="expiration_date"
          rules={[{ required: true }]}
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
        <Form.Item
          label="Customer owner"
          name="customer"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Please Customer user"
            {...selectProps}
            options={
              queryResult.data?.data?.map((user) => ({
                value: user.id,
                label: <SelectOptionWithAvatar name={user.name} />,
              })) ?? []
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
