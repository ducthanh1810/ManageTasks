import { Space, Typography } from "antd";

import { UserTag } from "../../../../../components/tags";
import { IProject, ITask } from "../../../../../model/types";
import { useList } from "@refinedev/core";

type Props = {
  project?: IProject;
};

export const ProjectHeader = ({ project }: Props) => {
  if (project) {
    return <UserTag name={project.title} avatarUrl={project.image} />;
  }

  return <Typography.Link>Assign to project</Typography.Link>;
};
