export type User = {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

/** Matches identity-service AuthResponse: { accessToken, user } */
export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type PaginateQuery = {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
};

export type PaginatedResult<T> = {
  data: T[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
};

export type ApiErrorBody = {
  statusCode: number;
  timestamp: string;
  path: string;
  error: unknown;
};
