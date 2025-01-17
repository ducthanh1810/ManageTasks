import { useLocation } from "react-router";

import { FilterDropdown, useTable } from "@refinedev/antd";

import { SearchOutlined, TeamOutlined } from "@ant-design/icons";
import { Card, Input, Space, Table } from "antd";

import { CustomAvatar, Text } from "@/components";
import { IProfile, IProject } from "@/model/types";
import { useUpdate } from "@refinedev/core";
import { API_BASE_URL } from "@/providers";

export const ProjectOfCustomerTable = ({
  resource,
  field,
}: {
  resource: string;
  field: string;
}) => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const id = Number(query.get("id")) || 0;

  const { tableProps } = useTable<IProject>({
    resource: resource,
    syncWithLocation: false,

    filters: {
      permanent: [
        {
          field: field,
          operator: "eq",
          value: id,
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
