import { useParams } from "react-router";

import { FilterDropdown, useTable, useSelect } from "@refinedev/antd";

import {
  DeleteOutlined,
  MailOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";

import {
  ContactStatusTag,
  CustomAvatar,
  SelectOptionWithAvatar,
  Text,
} from "@/components";
import { ContactStatus, IProfile } from "@/model/types";
import { useUpdate } from "@refinedev/core";
import { useState } from "react";
import { API_BASE_URL } from "@/providers/api";

export const ProjectContactsTable = ({
  resource,
  field,
}: {
  resource: string;
  field: string;
}) => {
  const params = useParams();
  const [api, contextHolder] = notification.useNotification();

  const [collaborative, setCollaborative] = useState();

  const { mutate: AddContact } = useUpdate({});
  const { mutate: RemoveContact } = useUpdate({});

  const { tableProps } = useTable<IProfile>({
    resource: resource,
    // resource: "project/contacts",
    queryOptions: {
      refetchOnMount: true,
    },

    filters: {
      permanent: [
        {
          field: field,
          // field: "project.id",
          operator: "eq",
          value: params?.id as string,
        },
      ],
    },
  });

  const { selectProps: selectPropsUsers, queryResult: queryResultUsers } =
    useSelect<IProfile>({
      resource: "profiles",
      optionLabel: "full_name",
      pagination: {
        mode: "off",
      },
    });

  const updateContactHandle = (collaborative_id?: number) => {
    collaborative_id
      ? AddContact({
          id: params?.id || 0,
          resource: "project/contacts",
          values: {
            collaborative_id: collaborative_id,
            action: "add",
          },
          successNotification: () => {
            return {
              message: `Add Contact Successfully`,
              description: "Success with no errors",
              type: "success",
            };
          },
        })
      : api.open({
          message: "Error",
          description: "Please selected a user !!!",
          className: "custom-class",
          style: {
            width: 200,
          },
        });
  };

  const RemoveContactHandle = (id: number) => {
    RemoveContact({
      id: params?.id || 0,
      resource: "project/contacts",
      values: {
        collaborative_id: id,
        action: "remove",
      },
      successNotification: () => {
        return {
          message: `Remove Contact Successfully`,
          description: "Success with no errors",
          type: "success",
        };
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Card
        headStyle={{
          borderBottom: "1px solid #D9D9D9",
          marginBottom: "1px",
        }}
        bodyStyle={{ padding: 0 }}
        title={
          <Space size="middle">
            <TeamOutlined />
            <Text>Contacts</Text>
          </Space>
        }
        extra={
          <>
            <Text className="tertiary">Total contacts: </Text>
            <Text strong>
              {tableProps?.pagination !== false && tableProps.pagination?.total}
            </Text>
          </>
        }
      >
        <Table
          {...tableProps}
          rowKey="user"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: false,
          }}
        >
          <Table.Column<IProfile>
            title="Name"
            dataIndex="name"
            render={(_, record) => {
              return (
                <Space>
                  <CustomAvatar
                    name={record.full_name}
                    src={API_BASE_URL + record.image}
                  />
                  <Text
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.full_name}
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
          <Table.Column
            title="Position"
            dataIndex="position"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column<IProfile>
            title="Stage"
            dataIndex="status"
            render={(_, record) => {
              return (
                <ContactStatusTag status={record.stage as ContactStatus} />
              );
            }}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                  options={statusOptions}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<IProfile>
            title="Action"
            dataIndex="id"
            width={112}
            render={(value, record) => {
              return (
                <Space>
                  <Button
                    disabled={!record.email}
                    size="small"
                    href={`mailto:${record.email}`}
                    icon={<MailOutlined />}
                  />
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => RemoveContactHandle(Number(record.user))}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger size="small">
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </Space>
              );
            }}
          />
        </Table>
        <div
          style={{
            display: "flex",
            padding: "5px",
            gap: "5px",
            justifyContent: "end",
          }}
        >
          <Select
            {...selectPropsUsers}
            placeholder="Select a person"
            onChange={(data) => setCollaborative(data as any)}
            options={
              queryResultUsers.data?.data?.map(({ user, full_name }) => ({
                value: user,
                label: <SelectOptionWithAvatar name={full_name} />,
              })) ?? []
            }
          />
          <Button
            type="primary"
            onClick={() => updateContactHandle(collaborative)}
          >
            Add Contact
          </Button>
        </div>
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
