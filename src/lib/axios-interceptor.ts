import axios, { AxiosRequestHeaders } from "axios";
import { getCookie, handleLoggingOff, setCookie } from "./helpers";
import { returnHeaders } from "./utils";

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: apiBaseURL,
  timeout: 20000,
  //headers: { ...returnHeaders(getCookie("user_ip")) },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] = 'application/json';
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
      config.headers["x-user-ip"] = `${getCookie("user_ip")}`
      // config.headers = Object.assign(config.headers,{
      //   ...returnHeaders(getCookie("user_ip")),
      //   Authorization : `Bearer ${token}`
      // }) as AxiosRequestHeaders
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async function (error) {
    const originalRequest = error.config;
    // check if error is === 401 or 403 and then retry request for refresh token
    if (
      (error.status === 401 || error.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark the request as retried to avoid loops
      // refresh token logic below
      handleLoggingOff();
      // for now ...since no refresh endpiont is available
      return;
      try {
        const response = await axios.get(`${apiBaseURL}auth/refresh`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            ...returnHeaders(),
          },
        });

        const newAccessToken = response.data?.data?.accessToken;
        setCookie("access_token", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (error: any) {
        // Handle 403 response from refresh token endpoint
        if (error?.response?.status === 403) {
          handleLoggingOff();
        }
        // Throw other errors to stop further processing
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
