import apiClient from "./api";
import type { AuthResponse, ApiResponse, User } from "@/types/api";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  if (data.success && data.data.accessToken) {
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
  }
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  country?: string;
  profession?: string;
}) {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  if (data.success && data.data.accessToken) {
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
  }
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await apiClient.post<ApiResponse>("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token: string, password: string) {
  const { data } = await apiClient.post<ApiResponse>("/auth/reset-password", { token, password });
  return data;
}

export async function verifyEmail(token: string) {
  const { data } = await apiClient.post<ApiResponse>("/auth/verify-email", { token });
  return data;
}

export async function refreshTokenRequest(refreshToken: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });
  if (data.success && data.data.accessToken) {
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
  }
  return data;
}

export async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  await apiClient.post("/auth/logout", { refreshToken });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function getMe() {
  const { data } = await apiClient.get<{ success: boolean; data: User }>("/users/me");
  return data.data;
}

export async function updateMe(payload: Partial<User>) {
  const { data } = await apiClient.put<ApiResponse<User>>("/users/me", payload);
  return data;
}
