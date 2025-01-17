import React, { useEffect, useState } from "react";
import type { GetProp, TableProps } from "antd";
import "../../style.css";

import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import type { SorterResult } from "antd/es/table/interface";

import {
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Space, Table, theme } from "antd";

import { CustomAvatar, Text } from "@/components";
import { ICustomer, IProject } from "@/model/types";

type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

export const ProjectsPage = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { token } = theme.useToken();

  const [project, setProject] = useState<IProject[]>();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [tableCustomerParams, setTableCustomerParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    tableQueryResult: { data, isLoading },
  } = useTable({
    resource: "projects",
    pagination: {
      current: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
    },
  });

  const {
    tableQueryResult: { data: customersData, isLoading: customersIsLoading },
  } = useTable({
    resource: "customers",
    pagination: {
      current: tableCustomerParams.pagination?.current,
      pageSize: tableCustomerParams.pagination?.pageSize,
    },
  });

  const handleTableChange: TableProps<IProject>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setProject([]);
    }
  };
  return (
    <div className="page-container projects-page">
      <Card
        className="card-project"
        title="Projects"
        extra={
          <CreateButton
            onClick={() => {
              // modal is a opening from the url (/companies/new)
              // to open modal we need to navigate to the create page (/companies/new)
              // we are using `go` function because we want to keep the query params
              go({
                to: {
                  resource: "projects",
                  action: "create",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        }
      >
        <Table
          className="table-projects"
          dataSource={data?.data}
          pagination={{
            current: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize,
          }}
          rowKey={"id"}
          style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: "8px",
          }}
        >
          <Table.Column<IProject>
            dataIndex="name"
            title="Company title"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(_, record) => {
              return (
                <Space>
                  <CustomAvatar shape="square" name={record.title[0]} />
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
          />
          <Table.Column<IProject>
            dataIndex={"totalRevenue"}
            title="Description"
            render={(_, project) => {
              return <Text>{project?.description}</Text>;
            }}
          />
          <Table.Column<IProject>
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => {
                    go({
                      to: `task/show`,
                      query: { id: value },
                      type: "replace",
                    });
                  }}
                />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </Card>
      <Card
        className="card-customer"
        title="Customers"
        extra={
          <CreateButton
            onClick={() => {
              // modal is a opening from the url (/companies/new)
              // to open modal we need to navigate to the create page (/companies/new)
              // we are using `go` function because we want to keep the query params
              go({
                to: "customer/new",
                type: "replace",
              });
            }}
          />
        }
      >
        <Table
          className="table-projects"
          dataSource={customersData?.data}
          pagination={{
            current: tableCustomerParams.pagination?.current,
            pageSize: tableCustomerParams.pagination?.pageSize,
          }}
          rowKey={"id"}
          style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: "8px",
          }}
        >
          <Table.Column<ICustomer>
            dataIndex="name"
            title="Name Customer"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(_, record) => {
              return (
                <Space>
                  <CustomAvatar shape="square" name={record.name} />
                  <Text
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.name}
                  </Text>
                </Space>
              );
            }}
          />
          <Table.Column<ICustomer>
            dataIndex={"email"}
            title="Contact"
            render={(_, record) => {
              return (
                <Space>
                  <Button
                    disabled={!record.email}
                    size="small"
                    href={`mailto:${record.email}`}
                    icon={<MailOutlined />}
                  />
                  <Button
                    disabled={!record.phone}
                    size="small"
                    href={`tel:${record.phone}`}
                    icon={<PhoneOutlined />}
                  />
                </Space>
              );
            }}
          />
          <Table.Column<ICustomer>
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value) => (
              <Space>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => {
                    go({
                      to: `customer/edit`,
                      query: { id: value },
                      type: "replace",
                    });
                  }}
                />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </Card>
      {children}
    </div>
  );
};
