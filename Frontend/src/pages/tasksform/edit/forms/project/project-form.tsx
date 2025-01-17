import { SelectOptionWithAvatar } from "@/components";
import { IProject } from "@/model/types";
import { useSelect } from "@refinedev/antd";
import { useUpdate } from "@refinedev/core";

import { Select } from "antd";

type Props = {
  taskId?: string;
  initialValues?: { label: string; value: string };
  cancelForm: () => void;
};

export const ProjectForm = ({ taskId, initialValues, cancelForm }: Props) => {
  const { mutate } = useUpdate();

  const { selectProps, queryResult: queryResultUsers } = useSelect<IProject>({
    resource: "projects",
    optionLabel: "title",
    pagination: {
      mode: "off",
    },
  });

  const handleChange = (value: any) => {
    mutate({
      resource: "tasks/update",
      id: taskId!,
      values: { project: value },
      successNotification: false,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <Select
        {...selectProps}
        labelInValue
        defaultValue={initialValues}
        className="selectNames"
        dropdownStyle={{ padding: "0px" }}
        style={{ width: "100%" }}
        options={
          queryResultUsers.data?.data?.map(({ id, title, image }) => ({
            value: id,
            label: <SelectOptionWithAvatar name={title} avatarUrl={image} />,
          })) ?? []
        }
        onChange={(value) => handleChange(value.value)}
      />
    </div>
  );
};
