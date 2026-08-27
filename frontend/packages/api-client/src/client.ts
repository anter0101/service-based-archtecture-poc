import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

type TokenGetter = () => string | null | undefined | Promise<string | null | undefined>;

let tokenGetter: TokenGetter | null = null;

export function setAccessTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=UTF-8",
  },
  timeout: 60_000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
