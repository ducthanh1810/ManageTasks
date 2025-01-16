import { useMemo, useState, memo, useEffect } from "react";

import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useInvalidate, useList, useNavigation } from "@refinedev/core";

import {
  AlignLeftOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";

import { Accordion } from "../../../components";
import { ITask } from "../../../model/types";

import { DescriptionForm } from "./forms/description/description-form";
import { DescriptionHeader } from "./forms/description/description-header";
import { DueDateForm } from "./forms/due-date/duedate-form";
import { DueDateHeader } from "./forms/due-date/duedate-header";
import { StageForm } from "./forms/stage/stage-form";
import { TitleForm } from "./forms/title/title-form";
import { UsersForm } from "./forms/users/users-form";
import { UsersHeader } from "./forms/users/users-header";
import { useSearchParams } from "react-router-dom";
import api from "../../../api";

type User = {
  id: string;
  last_name: string;
};

export const TasksEditPage = () => {
  const invalidate = useInvalidate();
  const [isReload, setReload] = useState(true);
  const [title, setTitle] = useState("");
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const { list } = useNavigation();
  const { modalProps, close, queryResult } = useModalForm<ITask[]>({
    resource: "tasks",
    action: "edit",
    defaultVisible: true,
    queryOptions: {
      enabled: isReload,
    },
    autoResetForm: false,
  });
  const { id, content, type, date, users, completed } =
    queryResult?.data?.data[0] ?? {};
  const isLoading = queryResult?.isLoading ?? true;

  useEffect(() => {
    setReload(true);
  }, [isReload]);

  useEffect(() => {
    setTitle(queryResult?.data?.data[0].title || "");
  }, [queryResult?.data?.data]);

  const list_users = useMemo(() => {
    var list: User[] = [];
    const data = users?.split("|");
    data?.slice(0, data.length - 1).map((user) => {
      list.push({ id: user.split(",")[1], last_name: user.split(",")[0] });
    });
    return list;
  }, [users]);

  const handleCancel = (value?: string) => {
    if (value) setActiveKey(value);
    else setActiveKey(undefined);
    setReload(false);
  };

  return (
    <Modal
      {...modalProps}
      className="kanban-update-modal"
      onCancel={() => {
        close();
        invalidate({ invalidates: ["list"], resource: "tasks" });
        list("tasks", "replace");
      }}
      title={
        <TitleForm
          id={id}
          initialValues={{ title: title || "" }}
          isLoading={isLoading}
        />
      }
      width={586}
      footer={
        <DeleteButton
          type="link"
          onSuccess={() => {
            list("tasks", "replace");
          }}
        >
          Delete card
        </DeleteButton>
      }
    >
      <StageForm
        id={id}
        initialValues={{
          type: { value: type, label: type },
          completed: completed,
        }}
        isLoading={isLoading}
      />
      <Accordion
        accordionKey="description"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DescriptionHeader description={content} />}
        isLoading={isLoading}
        icon={<AlignLeftOutlined />}
        label="Description"
      >
        <DescriptionForm
          id={id}
          initialValues={{ description: content }}
          cancelForm={handleCancel}
        />
      </Accordion>
      <Accordion
        accordionKey="due-date"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DueDateHeader dueData={date} />}
        isLoading={isLoading}
        icon={<FieldTimeOutlined />}
        label="Due date"
      >
        <DueDateForm
          id={id}
          initialValues={{ dueDate: date ?? undefined }}
          cancelForm={handleCancel}
        />
      </Accordion>

      <Accordion
        accordionKey="users"
        activeKey={activeKey}
        setActive={handleCancel}
        fallback={<UsersHeader users={list_users} />}
        isLoading={isLoading}
        icon={<UsergroupAddOutlined />}
        label="Users"
      >
        <UsersForm
          taskId={id}
          initialValues={{
            users: list_users?.map((user) => ({
              label: user.last_name,
              value: user.id,
            })),
          }}
          cancelForm={handleCancel}
        />
      </Accordion>
    </Modal>
  );
};
