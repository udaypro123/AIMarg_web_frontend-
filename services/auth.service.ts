import apiClient, { setAccessToken } from "./api";
import type { AuthResponse, ApiResponse, User } from "@/types/api";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  if (data.success && data.data.accessToken) {
    setAccessToken(data.data.accessToken);
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
    setAccessToken(data.data.accessToken);
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

export async function refreshTokenRequest() {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh");
  if (data.success && data.data.accessToken) {
    setAccessToken(data.data.accessToken);
  }
  return data;
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
}

export async function getMe() {
  const { data } = await apiClient.get<{ success: boolean; data: User }>("/users/me");
  return data.data;
}

export async function updateMe(payload: Partial<User>) {
  const { data } = await apiClient.put<ApiResponse<User>>("/users/me", payload);
  return data;
}
