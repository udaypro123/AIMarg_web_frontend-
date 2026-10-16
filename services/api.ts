import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/api";
import { apiLoading } from "@/services/apiLoading";

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "The request could not be processed. Check your information and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to do that.",
  404: "We could not find what you requested.",
  408: "The request took too long. Please try again.",
  409: "This change conflicts with the current information. Refresh and try again.",
  413: "The file is too large. Choose a smaller file and try again.",
  422: "Some of the information is invalid. Check it and try again.",
  429: "Too many requests. Please wait a moment before trying again.",
  500: "Something went wrong on our end. Please try again shortly.",
  502: "The service is temporarily unavailable. Please try again shortly.",
  503: "The service is temporarily unavailable. Please try again shortly.",
  504: "The service took too long to respond. Please try again shortly.",
};

function getServerErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const response = data as Record<string, unknown>;
  const nestedData = response.data && typeof response.data === "object"
    ? response.data as Record<string, unknown>
    : undefined;
  const candidates = [response.message, response.error, nestedData?.message, nestedData?.error];
  return candidates.find((message): message is string =>
    typeof message === "string"
    && Boolean(message.trim())
    && !/^(request failed with status code \d+|http \d+)$/i.test(message.trim())
    && !/^\d{3}$/.test(message.trim())
    && !/^[A-Z][A-Z0-9_]+$/.test(message.trim())
  )?.trim();
}

export function getRequestErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const serverMessage = getServerErrorMessage(error.response?.data);
    if (serverMessage) return serverMessage;

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "The request took too long. Please try again.";
    }

    if (error.response?.status) {
      return HTTP_ERROR_MESSAGES[error.response.status] || fallback;
    }

    if (error.request) {
      return "Unable to reach the server. Check your connection and try again.";
    }
  }

  return error instanceof Error && error.message.trim() ? error.message : fallback;
}

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
    const isAuthRequest = /\/auth\/(login|register|google|refresh|logout|forgot-password|reset-password)/.test(
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
