import AdminCrudTable, { FieldDef } from "./AdminCrudTable";

const fields: FieldDef[] = [
  { name: "title", label: "Title", required: true },
  { name: "abstract", label: "Abstract", type: "textarea" },
  { name: "authors", label: "Authors", type: "array" },
  { name: "published_date", label: "Published Date", type: "date" },
  { name: "pdf_url", label: "PDF URL" },
  { name: "tags", label: "Tags", type: "array" },
];

const AdminPapers = () => (
  <AdminCrudTable
    tableName="research_papers"
    fields={fields}
    displayColumns={["title", "authors", "published_date", "tags"]}
    title="Research Papers"
  />
);

export default AdminPapers;
