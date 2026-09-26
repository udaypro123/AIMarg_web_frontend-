import apiClient from "./api";
import type { AdminStats, RecentActivity, User, UserComment, UserInteractionSummary } from "@/types/api";

export async function getAdminDashboardStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<{ data: AdminStats }>("/admin/stats");
  return data.data;
}

export async function getRecentAdminActivity(): Promise<RecentActivity[]> {
  const { data } = await apiClient.get<{ data: RecentActivity[] }>("/admin/recent-activity");
  return data.data;
}

export async function getAdminUsers(): Promise<User[]> {
  const { data } = await apiClient.get<{ data: User[] }>("/admin/users");
  return data.data;
}

export async function getAdminUser(userId: string): Promise<User> {
  const { data } = await apiClient.get<{ data: User }>(`/admin/users/${encodeURIComponent(userId)}`);
  return data.data;
}

export async function setAdminUserBlocked(userId: string, isBlocked: boolean): Promise<Pick<User, "_id" | "isBlocked">> {
  const { data } = await apiClient.put<{ data: Pick<User, "_id" | "isBlocked"> }>(
    `/admin/users/${encodeURIComponent(userId)}/block`,
    { isBlocked }
  );
  return data.data;
}

export async function getUserInteractionSummaries(): Promise<UserInteractionSummary[]> {
  const { data } = await apiClient.get<{ data: UserInteractionSummary[] }>("/user-likes/summary");
  return data.data;
}

export async function toggleAdminUserLike(userId: string): Promise<{ liked: boolean }> {
  const { data } = await apiClient.post<{ data: { liked: boolean } }>(`/user-likes/${encodeURIComponent(userId)}`);
  return data.data;
}

export async function getAdminUserComments(userId: string): Promise<UserComment[]> {
  const { data } = await apiClient.get<{ data: UserComment[] }>(`/user-comments/${encodeURIComponent(userId)}`);
  return data.data;
}

export async function addAdminUserComment(userId: string, content: string): Promise<UserComment> {
  const { data } = await apiClient.post<{ data: UserComment }>("/user-comments", { targetUserId: userId, content });
  return data.data;
}
