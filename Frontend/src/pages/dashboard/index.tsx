import { useApiUrl, useCustom } from "@refinedev/core";
import { HistoryAbsent, TotalChart, UpcomingEvents } from "../../components";
import { Col, Row } from "antd";
import { ITotal } from "../../model/types";
import api from "../../api";
import React, { useState, useEffect } from "react";
import { DashboardTotalCountCard } from "../../components/dashboard/total-count-card";
import { useDocumentTitle } from "@refinedev/react-router-v6";

export const Home = () => {
  const [isLoading, setLoading] = useState(true);
  const [total, setTotal] = useState<ITotal>();

  useEffect(() => {
    getTotal();
  }, []);

  const getTotal = async () => {
    try {
      const response = await api.get("/api/total/");
      setTotal(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Row gutter={[20, 10]} style={{ marginTop: "-5px" }}>
        <Col xs={24} sm={24} xl={16}>
          <DashboardTotalCountCard
            resource="events"
            isLoading={isLoading}
            totalCount={total?.event_count}
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
          <UpcomingEvents reLoadTotal={getTotal} />
        </Col>
        <Col xs={24} sm={24} xl={8} style={{ height: "360px" }}>
          <TotalChart />
        </Col>
      </Row>
      <Row gutter={[32, 32]} style={{ marginTop: "10px" }}>
        <Col xs={24} sm={24} xl={30} style={{ height: "100%" }}>
          <HistoryAbsent />
        </Col>
      </Row>
    </div>
  );
};
