import React, { useEffect, useState, useMemo } from "react";
import { Card, Checkbox, DatePicker, theme } from "antd";
import {
  KanbanBoard,
  KanbanBoardContainer,
  KanbanColumn,
  KanbanItem,
  ProjectCard,
  ProjectCardMemo,
  KabanAddCardButton,
  ProjectCardSkeleton,
  KanbanColumnSkeleton,
} from "../../../components/tasks";
import {
  ITask,
  ITaskUser,
  IUser,
  stages,
  ITasksStages,
  FilterTask,
} from "../../../model/types";
import {
  CrudFilter,
  CrudOperators,
  HttpError,
  LogicalFilter,
  useList,
  useNavigation,
  useUpdate,
} from "@refinedev/core";
import { DragEndEvent } from "@dnd-kit/core";
import { formatDate } from "../../../utilities";

const FilterTaskHandle = ({}) => {
  const filter: { field: string; order: string }[] = [];
};

export const ListTasksPage = ({ children }: React.PropsWithChildren) => {
  const { token } = theme.useToken();
  const { replace } = useNavigation();
  const [isReload, setReload] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [filterTasks, setFilterTasks] = useState<LogicalFilter[]>([]);
  const { data: list_tasks, isLoading: tasksLoading } = useList<ITask>({
    resource: "tasks",
    queryOptions: {
      enabled: isReload,
    },
    filters: filterTasks,
  });
  const { data: list_users, isLoading: userLoading } = useList<IUser>({
    resource: "users",
    queryOptions: {
      enabled: false,
    },
  });
  const { mutate: updateTask } = useUpdate<ITask, HttpError>();

  useEffect(() => {
    setReload(true);
  }, [isReload]);

  const grouped: ITasksStages[] = useMemo(() => {
    var grouped: ITasksStages[] = [];
    stages.map((type) => {
      grouped.push({
        title: type,
        data: list_tasks?.data.filter((task) => task.type == type),
      });
    });
    return grouped;
  }, [list_tasks]);

  const handleAddCard = (args: { stageId: string }) => {
    const path = `/tasks/new/?stageId=${args.stageId}`;
    replace(path);
  };

  const handleOnDragEnd = async (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current?.stageId;

    if (taskStageId === stageId) {
      return;
    }
    await updateTask(
      {
        resource: "tasks/type",
        id: taskId,
        values: { type: stageId },
        successNotification: false,
      },
      {
        onError: (error, variables, context) => {
          // An error occurred!
        },
        onSuccess: (data, variables, context) => {
          setReload(false);
        },
      }
    );
  };

  const setFilterHandle = ({
    field,
    operator,
    value,
  }: {
    field: FilterTask;
    operator: CrudOperators;
    value: any;
  }) => {
    const filter = {
      field: field,
      operator: operator,
      value: value,
    } as LogicalFilter;
    console.log(filter);
    filterTasks.length === 0 && setFilterTasks([filter]);
    filterTasks.map((_filter, index) => {
      if (filter.field === _filter.field) {
        filterTasks[index] = filter;
        setFilterTasks([...filterTasks]);
      } else {
        setFilterTasks([...filterTasks, filter]);
      }
    });
  };

  const isLoading = tasksLoading || userLoading;
  if (tasksLoading && userLoading) return <PageSkeleton />;
  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "10px",
          background: token.colorBgContainer,
          borderRadius: "8px",
          display: "flex",
          gap: "50px",
          fontWeight: "normal",
          alignItems: "center",
          color: token.colorText,
          zIndex: 99,
        }}
      >
        <span style={{ fontWeight: "600" }}>Search by:</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>From:</span>
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              showSecond: false,
              format: "HH:mm",
            }}
            style={{ backgroundColor: token.colorBgBlur }}
            onChange={(data) =>
              setFilterHandle({
                field: "date",
                operator: "gte",
                value: formatDate(data),
              })
            }
          />
        </div>
        <Checkbox
          defaultChecked={false}
          onChange={(data) =>
            setFilterHandle({
              field: "completed",
              operator: "eq",
              value: data.target.checked,
            })
          }
        >
          Completed Task
        </Checkbox>
      </div>
      <div>
        <KanbanBoardContainer>
          <KanbanBoard onDragEnd={handleOnDragEnd}>
            {grouped.map((column) => (
              <KanbanColumn
                key={column.title}
                id={column.title}
                title={column.title}
                count={column.data?.length || 0}
                onAddClick={() => handleAddCard({ stageId: column.title })}
              >
                {tasksLoading && <ProjectCardSkeleton />}
                {!tasksLoading &&
                  column.data?.map((task) => (
                    <KanbanItem
                      key={task.id}
                      id={task.id}
                      data={{ ...task, stageId: column.title }}
                    >
                      <ProjectCardMemo
                        {...task}
                        dueDate={task.date || undefined}
                        reloaded={isReload}
                        setReloaded={setReload}
                      />
                    </KanbanItem>
                  ))}
                {!column.data?.length && (
                  <KabanAddCardButton
                    onClick={() => handleAddCard({ stageId: column.title })}
                  />
                )}
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </KanbanBoardContainer>
        {children}
      </div>
    </div>
  );
};

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => {
        return (
          <KanbanColumnSkeleton key={index}>
            {Array.from({ length: itemCount }).map((_, index) => {
              return <ProjectCardSkeleton key={index} />;
            })}
          </KanbanColumnSkeleton>
        );
      })}
    </KanbanBoardContainer>
  );
};
