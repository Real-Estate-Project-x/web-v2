
import axios from 'axios';
import { getCookie, handleLoggingOff, setCookie } from './helpers';
import { returnHeaders } from './utils';

const token = "U2FsdGVkX1986piosppPKUNn2q3DByG3yD6QDCy+oaxNpRBfqYVkGRDnfgXGDcz9fKfxKrztyCnu59LfwbFHh9KYW87wI7jMFshIR5pOzWQNXt+esek38oh/XRo+/jFYoTGVO1ESyUBnRz+cXL9P5KkqRGW72EDNqVZGHht8CRbL+Y9D+3mOZMZ7ua2pgPhRwtsts9T0OH6Qfr2x53jwWZIWgwGzhJNVp8sha7EhT4/0r6deEwWgnUaLfMprncAdrH5j+gIRUORQfcF90yflXTuryzmeIspmrINtD1BUNa969g/Bu0q0iL03n9XurXhxqZRjcMmE9M3R/MeCie0AMpGwUS3phgYqx+AxuYKWWWDMNs7DL0LYZoeeBBVYsjnRwZvdLRQXaFaxepJqmYotH5mg81h2WAeErM8aVE+Gcpr0P6RuEzmBlu64Bfz6OI2Qam1/enCSn3FJhJLWJqe4t73S+BbxVPA7An32JIHbPq0v9kqi2OVHq7iim32m7SzXV9lAi+fJoh+LPftdeGn1y623MtR8SeFcMkKtMM211W3D3uGeKONFGwadp854yAApjTMZ6nhqkdUTtbsuiKf/VrxiTP4IFjMz8iKeImuuQsbGQUm/qoQQbu00bVgwWU02+j1d6bE7BHD72msdcAiWZC7JeBN4Oedza1DYHRimPXpN2hna2+0GlAF50d3eurljZRn98+YIFISNxn0K5ogE/vNovPS22OtFFEY38C5EfEK68Iaz+Ux57hJDXFP4NKOo08BS5NNGl5xMsNqzuTNE1v3ZF0c++Ck7ViFbGN7593y0qMDBKVAEs5YEaqvI/DuvndvIAm7yG0wTHJq+uBA0DsLfEDpzutekf72tFRTmE/rkWwG+hPDhqET9kp1E0Rehx19przVZHWs5x8Bo5WjSNMduHJtUNG/m/0LZzzNPFDgfBVZRC6oqF9535Q8BSr4R90xRBpRuFYI63nWGV1IpF5e6LRDryv15g4W3sHfpf7Yepe6MCJ55AOEqKRCZ0eUYucKqs0ryEsiaTlmnw+Zur648qErPZVwlHwZIVxnsQMPuLtfhZ/Pqa89FppTImMPfF6Genagcmdfcc5jc1a4KaxzjyF8nAGxW39rMPsSfvIZtp/tDpDra3wOIsLQIT3JHaOmCQqMO4naUy7JEN5VcrQwG54Ih8MuJdZHyEs/xYwkoA9OJNMJnzkQnYMiiKTYdm4HON0OiPcf37vmVGGx3WV3bQVM/FEHkDtrS6yqiP7Gwc6ZqB4Vg21YF0jhGKWV0E8z2jMpvPcXHRB1QuvHXM2K8iV+57st8pkf7DvhM9HIFoxxNzk+jwTX4PWT4WBujXWpWJtQSnOu7Op4UHHW2Ew8OaQ+JGc3SAG+XUISRLLVQh8kimuI3BmzPQJnjbw0hxBBrimfKcld6xNetuphDOwJ/PsB8onPcKRNHu+WYGAsacPLgnI8F6oMVKItUhT4NV7ZPWWpL1+JnjexvPmi2Big0uE0bHTZn+K42rP0fw7HOKGmlZA7OEJv5BWSLlH85hJ2pvJewx2R4r5pQg6hr89Qu+z6BLu1Ma5jVHMW+mb7k29Mvxhmsha6TsV0LByckLVdtjGKdAvUuJjEiSGtdlaW2WtOkv9ILS/EWvozxn9BXkwiEbpenvkWytn9K5ZFhlx/hcLrfvKT4POmjIx1ojYBw98hPMQ1iGp/6IhXgnwxhP/3wfeSLpnnRAcmSpv+NQ+b/KhwLdOwpn7JlALQ0VT0HQM6ndiLlhOXoIFiz/ontPaL16RphRY6iLKkfb8u8R9hg8gPubOY1l7mygBq8eA=="
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
