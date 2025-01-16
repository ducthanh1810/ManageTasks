import { Col, Row } from "antd";

import { ProjectContactsTable } from "./contacts-table";
import { CustomerForm } from "./customer-form";
import { ProjectOfCustomerTable } from "./project-of-customer";

export const CustomerEditPage = () => {
  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <CustomerForm />
        </Col>
        <Col xs={24} xl={12}>
          <ProjectOfCustomerTable
            resource="customer/project"
            field="customer.id"
          />
        </Col>
      </Row>
    </div>
  );
};
