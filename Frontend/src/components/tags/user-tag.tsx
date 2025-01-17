import { Space, Tag } from "antd";
import { CustomAvatar } from "../custom-avatar";
import { useId } from "react";

type Props = {
  name: string;
  avatarUrl?: string;
};

export const UserTag = ({ name, avatarUrl }: Props) => {
  const id = useId();
  return (
    <Tag
      key={id}
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
          name={name}
          src={avatarUrl}
          style={{ display: "inline-flex" }}
        />
        {name}
      </Space>
    </Tag>
  );
};
