import { MarkdownField } from "@refinedev/antd";

import { Typography } from "antd";

import { ITask } from "../../../../../model/types";
type Props = {
  description?: ITask["content"];
};

export const DescriptionHeader = ({ description }: Props) => {
  if (description) {
    return (
      <Typography.Paragraph ellipsis={{ rows: 8 }}>
        <MarkdownField value={description} />
      </Typography.Paragraph>
    );
  }

  return <Typography.Link>Add task description</Typography.Link>;
};
