import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/api";
import { apiLoading } from "@/services/apiLoading";

let accessToken: string | null = null;
let refreshRequest: Promise<string> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

function refreshAccessToken(): Promise<string> {
  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${API_BASE_URL}/auth/refresh`, {}, {
        withCredentials: true,
        headers: { "X-Auth-Mode": "cookie" },
      })
      .then(({ data }) => {
        setAccessToken(data.data.accessToken);
        return data.data.accessToken as string;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type TrackedRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean; _loaderTracked?: boolean };

apiClient.interceptors.request.use(
  (config) => {
    config.headers.set("X-Auth-Mode", "cookie");
    if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`);
    const trackedConfig = config as TrackedRequestConfig;
    if (!trackedConfig._loaderTracked) {
      trackedConfig._loaderTracked = true;
      apiLoading.start();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const config = response.config as TrackedRequestConfig;
    if (config._loaderTracked) apiLoading.finish();
    return response;
  },
  async (error) => {
    const originalRequest = error.config as TrackedRequestConfig | undefined;
    const isAuthRequest = /\/auth\/(login|register|refresh|logout|forgot-password|reset-password)/.test(
      originalRequest?.url ?? ""
    );
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        return apiClient(originalRequest);
      } catch {
        setAccessToken(null);
        if (originalRequest._loaderTracked) apiLoading.finish();
        return Promise.reject(error);
      }
    }
    if (originalRequest?._loaderTracked) apiLoading.finish();
    return Promise.reject(error);
  }
);

export default apiClient;
