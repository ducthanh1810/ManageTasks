import { useApiUrl, useCustom, useList, useOne } from "@refinedev/core";
import { HistoryAbsent, TotalChart, UpcomingEvents } from "../../components";
import { Col, Row } from "antd";
import { ITask, ITotal } from "../../model/types";
import api from "../../api";
import React, { useState, useEffect } from "react";
import { DashboardTotalCountCard } from "../../components/dashboard/total-count-card";
import { useDocumentTitle } from "@refinedev/react-router-v6";

export const Home = () => {
  const [total, setTotal] = useState<ITotal>();

  const {
    data: totalData,
    isLoading,
    refetch,
  } = useOne<ITotal>({
    resource: "total",
    id: -1,
  });

  const { data: tasks, isLoading: LoadingTasks } = useList<ITask>({
    resource: "tasks",
  });

  const dataChart = [
    {
      label: "unfinished",
      value: tasks?.data.filter((task) => task.type != "Done").length || 0,
    },
    {
      label: "finished",
      value: tasks?.data.filter((task) => task.type == "Done").length || 0,
    },
  ];

  useEffect(() => {
    setTotal(totalData?.data);
  }, [totalData?.data]);

  return (
    <div className="page-container">
      <Row gutter={[20, 10]} style={{ marginTop: "-5px" }}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="events"
            isLoading={isLoading}
            totalCount={total?.event_count}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="absents"
            isLoading={isLoading}
            totalCount={total?.absent_count}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="tasks"
            isLoading={isLoading}
            totalCount={total?.task_count}
          />
        </Col>
      </Row>
      <Row gutter={[20, 10]} style={{ marginTop: "10px" }}>
        <Col xs={24} sm={24} xl={16} style={{ height: "360px" }}>
          <UpcomingEvents reLoadTotal={refetch} />
        </Col>
        <Col xs={24} sm={24} xl={8} style={{ height: "360px" }}>
          <TotalChart
            data={dataChart}
            content={`${dataChart[1].value}/${
              dataChart[1].value + dataChart[0].value
            }`}
          />
        </Col>
      </Row>
      <Row gutter={[32, 32]} style={{ marginTop: "10px" }}>
        <Col xs={24} sm={24} xl={30} style={{ height: "100%" }}>
          <HistoryAbsent reLoadTotal={refetch} />
        </Col>
      </Row>
    </div>
  );
};
