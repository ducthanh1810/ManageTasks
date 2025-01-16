import { Badge, Card, List, Skeleton as AntdSkeleton, theme } from "antd";
import { Text } from "../text";
import React, { useState } from "react";
import { CarryOutOutlined, PieChartOutlined } from "@ant-design/icons";
import { Pie, PieConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { ITask } from "../../model/types";
import dayjs from "dayjs";

export const TotalChart = () => {
  const { data: tasks, isLoading: LoadingTasks } = useList<ITask>({
    resource: "tasks",
  });
  const data = [
    {
      type: "unfinished",
      value: tasks?.data.filter((task) => task.type != "Done").length || 0,
    },
    {
      type: "finished",
      value: tasks?.data.filter((task) => task.type == "Done").length || 0,
    },
  ];
  const config: PieConfig = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "auto",
        },
        content: `${data[1].value}/${data[1].value + data[0].value}`,
      },
    },
  };
  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "0 3rem", marginTop: "-3rem" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <PieChartOutlined />
          <Text>Tasks</Text>
        </div>
      }
    >
      <Pie {...config} />
    </Card>
  );
};
