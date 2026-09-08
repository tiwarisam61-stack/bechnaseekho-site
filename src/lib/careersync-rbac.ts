import type { Role } from "@/hooks/use-role";

export type NonNullableRole = Exclude<Role, null>;

const POST_JOB_ROLES: NonNullableRole[] = ["company", "admin"];
const REVIEW_LEAVE_ROLES: NonNullableRole[] = ["company", "admin"];
const REVIEW_BLOG_ROLES: NonNullableRole[] = ["admin"];

export function getRoleLabel(role: Role): string {
  if (role === "company") return "HR";
  if (role === "admin") return "Admin";
  if (role === "employee") return "Employee";
  if (role === "candidate") return "Candidate";
  return "Unknown";
}

export function canPostJobs(role: Role): boolean {
  return role ? POST_JOB_ROLES.includes(role) : false;
}

export function canReviewLeave(role: Role): boolean {
  return role ? REVIEW_LEAVE_ROLES.includes(role) : false;
}

export function canReviewBlogs(role: Role): boolean {
  return role ? REVIEW_BLOG_ROLES.includes(role) : false;
}

export function canAccessEnterpriseWorkspace(role: Role): boolean {
  return role !== null;
}
