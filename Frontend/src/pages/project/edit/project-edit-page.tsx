import { Col, Row } from "antd";

import { ProjectContactsTable } from "./contacts-table";
import { ProjectForm } from "./form";

export const ProjectEditPage = () => {
  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <ProjectForm />
        </Col>
        <Col xs={24} xl={12}>
          <ProjectContactsTable
            resource="project/contacts"
            field="project.id"
          />
        </Col>
      </Row>
    </div>
  );
};
