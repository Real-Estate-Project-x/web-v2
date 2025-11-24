
import axios from 'axios';
import { getCookie, handleLoggingOff, setCookie } from './helpers';
import { returnHeaders } from './utils';

const token = "U2FsdGVkX1+45XXh8sWhExxZN6yVP5GjfSoPXGAl2dKRkaX6HKUCuSPy+lFkOaMuA7HSA9X7RXf2FEkCx5BuK4Dyj/r/aqW+hwN9fXD+t4hLWcEfNv/dIhjKwGdXQOi8fpHLZjhDZ9X7h6GwzhrBBqjTjKrx2eGFsVX87oZwNdaqD/FZmbOg4DiUCGZ4g1JHS581L22b2UZzVSFYvwFF7HMWqw9AZ597xzHr2OTCoSboAAr09fDKCCZzWtKrplfGYdMczCmAZpX50yacvYx+T5OiNpODUJw4unhhqkEsLP950NRlJ9TgUzt14+Pbei/uDAE4pJors2Fe/IlkVvbPwRZQjYxtEghzMcXhdcFvBWRTme4x32D9cE47clePA9oH4ODqd9tgThOhce9dBY9KoC4WVCMXLJrV9zRAX8Cxu34my/a3lg2qGowC7fgF1fGAYbgiqtZdlpcupYLofgn7kft0Sr+iTQFEpJBr7Nxy8jZ0OL0hEPDdhwxnDK37+8IGv/KAMu/EotFaOnPE/AHIe9BmbOigf2whmgyue8UVdKv/5uy1TPe9o6xE3Vbs2ayHZwXBS5Zrk11m68bOltYG298Gm8ql0uG28k0xKjhdcsaXByhDN2evA7Ka7CzsnlzTlgacSwSOQLK/951J9n29RWcWyJMiG1wA5HrJLGAa7UjQ1A3y4czVgG4Gb272lXDbLz3k2jHIM72O4cjtTKFPNdPEQln/UfFB6D500ZV3QGhbsQYzV1LKfjLtelqR0kXn/jLf9AilTJGOX7S1YMz+KAIn3a9fGkxpOw6j7xTmvSVFPnfPVkLVZLtTfrrkwJL9v+snh2YF3s8KgpyA5qCDwnnf0/zj6vNoYh6rjM2Zlw2K74GIOd/+C6yss/9Y/hDVMiJK+z9yOY5PMaJl84a9U9jpTsJkstTQRxxbPfUIUQPcIRbAJZhizUCBxS5B2aYdMJUCnHNQ4iAlIwHcvhLTAMy+Y2c3so6+iD0iqT/bpRPyYcYoLUM/SJI94fZQwGArOIZaKZA3OqCnUfPrc9Tr8OPPFKtt9u8IikhgxF73vDltGcDyWB9ujjcUqMESNvGb4iF981jZEFRtCOE2qDRCdZlldNNyy4+sovhx0UDdi/26D49Kdjii9gu6vNwzj9oNmAsS9OdjXtmvjZJYCMFnjDqQnefy/11gPDRk/zpwuyZ8txCd2UXADrNn6o40IV+DBiwvZl2VcHkLd/zTzXTH9QzgsKCx2aVU0FipELwhs06aIqzZcN5rI+jwKSwia92KgpuuEDQPgM0EtgXbrqbWP0Uae862KDcRG44BYiwtPLQP2j4K6iwfk+T4As7pQ83mVnygbW8ii8miwi4gHqhkLLIln5sGNkxamIravwujFnHmOabD7kHangNSohx+hYSl1nWEvM5XecS0HsU94lE+T83MwsGHyezNSSzh2pSKkXINrTXdVISt0H7KAKFvOJpNFJvO6N14lSA1D95qVg6/sYj1yTgdbQSJkffhdod4J80naGAb8W+1iXqQMc6Yth1NrLfZOgw38puuO8Kk6rnMK5uMOvbYCOEVwNwYl6qDXda+GNOAJzmE46G9lC6Trg+XnjQWqu7bysbQsyyZpIaVIKSSCi1MpaXJ0kxYBC5NlIpHuj1gxojxjr0Fz7oyjhq439Fca9MSlWJgs2dxr7vooIXH5dC4+woIZFUVmU00nDUEp/P+5pUAgKK8F0CarLIbS4anYb3AHMttSRslKwmZUZqW43JeBiDIBYtKKiJJt1TPhJ9opOGivKVDdeZ9qI1RP4xebdD+lJKOKDV5huCkPg=="
const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  withCredentials : false,
  baseURL : apiBaseURL,
  timeout : 10000,
  headers : {...returnHeaders(getCookie('user_ip'))}
});

axiosInstance.interceptors.request.use(
  (config) => {
    //const token = getCookie('bearer_token');
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
