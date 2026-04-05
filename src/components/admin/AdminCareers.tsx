import AdminCrudTable, { FieldDef } from "./AdminCrudTable";

const fields: FieldDef[] = [
  { name: "title", label: "Job Title", required: true },
  { name: "department", label: "Department" },
  { name: "location", label: "Location" },
  { name: "type", label: "Type" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "requirements", label: "Requirements", type: "array" },
  { name: "apply_url", label: "Apply URL" },
  { name: "is_active", label: "Active", type: "boolean" },
];

const AdminCareers = () => (
  <AdminCrudTable
    tableName="research_careers"
    fields={fields}
    displayColumns={["title", "department", "location", "type", "is_active"]}
    title="Research Careers"
  />
);

export default AdminCareers;
