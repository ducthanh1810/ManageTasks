import {
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  MenuProps,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  theme,
} from "antd";
import React, { Component, memo, useMemo } from "react";
import { Text } from "../../text";
import {
  AlignLeftOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { TextIcon } from "../../icon/texticon";
import { getDateColor } from "../../../utilities";
import dayjs from "dayjs";
import { CustomAvatar } from "../../custom-avatar";
import { useDelete, useNavigation } from "@refinedev/core";

type ProjectCardProps = {
  id: string;
  title: string;
  dueDate?: string;
  users?: string;
  reloaded: boolean;
  setReloaded: (reloaded: boolean) => void;
};

type User = {
  id: string;
  name: string;
};

export const ProjectCard = ({
  id,
  title,
  dueDate,
  users,
  reloaded,
  setReloaded,
}: ProjectCardProps) => {
  const { token } = theme.useToken();
  const { edit } = useNavigation();
  const { mutate: deleteTask } = useDelete();

  const list_users = useMemo(() => {
    var list: User[] = [];
    const data = users?.split("|");
    data?.slice(0, data.length - 1).map((user) => {
      list.push({ id: user.split(",")[1], name: user.split(",")[0] });
    });
    return list;
  }, [users]);
  const dropdownItems = useMemo(() => {
    const dropdownItems: MenuProps["items"] = [
      {
        label: "View card",
        key: "1",
        icon: <EyeOutlined />,
        onClick: () => {
          edit("tasks", `?id=${id}`, "replace");
        },
      },
      {
        danger: true,
        label: "Delete card",
        key: "2",
        icon: <DeleteOutlined />,
        onClick: () => {
          deleteTask({
            resource: "tasks/delete",
            id,
            successNotification: (data, values, resource) => {
              return {
                message: `Delete Successfully.`,
                description: "Success with no errors",
                type: "success",
              };
            },
          });
          setReloaded(false);
        },
      },
    ];
    return dropdownItems;
  }, []);

  const dueDateOptions = useMemo(() => {
    if (!dueDate) return null;

    const date = dayjs(dueDate);
    return {
      color: getDateColor({ date: dueDate }) as string,
      text: date.format("MMM D"),
    };
  }, [dueDate]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: {
            colorText: token.colorTextSecondary,
          },
          Card: {
            headerBg: "transparent",
          },
        },
      }}
    >
      <Card
        size="small"
        title={<Text ellipsis={{ tooltip: title }}>{title}</Text>}
        onClick={() => {
          edit("tasks", `?id=${id}`, "replace");
        }}
        extra={
          <Dropdown
            trigger={["click"]}
            menu={{
              items: dropdownItems,
              onPointerDown: (e) => {
                e.stopPropagation();
              },
              onClick: (e) => {
                e.domEvent.stopPropagation();
              },
            }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined style={{ transform: "rotate(90deg)" }} />}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Dropdown>
        }
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlignLeftOutlined style={{ marginRight: "4px" }} />
          {dueDateOptions && (
            <Tag
              icon={<ClockCircleOutlined />}
              style={{
                padding: "0 4px",
                marginInlineEnd: "0",
                backgroundColor:
                  dueDateOptions.color === "default" ? "transparent" : "unset",
              }}
              color={dueDateOptions.color}
              bordered={dueDateOptions.color !== "default"}
            >
              {dueDateOptions.text}
            </Tag>
          )}
          {!!list_users?.length && (
            <Space
              size={4}
              wrap
              direction="horizontal"
              align="center"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginLeft: "auto",
                marginRight: "0",
              }}
            >
              {list_users.map((user) => {
                return (
                  <Tooltip key={user.id} title={user.name}>
                    <CustomAvatar name={user.name} />
                  </Tooltip>
                );
              })}
            </Space>
          )}
        </div>
      </Card>
    </ConfigProvider>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <Card
      size="small"
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
      }}
      title={
        <Skeleton.Button
          active
          size="small"
          style={{
            width: "200px",
            height: "22px",
          }}
        />
      }
    >
      <Skeleton.Button
        active
        size="small"
        style={{
          width: "200px",
        }}
      />
      <Skeleton.Avatar active size="small" />
    </Card>
  );
};

export const ProjectCardMemo = memo(ProjectCard, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.dueDate === next.dueDate &&
    prev.users?.length === next.users?.length &&
    prev.setReloaded === next.setReloaded
  );
});
