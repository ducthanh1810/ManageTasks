import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider } from "./providers";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./providers/authProvider";
import { Layout } from "./components";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  Login,
  Register,
  ForgotPassword,
  Home,
  ListTasksPage,
  TasksCreatePage,
  TasksEditPage,
} from "./pages/index";
import { resources } from "./config/resources";
import {
  CustomerCreatePage,
  ProjectCreatePage,
  ProjectsPage,
} from "./pages/project";
import { CustomerEditPage, ProjectEditPage } from "./pages/project/edit";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "zKtWBL-y1bYvY-N8TIR6",
              }}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="/project">
                    <Route index element={<ProjectsPage />} />
                    <Route path="new" element={<ProjectCreatePage />} />
                    <Route
                      path="customer/new"
                      element={<CustomerCreatePage />}
                    />
                    <Route
                      path="customer/edit"
                      element={<CustomerEditPage />}
                    />
                    <Route path="edit/:id" element={<ProjectEditPage />} />
                  </Route>
                  <Route path="/customer">
                    <Route path="new" element={<CustomerCreatePage />} />
                    <Route path="edit" element={<CustomerEditPage />} />
                  </Route>
                  <Route
                    path="/tasks"
                    element={
                      <ListTasksPage>
                        <Outlet />
                      </ListTasksPage>
                    }
                  >
                    <Route path="new" element={<TasksCreatePage />} />
                    <Route path="edit/:id" element={<TasksEditPage />} />
                  </Route>
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler
                handler={(options) =>
                  options.autoGeneratedTitle
                    .replace("| refine", "")
                    .replace("refine", "")
                }
              />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
