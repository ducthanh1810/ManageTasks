import { Space, Typography } from "antd";

import { UserTag } from "../../../../../components/tags";
import { IProfile, ITask } from "../../../../../model/types";
import { useList } from "@refinedev/core";

type Props = {
  users?: IProfile[];
};
export const UsersHeader = ({ users }: Props) => {
  if (users?.length! > 0) {
    return (
      <Space size={[0, 8]} wrap>
        {users!.map((user) => (
          <UserTag key={user.user} name={user.full_name} />
        ))}
      </Space>
    );
  }

  return <Typography.Link>Assign to users</Typography.Link>;
};
