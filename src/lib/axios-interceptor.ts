
import axios from 'axios';
import { getCookie, handleLoggingOff, setCookie } from './helpers';
import { returnHeaders } from './utils';


const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  withCredentials : false,
  baseURL : apiBaseURL,
  timeout : 10000,
  headers : {...returnHeaders(getCookie('user_ip'))}
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('bearer_token');
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
    // check if error is === 401 or 403 and then retry request for refresh token
    if((error.status === 401 || error.status === 403) && !originalRequest._retry){
      originalRequest._retry = true; // Mark the request as retried to avoid loops
      // refresh token logic below
      try{
        const response = await axios.get(`${apiBaseURL}auth/refresh`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${getCookie('bearer_token')}`,
            ...returnHeaders()
          },
        });

        const newAccessToken = response.data?.data?.accessToken;
        setCookie('access_token', newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      }catch(error : any) {
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
