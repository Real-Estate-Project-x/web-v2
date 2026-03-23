import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getUserIp } from "./utils";
import { getCookie, onLogOff, onRegionNotSupported } from "./helpers";

interface ApiErrorResponse {
  name: string;
  message: string;
  success: boolean;
  code: number;
  time: string;
  url: string;
}

enum ERROR_CODES {
  TOKEN_HAS_EXPIRED = "forbidden_expired_token",
  REGION_NOT_SUPPORTED = "region_not_currently_supported",
}

// Extend AxiosRequestConfig to track retry state
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiBaseURL = String(process.env.NEXT_PUBLIC_API_URL);

export const axiosInstance = axios.create({
  timeout: 20000,
  baseURL: apiBaseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Queue of requests waiting for a token refresh ──────────────────────────
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token as string);
  });
  refreshQueue = [];
}

// ── Request interceptor — attach Bearer token ──────────────────────────────
axiosInstance.interceptors.request.use(
  async (
    req: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const token = getCookie("access_token");
    if (token && req.headers) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    // Fetch and attach user IP
    try {
      const ipAddress = await getUserIp();
      req.headers["x-user-ip"] = ipAddress;
    } catch {
      // Fail silently — don't block the request if IP fetch fails
    }

    return req;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response interceptor — handle errors ───────────────────────────────────
axiosInstance.interceptors.response.use(
  // ✅ Pass successful responses straight through
  (response: AxiosResponse) => response,

  // ❌ Handle errors
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig;
    const errorMessage = error.response?.data?.message;
    const status = error.response?.status;

    // ── 1. Region not supported ──────────────────────────────────────────
    if (errorMessage === ERROR_CODES.REGION_NOT_SUPPORTED) {
      onRegionNotSupported();
      return Promise.reject(error);
    }

    // ── 2. Token expired — attempt refresh (once) ────────────────────────
    const isExpiredError =
      status === 401 || errorMessage === ERROR_CODES.TOKEN_HAS_EXPIRED;

    if (isExpiredError && !originalRequest._retry) {
      // If a refresh is already in-flight, queue this request
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      // Mark as retried so we don't loop infinitely
      originalRequest._retry = true;
      isRefreshing = true;

      //====> Refresh_token login <==== //

      // try {
      //   const refreshToken = tokenStore.getRefreshToken();

      //   if (!refreshToken) {
      //     throw new Error("No refresh token available");
      //   }

      //   const { data } = await instance.post<RefreshTokenResponse>(
      //     refreshTokenEndpoint,
      //     { refreshToken },
      //     // Skip the interceptor for this internal call to avoid loops
      //     { _retry: true } as AxiosRequestConfig
      //   );

      //   const { accessToken, refreshToken: newRefreshToken } = data;

      //   // Persist new tokens
      //   tokenStore.setAccessToken(accessToken);
      //   if (newRefreshToken) {
      //     tokenStore.setRefreshToken(newRefreshToken);
      //   }

      //   // Unblock queued requests with the fresh token
      //   processQueue(null, accessToken);

      //   // Retry the original request
      //   if (originalRequest.headers) {
      //     originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      //   }
      //   return instance(originalRequest);
      // } catch (refreshError) {
      //   // Refresh failed — clear tokens, unblock queue with error, redirect
      //   processQueue(refreshError, null);
      //   return Promise.reject(refreshError);
      // } finally {
      //   isRefreshing = false;
      // }
    }

    // ── 3. Explicit "token_has_expired" after retry already attempted ─────
    if (errorMessage !== ERROR_CODES.TOKEN_HAS_EXPIRED) {
      onLogOff(true);
    }

    return Promise.reject(error);
  }
);
