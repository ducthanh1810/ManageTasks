import React from "react";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import Header from "./header";
import { AiOutlineAntDesign } from "react-icons/ai";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ThemedLayoutV2
        Header={Header}
        Title={(titleProps) => {
          return (
            <ThemedTitleV2
              {...titleProps}
              wrapperStyles={{
                padding: "5px",
                justifyContent: "center",
                fontSize: 18,
              }}
              icon={<AiOutlineAntDesign style={{ fontSize: 25 }} />}
              text="MENU"
            />
          );
        }}
      >
        {children}
      </ThemedLayoutV2>
    </>
  );
};
