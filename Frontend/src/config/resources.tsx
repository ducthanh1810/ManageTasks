import type { IResourceItem } from "@refinedev/core";

import {
  DashboardOutlined,
  ProjectOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "projects",
    list: "/project",
    create: "/project/new",
    edit: "/project/edit/:id",
    meta: {
      label: "Projects",
      icon: <ProjectOutlined />,
    },
  },
  {
    name: "tasks",
    list: "/tasks",
    create: "/tasks/new",
    edit: "/tasks/edit/:id",
    meta: {
      label: "Tasks",
      icon: <FileDoneOutlined />,
    },
  },
];
