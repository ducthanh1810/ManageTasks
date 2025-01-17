export type IAbsent = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  date: Date;
  title: string;
  type: string;
};

export type IUser = {
  email: string;
  id: string;
  last_name: string;
  username: string;
};

export type IProfile = {
  user: string;
  full_name: string;
  position: string;
  email: string;
  image: string;
  stage: string;
};

export type IEvent = {
  id: string;
  title: string;
  content: string;
  type: string;
  date: Date;
};

export type ITotal = {
  event_count: string;
  absent_count: string;
  task_count: string;
};

export type ITask = {
  id: string;
  title: string;
  content: string;
  type: string;
  link: string;
  link_image: string;
  date: string;
  users: IProfile[];
  completed: boolean;
  project_set: IProject[];
};

export type IProject = {
  id: string;
  title: string;
  description: string;
  customer: string;
  expiration_date: string;
  completed: boolean;
  image: string;
  created_at: string;
  collaborative: IProfile[];
  author: string;
};

export type ICustomer = {
  id: string;
  name: string;
  email: string;
  phone: number;
  address: string;
};

export type ITaskUser = {
  list_user: {
    id: string;
    name: string;
  };
};

export type ITasksStages = {
  title: string;
  data?: ITask[];
};

export type ProjectTasksTotal = {
  total: number;
  total_working: number;
  tasks: { label: string; value: number }[];
};

export const stages = ["Unassigned", "TODO", "Progress", "Review", "Done"];

export type FilterTask = "date" | "type" | "completed" | "project";

export type ContactStatus =
  | "CHURNED"
  | "CONTACTED"
  | "INTERESTED"
  | "LOST"
  | "NEGOTIATION"
  | "NEW"
  | "QUALIFIED"
  | "UNQUALIFIED"
  | "WON";
