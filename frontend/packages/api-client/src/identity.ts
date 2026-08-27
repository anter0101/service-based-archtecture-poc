import type {
  AuthResponse,
  LoginRequest,
  PaginateQuery,
  PaginatedResult,
  RegisterRequest,
  User,
} from "@dms/types";

import { apiClient } from "./client";

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/api/identity/auth/login",
    body,
  );
  return data;
}

export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/api/identity/auth/register",
    body,
  );
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/api/identity/users/me");
  return data;
}

export async function listUsers(
  query: PaginateQuery = {},
): Promise<PaginatedResult<User>> {
  const { data, headers } = await apiClient.get<User[]>(
    "/api/identity/users",
    {
      params: {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
      },
    },
  );

  return {
    data,
    totalCount: Number(headers["x-total-count"] ?? data.length),
    currentPage: Number(headers["current-page"] ?? query.page ?? 1),
    hasNextPage: String(headers["has-next-page"] ?? "false") === "true",
  };
}
