import AdminCrudTable, { FieldDef } from "./AdminCrudTable";

const fields: FieldDef[] = [
  { name: "model_name", label: "Model Name", required: true },
  { name: "provider", label: "Provider" },
  { name: "benchmark", label: "Benchmark" },
  { name: "category", label: "Category" },
  { name: "score", label: "Score", type: "number" },
  { name: "rank", label: "Rank", type: "number" },
];

const AdminFrontierLeaderboard = () => (
  <AdminCrudTable
    tableName="frontier_leaderboards"
    fields={fields}
    displayColumns={["model_name", "provider", "benchmark", "score", "rank"]}
    title="Frontier Leaderboard"
  />
);

export default AdminFrontierLeaderboard;
