import {
  Badge,
  Card,
  List,
  Skeleton as AntdSkeleton,
  Space,
  Popconfirm,
  Button,
} from "antd";
import { CreateButton, EditButton, ShowButton } from "@refinedev/antd";
import { Text } from "../text";
import React, { useState, useEffect } from "react";
import { CarryOutOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDelete, useList } from "@refinedev/core";
import { IEvent } from "../../model/types";
import { EventEdit } from "./form-edit/event-edit";
import dayjs from "dayjs";

type props = {
  reLoadTotal: () => void;
};

export const UpcomingEvents = ({ reLoadTotal }: props) => {
  const [isReload, setReload] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isType, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<IEvent>();
  const { data, isLoading: eventLoading } = useList<IEvent>({
    resource: "events",
    pagination: { current: 1, pageSize: 5 },
    queryOptions: {
      enabled: isReload,
    },
  });
  const { mutate } = useDelete();

  useEffect(() => {
    setReload(true);
  }, [isReload]);

  const deleteAbsent = (id: string) => {
    mutate(
      {
        resource: "events/delete",
        id: id,
        successNotification: (data, values, resource) => {
          return {
            message: `Delete Successfully.`,
            description: "Success with no errors",
            type: "success",
          };
        },
      },
      {
        onSuccess: () => {
          setReload(false);
          reLoadTotal();
        },
      }
    );
  };

  const handleSubmit = (type: string, event?: IEvent) => {
    setType(type);
    setEvents(event);
    setIsOpen(true);
  };

  return (
    <Card
      style={{ height: "100%" }}
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
            <CarryOutOutlined />
            <Text>Upcoming Events</Text>
          </div>
          <CreateButton onClick={() => handleSubmit("create")} />
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
                  avatar={
                    <Badge
                      color={
                        item.date.toString().split("T")[0] ==
                        new Date().toISOString().split("T")[0]
                          ? "red"
                          : "green"
                      }
                    />
                  }
                  title={
                    <Text size="xs">
                      {item.title +
                        " : " +
                        dayjs(item.date).format("DD-MM-YYYY")}
                    </Text>
                  }
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.content}
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
                    title="Delete to Event"
                    description="Are you sure to delete this Event?"
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
      <EventEdit
        opened={isOpen}
        setOpened={setIsOpen}
        reloaded={isReload}
        setReloaded={setReload}
        type={isType}
        event={events}
        reLoadTotal={reLoadTotal}
      />
    </Card>
  );
};
