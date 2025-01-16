import { Space, Tag } from "antd";
import { CustomAvatar } from "../custom-avatar";

type Props = {
  user: User;
};

type User = {
  id: string;
  last_name: string;
};

export const UserTag = ({ user }: Props) => {
  return (
    <Tag
      key={user.id}
      style={{
        padding: 2,
        paddingRight: 8,
        borderRadius: 24,
        lineHeight: "unset",
        marginRight: "unset",
      }}
    >
      <Space size={4}>
        <CustomAvatar
          name={user.last_name}
          style={{ display: "inline-flex" }}
        />
        {user.last_name}
      </Space>
    </Tag>
  );
};
