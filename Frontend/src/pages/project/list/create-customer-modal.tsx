import { useModalForm, useSelect } from "@refinedev/antd";
import { type HttpError, useGo } from "@refinedev/core";

import { DatePicker, Form, Input, Modal, Select, theme } from "antd";

import { SelectOptionWithAvatar } from "@/components";

import { ICustomer, IProfile } from "@/model/types";

export const CustomerCreateModal = () => {
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

  const { formProps, modalProps } = useModalForm<ICustomer[]>({
    action: "create",
    defaultVisible: true,
    resource: "customers",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
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
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Please enter company name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          initialValue={""}
          rules={[{ required: false }]}
        >
          <Input placeholder="Please enter description" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: false }]}
        >
          <Input type="number" placeholder="Please enter Phone Number" />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          initialValue={""}
          rules={[{ required: false }]}
        >
          <Input placeholder="Please enter Address" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
