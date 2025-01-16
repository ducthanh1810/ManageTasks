import { AuthPage } from "../../components/";
import { AiFillSmile } from "react-icons/ai";
import { Typography } from "antd";
import { useDocumentTitle } from "@refinedev/react-router-v6";
const { Title } = Typography;

const authCredentials = {
  email: "t",
  password: "t",
};
export const Login = () => {
  useDocumentTitle("Login");
  return (
    <AuthPage
      type="login"
      rememberMe
      forgotPasswordLink
      formProps={{
        initialValues: authCredentials,
      }}
      title={
        <Title level={1}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#ecf0f1",
            }}
          >
            <AiFillSmile
              style={{ marginTop: 5, marginRight: 5, color: "#fd79a8" }}
            />
            Hi! Have a nice day!
          </div>
        </Title>
      }
    />
  );
};
