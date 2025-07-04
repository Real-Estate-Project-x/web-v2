
import axios from 'axios';
import { getCookie, handleLoggingOff, setCookie } from './helpers';
import { returnHeaders } from './utils';

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  withCredentials : false,
  baseURL: apiBaseURL,
  timeout: 10000,
  headers : returnHeaders(getCookie('user_ip')),
  
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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

    // Check if the error is a 403 and the request hasn't already been retried
    if (error.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried to avoid loops

      try {
        // Refresh token logic
        const response = await axios.get(`${apiBaseURL}auth/refresh`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`,
          },
        });

        const newAccessToken = response.data?.data?.accessToken;
        setCookie('access_token', newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError : any) {

        console.error('Refresh token failed', refreshError);

        // Handle 403 response from refresh token endpoint
        if (refreshError?.response?.status === 403) {
          handleLoggingOff();
        }

        // Throw other errors to stop further processing
        return Promise.reject(refreshError);
      }
    }

    // Reject the original error if it's not a 403 or if the retry failed
    return Promise.reject(error);
  }
);



