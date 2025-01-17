import {
  Space,
  Badge,
  Card,
  List,
  Skeleton as AntdSkeleton,
  Button,
  Popconfirm,
  Flex,
} from "antd";
import { Text } from "../text";
import React, { useState, useEffect } from "react";
import {
  CreateButton,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import {
  BulbOutlined,
  DeleteOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { HttpError, useList, useDelete } from "@refinedev/core";
import { AbsentEdit } from "./form-edit/absent-edit";
import { IAbsent } from "../../model/types";
import dayjs from "dayjs";

export const HistoryAbsent = ({ reLoadTotal }: { reLoadTotal: () => void }) => {
  const [field, setField] = useState<any>([
    {
      field: "date",
      operator: "eq",
      value: "now",
    },
  ]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [isReload, setReload] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isType, setType] = useState("");
  const [isMoreData, setMoreData] = useState(false);
  const [absent, setAbsent] = useState<IAbsent>();
  const [isLoading, setIsLoading] = useState(false);
  const { data, isLoading: absentLoading } = useList<IAbsent>({
    resource: "absent",
    pagination: { current: current, pageSize: pageSize },
    filters: field,
    queryOptions: {
      enabled: isReload,
      onSuccess: () => {
        reLoadTotal();
      },
    },
  });
  const { mutate } = useDelete();

  useEffect(() => {
    reLoadTotal();
    setReload(true);
  }, [isReload]);

  const deleteAbsent = (id: string) => {
    mutate({
      resource: "absent/delete",
      id: id,
      successNotification: (data, values, resource) => {
        reLoadTotal();
        return {
          message: `Delete Successfully.`,
          description: "Success with no errors",
          type: "success",
        };
      },
    });
    setReload(false);
  };

  const handleSubmit = (type: string, absent?: IAbsent) => {
    setType(type);
    setAbsent(absent);
    setIsOpen(true);
  };

  const moreAbsent = () => {
    setMoreData(!isMoreData);
    setCurrent(1);
    setPageSize((prev) => (prev == 2 ? 5 : 2));
    setField((prev: any) =>
      prev == false
        ? [
            {
              field: "date",
              operator: "eq",
              value: "now",
            },
          ]
        : false
    );
  };

  return (
    <Card
      style={{
        height: "100%",
      }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div>
            <BulbOutlined />
            <Text>History Absent</Text>
          </div>
          <div>
            <CreateButton onClick={() => handleSubmit("create")} />
          </div>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color="transparent" />}
                  title={
                    <AntdSkeleton.Button
                      active
                      style={{
                        height: "16px",
                      }}
                    />
                  }
                  description={
                    <AntdSkeleton.Button
                      active
                      style={{
                        width: "300px",
                        marginTop: "8px",
                        height: "16px",
                      }}
                    />
                  }
                />
              </List.Item>
            );
          }}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color="yellow" />}
                  title={<Text size="xs">{item.title}</Text>}
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.content +
                        " : " +
                        dayjs(item.date).format("DD-MM-YYYY")}
                    </Text>
                  }
                />
                <Space>
                  <EditButton
                    hideText
                    size="small"
                    onClick={() => handleSubmit("edit", item)}
                  />
                  <ShowButton
                    hideText
                    size="small"
                    onClick={() => handleSubmit("show", item)}
                  />
                  <Popconfirm
                    title="Delete to Absent"
                    description="Are you sure to delete this absent?"
                    onConfirm={() => deleteAbsent(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              </List.Item>
            );
          }}
        />
      )}
      {isMoreData ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          <div
            style={{ display: "flex", gridColumn: 2, justifySelf: "center" }}
          >
            {current > 1 && (
              <Button
                icon={<LeftOutlined />}
                onClick={() => setCurrent((prev) => prev - 1)}
              />
            )}
            {current > 1 && (
              <Text style={{ margin: "3px 5px" }}>{current}</Text>
            )}
            {data?.data.length == 5 && (
              <Button
                icon={<RightOutlined />}
                onClick={() => setCurrent((prev) => prev + 1)}
              />
            )}
          </div>
          <Button
            icon={<UpOutlined />}
            onClick={moreAbsent}
            style={{
              display: "block",
              justifySelf: "end",
              gridColumn: 3,
              marginBottom: "5px",
            }}
          />
        </div>
      ) : (
        <Button
          icon={<DownOutlined />}
          onClick={moreAbsent}
          style={{
            display: "block",
            marginLeft: "auto",
            marginBottom: "5px",
          }}
        />
      )}
      <AbsentEdit
        opened={isOpen}
        setOpened={setIsOpen}
        reloaded={isReload}
        setReloaded={setReload}
        _absent={absent}
        type={isType}
      />
    </Card>
  );
};
