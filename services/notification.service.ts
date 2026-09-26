import apiClient from "./api";
import type { AppNotification } from "@/types/api";

export async function getNotifications(): Promise<AppNotification[]> {
  const { data } = await apiClient.get<{ data: AppNotification[] }>("/notifications");
  return data.data;
}

export async function markNotificationRead(id: string): Promise<AppNotification> {
  const { data } = await apiClient.patch<{ data: AppNotification }>(`/notifications/${id}/read`);
  return data.data;
}
