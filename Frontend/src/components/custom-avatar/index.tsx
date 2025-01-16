import { Avatar as AntdAvatar, AvatarProps, Flex } from "antd";
type Props = AvatarProps & {
  name?: string;
};

export const CustomAvatar = ({ name, style, ...rest }: Props) => {
  return (
    <AntdAvatar
      alt={"Thanh"}
      size="small"
      style={{
        backgroundColor: "#34495e",
        display: "flex",
        alignItems: "center",
        border: "None",
        ...style,
      }}
      {...rest}
    >
      {name}
    </AntdAvatar>
  );
};
