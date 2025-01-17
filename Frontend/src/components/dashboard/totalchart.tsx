import { Badge, Card, List, Skeleton as AntdSkeleton, theme } from "antd";
import { Text } from "../text";
import { CarryOutOutlined, PieChartOutlined } from "@ant-design/icons";
import { Pie, PieConfig } from "@ant-design/plots";

export const TotalChart = ({
  data,
  content,
  typeValue,
}: {
  data: { label: string; value: number }[];
  content: string;
  typeValue?: string;
}) => {
  const config: PieConfig = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "label",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: `{value}${typeValue || ""}`,
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
          fontSize: "1.5rem",
        },
        content: content,
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
