import { useParams } from "react-router";

import { FilterDropdown, useTable, useSelect } from "@refinedev/antd";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, notification, Select, Space, Table } from "antd";

import {
  ContactStatusTag,
  CustomAvatar,
  SelectOptionWithAvatar,
  Text,
} from "@/components";
import { ContactStatus, ICustomer, IProfile, IProject } from "@/model/types";
import { useUpdate } from "@refinedev/core";
import { useState } from "react";
import { API_BASE_URL } from "@/providers";

export const ProjectOfCustomerTable = ({
  resource,
  field,
}: {
  resource: string;
  field: string;
}) => {
  const params = useParams();

  const { mutate } = useUpdate();
  const { tableProps } = useTable<IProject>({
    resource: resource,
    syncWithLocation: false,

    filters: {
      permanent: [
        {
          field: field,
          operator: "eq",
          value: params?.id as string,
        },
      ],
    },
  });

  return (
    <>
      <Card
        headStyle={{
          borderBottom: "1px solid #D9D9D9",
          marginBottom: "1px",
        }}
        bodyStyle={{ padding: 0 }}
        title={
          <Space size="middle">
            <TeamOutlined />
            <Text>Projects</Text>
          </Space>
        }
        extra={
          <>
            <Text className="tertiary">Total Projects: </Text>
            <Text strong>
              {tableProps?.pagination !== false && tableProps.pagination?.total}
            </Text>
          </>
        }
      >
        <Table
          {...tableProps}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: false,
          }}
        >
          <Table.Column<IProject>
            title="Title"
            dataIndex="title"
            render={(_, record) => {
              return (
                <Space>
                  <CustomAvatar
                    name={record.title}
                    src={API_BASE_URL + record.image}
                  />
                  <Text
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.title}
                  </Text>
                </Space>
              );
            }}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Name" />
              </FilterDropdown>
            )}
          />
          <Table.Column<IProject>
            title="Description"
            dataIndex="description"
            render={(_, record) => {
              return (
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.description}
                </Text>
              );
            }}
          />
          <Table.Column<IProject>
            title="Completed"
            dataIndex="completed"
            render={(_, record) => {
              return (
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.completed ? "Yes" : "No"}
                </Text>
              );
            }}
          />
        </Table>
      </Card>
    </>
  );
};

const statusOptions: {
  label: string;
  value: IProfile["stage"];
}[] = [
  {
    label: "New",
    value: "NEW",
  },
  {
    label: "Qualified",
    value: "QUALIFIED",
  },
  {
    label: "Unqualified",
    value: "UNQUALIFIED",
  },
  {
    label: "Won",
    value: "WON",
  },
  {
    label: "Negotiation",
    value: "NEGOTIATION",
  },
  {
    label: "Lost",
    value: "LOST",
  },
  {
    label: "Interested",
    value: "INTERESTED",
  },
  {
    label: "Contacted",
    value: "CONTACTED",
  },
  {
    label: "Churned",
    value: "CHURNED",
  },
];
