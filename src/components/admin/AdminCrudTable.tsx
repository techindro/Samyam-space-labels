import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "boolean" | "array";
  required?: boolean;
}

interface Props {
  tableName: string;
  fields: FieldDef[];
  displayColumns: string[];
  title: string;
}

const AdminCrudTable = ({ tableName, fields, displayColumns, title }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", tableName],
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const resetForm = () => {
    setFormData({});
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (row: any) => {
    setFormData({ ...row });
    setEditingId(row.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const payload: Record<string, any> = {};
      fields.forEach((f) => {
        let val = formData[f.name];
        if (f.type === "array" && typeof val === "string") {
          val = val.split(",").map((s: string) => s.trim()).filter(Boolean);
        }
        if (f.type === "number" && val !== undefined && val !== "") {
          val = Number(val);
        }
        if (f.type === "boolean") {
          val = val === true || val === "true";
        }
        payload[f.name] = val ?? null;
      });

      if (editingId) {
        const { error } = await supabase.from(tableName as any).update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Updated successfully" });
      } else {
        const { error } = await supabase.from(tableName as any).insert(payload);
        if (error) throw error;
        toast({ title: "Created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", tableName] });
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const { error } = await supabase.from(tableName as any).delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin", tableName] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getFieldValue = (f: FieldDef) => {
    const val = formData[f.name];
    if (f.type === "array" && Array.isArray(val)) return val.join(", ");
    if (f.type === "boolean") return val ? "true" : "false";
    return val ?? "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {!showForm && (
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }} className="gap-1">
            <Plus className="h-3.5 w-3.5" /> Add New
          </Button>
        )}
      </div>

      {showForm && (
        <div className="border border-border rounded-xl p-4 mb-6 space-y-3 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <Label className="text-xs mb-1 block">{f.label}</Label>
                {f.type === "textarea" ? (
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                    value={getFieldValue(f)}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                  />
                ) : f.type === "boolean" ? (
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData[f.name] ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value === "true" })}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    value={getFieldValue(f)}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    placeholder={f.type === "array" ? "Comma separated" : ""}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleSave} className="gap-1">
              <Save className="h-3.5 w-3.5" /> {editingId ? "Update" : "Create"}
            </Button>
            <Button size="sm" variant="outline" onClick={resetForm} className="gap-1">
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No records found.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {displayColumns.map((col) => (
                  <TableHead key={col} className="text-xs">{col}</TableHead>
                ))}
                <TableHead className="text-xs w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow key={row.id}>
                  {displayColumns.map((col) => {
                    const val = row[col];
                    const display = Array.isArray(val) ? val.join(", ") : typeof val === "boolean" ? (val ? "Yes" : "No") : String(val ?? "—");
                    return (
                      <TableCell key={col} className="text-xs max-w-[200px] truncate">
                        {display}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(row)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(row.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminCrudTable;
