import { Typography } from "antd";

import { UserTag } from "../../../../../components/tags";
import { IProject, ITask } from "../../../../../model/types";

type Props = {
  project?: IProject;
};

export const ProjectHeader = ({ project }: Props) => {
  if (project) {
    return <UserTag name={project.title} avatarUrl={project.image} />;
  }

  return <Typography.Link>Assign to project</Typography.Link>;
};
