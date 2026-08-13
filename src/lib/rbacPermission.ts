/**
 * Samyam Space Labels — Granular Role-Based Access Control (RBAC) System
 * Defines roles, permission matrices, and permission check helpers for Enterprise Teams.
 */

export type UserRole = "admin" | "reviewer" | "annotator" | "viewer";

export type PermissionAction =
  | "upload_dataset"
  | "annotate_tasks"
  | "review_qa"
  | "approve_reject_tasks"
  | "export_data"
  | "manage_team"
  | "view_analytics"
  | "manage_api_keys"
  | "run_active_learning";

export interface RoleDefinition {
  id: UserRole;
  name: string;
  badgeColor: string;
  description: string;
  permissions: PermissionAction[];
}

export const ROLES: Record<UserRole, RoleDefinition> = {
  admin: {
    id: "admin",
    name: "Admin Manager",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description: "Full administrative access to project management, team RBAC, dataset uploads, model training, and API keys.",
    permissions: [
      "upload_dataset",
      "annotate_tasks",
      "review_qa",
      "approve_reject_tasks",
      "export_data",
      "manage_team",
      "view_analytics",
      "manage_api_keys",
      "run_active_learning"
    ],
  },
  reviewer: {
    id: "reviewer",
    name: "Senior Reviewer",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description: "Reviews completed annotations, approves/rejects tasks, manages QA workflows, and triggers active learning.",
    permissions: [
      "annotate_tasks",
      "review_qa",
      "approve_reject_tasks",
      "export_data",
      "view_analytics",
      "run_active_learning"
    ],
  },
  annotator: {
    id: "annotator",
    name: "Annotator / Labeler",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "Performs bounding box, polygon, and multimodal annotations on assigned dataset tasks.",
    permissions: [
      "annotate_tasks",
      "view_analytics"
    ],
  },
  viewer: {
    id: "viewer",
    name: "Auditor / Viewer",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    description: "Read-only access to view completed datasets, quality reports, and export previews.",
    permissions: [
      "view_analytics",
      "export_data"
    ],
  },
};

export const hasPermission = (role: UserRole, action: PermissionAction): boolean => {
  const roleDef = ROLES[role];
  if (!roleDef) return false;
  return roleDef.permissions.includes(action);
};
