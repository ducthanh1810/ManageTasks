import { Space, Typography } from "antd";

import { UserTag } from "../../../../../components/tags";
import { ITask } from "../../../../../model/types";
import { useList } from "@refinedev/core";

type Props = {
  users?: User[];
};
type User = {
  id: string;
  last_name: string;
};

export const UsersHeader = ({ users }: Props) => {
  if (users?.length! > 0) {
    return (
      <Space size={[0, 8]} wrap>
        {users!.map((user) => (
          <UserTag key={user.id} user={user} />
        ))}
      </Space>
    );
  }

  return <Typography.Link>Assign to users</Typography.Link>;
};
