import { CustomerEditModal } from "../edit/customer-form";
import { ProjectsPage } from "../list";
import { CustomerCreateModal } from "../list/create-customer-modal";
import { ProjectCreateModal } from "../list/create-modal";

export const CustomerCreatePage = () => {
  return (
    <ProjectsPage>
      <CustomerCreateModal />
    </ProjectsPage>
  );
};
