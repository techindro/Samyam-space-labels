import AdminCrudTable, { FieldDef } from "./AdminCrudTable";

const fields: FieldDef[] = [
  { name: "model_name", label: "Model Name", required: true },
  { name: "provider", label: "Provider" },
  { name: "category", label: "Category" },
  { name: "elo_score", label: "ELO Score", type: "number" },
  { name: "wins", label: "Wins", type: "number" },
  { name: "losses", label: "Losses", type: "number" },
  { name: "total_comparisons", label: "Total Comparisons", type: "number" },
];

const AdminPreferenceLeaderboard = () => (
  <AdminCrudTable
    tableName="preference_leaderboards"
    fields={fields}
    displayColumns={["model_name", "provider", "elo_score", "wins", "losses"]}
    title="Preference Leaderboard"
  />
);

export default AdminPreferenceLeaderboard;
