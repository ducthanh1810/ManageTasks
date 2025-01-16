import { Edit, useForm } from "@refinedev/antd";
import {
  useGo,
  useResourceParams,
  HttpError,
  useOne,
  useResource,
} from "@refinedev/core";

import { Button, Form, Input, theme } from "antd";

import { CustomAvatar } from "@/components";
import { ICustomer } from "@/model/types";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/providers";

export const CustomerForm = () => {
  const go = useGo();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const id = Number(query.get("id")) || 0;
  const {
    saveButtonProps,
    formProps,
    formLoading,
    queryResult: queryResultCustomer,
  } = useForm<ICustomer, HttpError>({
    resource: "customer",
    action: "edit",
    id: id,
    redirect: false,
  });

  const { name } = queryResultCustomer?.data?.data || {};

  return (
    <Edit
      headerProps={{
        onBack: () =>
          go({
            to: { resource: "projects", action: "list" },
            type: "replace",
          }),
      }}
      resource="projects"
      title="Edit Customer"
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      breadcrumb={false}
    >
      <Form {...formProps} layout="vertical">
        <CustomAvatar
          shape="square"
          name={name || "Customer"}
          style={{
            width: 96,
            height: 96,
            marginBottom: "24px",
          }}
        />
        <Form.Item label="Name" name="name">
          <Input placeholder="Please enter name" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Please enter email" />
        </Form.Item>
        <Form.Item label="Number Phone" name="phone">
          <Input placeholder="Please enter Number Phone" />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input placeholder="Please enter Address" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
