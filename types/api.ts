export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  country?: string;
  profession?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}