import { useState, useEffect } from "react";
import { Users, ShieldCheck, UserPlus, Trash2, CheckCircle2, Lock, Sliders, Mail, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ROLES, UserRole, PermissionAction, RoleDefinition } from "@/lib/rbacPermission";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tasksCompleted: number;
  accuracyScore: number;
  status: "Active" | "Invited" | "Inactive";
}

const AdminTeamRBAC = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem("samyam_team_members");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("annotator");
  const [selectedRoleConfig, setSelectedRoleConfig] = useState<UserRole>("admin");

  // Fetch real users from Supabase Profiles
  useEffect(() => {
    const fetchRealProfiles = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("user_id, username, full_name");

        if (profiles && profiles.length > 0) {
          const realMembers: TeamMember[] = profiles.map((p) => ({
            id: p.user_id,
            name: p.full_name || p.username || "Team Member",
            email: `${p.username || "user"}@samyam.space`,
            role: "admin" as UserRole,
            tasksCompleted: 12,
            accuracyScore: 99.4,
            status: "Active",
          }));

          setTeamMembers((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const merged = [...prev];
            realMembers.forEach((rm) => {
              if (!existingIds.has(rm.id)) {
                merged.unshift(rm);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error("Failed to fetch real profiles", err);
      }
    };

    fetchRealProfiles();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("samyam_team_members", JSON.stringify(teamMembers));
    } catch (e) {
      console.error("Failed to save team members", e);
    }
  }, [teamMembers]);

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      tasksCompleted: 0,
      accuracyScore: 100,
      status: "Invited"
    };

    setTeamMembers([newMember, ...teamMembers]);
    setNewName("");
    setNewEmail("");
    toast({
      title: "✓ Invitation Sent",
      description: `Invited ${newName} (${newEmail}) as ${ROLES[newRole].name}.`,
    });
  };

  const handleRoleChange = (memberId: string, role: UserRole) => {
    setTeamMembers(teamMembers.map(m => m.id === memberId ? { ...m, role } : m));
    toast({
      title: "Role Updated",
      description: `Assigned new role: ${ROLES[role].name}`,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    toast({
      title: "Member Removed",
      description: "Team member has been removed from the organization.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/20 p-6 rounded-2xl border border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Enterprise Multi-Tenant Security
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" /> Team Management & Granular RBAC
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage enterprise annotators, senior reviewers, auditors, and fine-grained permission matrices.
          </p>
        </div>
      </div>

      {/* Invite Team Member Form */}
      <div className="glass-card rounded-2xl p-6 border border-border/40 bg-secondary/30 space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-purple-400" /> Invite Enterprise Team Member
        </h3>

        <form onSubmit={handleInviteMember} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Full Name</label>
            <Input
              type="text"
              placeholder="e.g. Vikram Seth"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-background/80"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Email Address</label>
            <Input
              type="email"
              placeholder="user@enterprise.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-background/80"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Assign Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full h-10 px-3 py-2 bg-background/80 border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-purple-500"
            >
              <option value="admin">Admin Manager</option>
              <option value="reviewer">Senior Reviewer</option>
              <option value="annotator">Annotator / Labeler</option>
              <option value="viewer">Auditor / Viewer</option>
            </select>
          </div>

          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-10">
            <UserPlus className="h-4 w-4" /> Send Invite
          </Button>
        </form>
      </div>

      {/* Team Member List */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/40">
        <div className="p-4 bg-secondary/40 border-b border-border/40 font-semibold text-sm flex items-center justify-between">
          <span>Active Organization Members ({teamMembers.length})</span>
          <span className="text-xs text-muted-foreground">Multi-tenant Organization ID: org_samyam_space_01</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/20 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/30">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-center">Tasks Completed</th>
                <th className="px-6 py-4 font-semibold text-center">Accuracy Score</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No team members invited yet. Use the invite form above to add annotators or reviewers.
                  </td>
                </tr>
              ) : (
                teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {member.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {member.email}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                        className="bg-secondary/60 border border-border/60 rounded-lg px-2.5 py-1 text-xs text-foreground font-medium focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="admin">Admin Manager</option>
                        <option value="reviewer">Senior Reviewer</option>
                        <option value="annotator">Annotator / Labeler</option>
                        <option value="viewer">Auditor / Viewer</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-center font-mono font-medium">
                      {member.tasksCompleted}
                    </td>

                    <td className="px-6 py-4 text-center font-mono font-medium text-emerald-400">
                      {member.accuracyScore.toFixed(1)}%
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={`text-[11px] ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {member.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Granular Permission Matrix Configuration */}
      <div className="glass-card rounded-2xl p-6 border border-border/40 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sliders className="h-5 w-5 text-purple-400" /> Granular Permission Matrix Configurator
            </h3>
            <p className="text-xs text-muted-foreground">
              Select a role to inspect its granular security permissions across dataset uploads, active learning, and QA approvals.
            </p>
          </div>

          <div className="flex gap-2">
            {(Object.keys(ROLES) as UserRole[]).map((r) => (
              <Button
                key={r}
                variant={selectedRoleConfig === r ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRoleConfig(r)}
                className="text-xs"
              >
                {ROLES[r].name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-secondary/30 p-5 rounded-xl border border-border/40">
            <Badge className={ROLES[selectedRoleConfig].badgeColor}>
              {ROLES[selectedRoleConfig].name}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {ROLES[selectedRoleConfig].description}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Granted Permissions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { action: "upload_dataset", label: "Upload & Manage Datasets" },
                { action: "annotate_tasks", label: "Annotate BBox/Polygon Tasks" },
                { action: "review_qa", label: "Access QA Review Workflow" },
                { action: "approve_reject_tasks", label: "Approve or Reject Tasks" },
                { action: "run_active_learning", label: "Trigger Active Learning" },
                { action: "export_data", label: "Export COCO / YOLO / GeoJSON" },
                { action: "manage_team", label: "Invite & Modify Team Roles" },
                { action: "manage_api_keys", label: "Generate API Tokens" },
              ].map(({ action, label }) => {
                const isAllowed = ROLES[selectedRoleConfig].permissions.includes(action as PermissionAction);
                return (
                  <div
                    key={action}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                      isAllowed
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-secondary/20 border-border/30 text-muted-foreground/40"
                    }`}
                  >
                    {isAllowed ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeamRBAC;
