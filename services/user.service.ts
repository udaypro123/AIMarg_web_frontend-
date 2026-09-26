import apiClient from "./api";
import type { User } from "@/types/api";

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<{ data: User }>("/users/me");
  return data.data;
}

export async function updateProfile(profile: Partial<User>): Promise<User> {
  const { data } = await apiClient.patch<{ data: User }>("/users/me", profile);
  return data.data;
}

export async function uploadResume(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await apiClient.post<{ data: { resume: string } }>("/users/me/resume", formData);
  return data.data.resume;
}

export async function downloadResume(): Promise<Blob> {
  const { data } = await apiClient.get<Blob>("/users/me/resume", { responseType: "blob" });
  return data;
}
