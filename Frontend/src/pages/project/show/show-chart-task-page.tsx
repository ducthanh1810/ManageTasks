import { TotalChart } from "@/components";
import { ProjectsPage } from "../list";
import { useGo, useList, useOne } from "@refinedev/core";
import { ProjectTasksTotal } from "@/model/types";
import { useLocation } from "react-router";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export const ChartTaskPage = () => {
  const go = useGo();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const id = Number(query.get("id")) || 0;

  const [dataChart, setDataChart] = useState<
    { label: string; value: number }[]
  >([]);

  const { data, isLoading, isError } = useOne<ProjectTasksTotal>({
    resource: "project/tasks",
    id: id,
  });

  useEffect(() => {
    const dataChart: { label: string; value: number }[] = [];
    data?.data &&
      data?.data.tasks.map((task) => {
        dataChart.push({
          label: task.label,
          value: Math.round((task.value / data?.data.total_working) * 100),
        });
      });
    data?.data && setDataChart(dataChart);
  }, [data?.data]);

  const goToListPage = () => {
    go({
      to: { resource: "projects", action: "list" },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  return (
    <ProjectsPage>
      <Modal
        open={true}
        onCancel={goToListPage}
        onOk={goToListPage}
        style={{ padding: "20px" }}
      >
        <TotalChart
          data={dataChart || []}
          typeValue="%"
          content={`Tasks: ${data?.data.total}`}
        />
      </Modal>
    </ProjectsPage>
  );
};
