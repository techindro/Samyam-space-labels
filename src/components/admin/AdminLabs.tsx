import AdminCrudTable, { FieldDef } from "./AdminCrudTable";

const fields: FieldDef[] = [
  { name: "name", label: "Lab Name", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "focus_area", label: "Focus Area" },
  { name: "lead_researcher", label: "Lead Researcher" },
  { name: "status", label: "Status" },
  { name: "image_url", label: "Image URL" },
];

const AdminLabs = () => (
  <AdminCrudTable
    tableName="research_labs"
    fields={fields}
    displayColumns={["name", "focus_area", "lead_researcher", "status"]}
    title="Research Labs"
  />
);

export default AdminLabs;
