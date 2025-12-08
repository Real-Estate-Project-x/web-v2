
import axios from 'axios';
import { getCookie, handleLoggingOff, setCookie } from './helpers';
import { returnHeaders } from './utils';

const token = "U2FsdGVkX1/MoaqRso1m/DU7Buq60dXRphBjcNtBQSNmGngcCUqR/TGW6LyuL0Gp3Ze68WUvuIJqBGUfuOgEAUldxLTh1ULPU03zIODDybsQ4BSPTAyRtrITVF4abgHgAQ18dTINYOxRFM9Bs8Qr/8bWzAICfp+EJKwKRUhWw8aAwAXbf/nszBxB1Mo3ZGiM/l43O5escfziGGvbESATceEMBMzHH0EVIlL2kFdo7XHhY+S5qcf2vDP9hzZNIbmRyzMr91OtgZg3eem/pEQOFekmhRR3EHEvVJlaP4dK5wBs49V35OykfNYA8c2YVPUdUxOVgZwfA5iVFcP2enmJfFedQuAOPaP64F9QA77ZgIDZAxj8/CSXM8pKbZgf2G5kUGUc3HlZCoLtWvhIoLdVlAuYu24LDG2QPgxNC126ZrKXt1TeGXf9qq/EBYb/l3fgmlkze75oPdMTNcVR62Q77nJ8TDk+Zb30W/btfS/0JhFwh8visn5tnyC/88/zjmTzWKbHYQIZJxP+8JrNujKSpao9TAolyhd7ZYlCmiRiEXIWdgCmPrf/lPwXC5BgMe4sAioNJrwgMwyKrlpLcJ96+phMpz2PZBhNNJvbzQ3hyMzfJZ53v8NsBRD9lB+1YsAKywS/aSS66hIwf0cSbERDyjHUiWfBvwqakiV8iv6lQB8CUkjrGXY3hh8RD+A0130LvzaZx2nvJFLqzi7IYwiiRbsHtIRnwpB5Bk1lKENNM7xaFLxRljieZkxi6YHoZqtgRrFMzKEti7FIhYEexeI5I3T9ESi16ZPYrDe0F6UMfSZxnVe5zdhLrKdX9nHaGe5eiPNm1DTQ36ZBtSzT0IWtYFdCv8UBRs9mS0qQqWx+/QD2VrqlvC3oDgUFtmUp8dnhp33EernOD/B3iG3JleKW5cpgH5fZczpOg9V0zn1D5Ap7JhMdT0tyt2VBqMHYxTZ1GV6sB9ErZIDtegKmy0nimvIN35zEfu2UrJWhTxfqu6GPrGNyf+Qtn5DSGvmIZNNwDY40YBZa3wBbRi+7byPVMrODY9A8pCHgK6GZ6s6OyGl+FdRQrbtHcv+LeffIaaCkoogI/7V9wA8sAiZ3EvuIm9gMiyZR+HBdn7h6TXfb8uw1GLAvw2t4MFZgkmsGnXXX/Ft4txAgUn+mXjaQ6vheIbEGkD35UPFw18xM9i618p+y1ABxp/LJMTRAn5Y8qEdC+QqAx18qa/bax6GrLIUIzDKBSCJps5nGHnPmQm7IM51QQmkEaYyLDwNl86yTmdn+g3GuJgIduSr+YNSHKxWu1j9xIP/l41aOmF3QJkA0KEuWlWS06B+tG5/nKn0Sbke6iQuxPeGSqav2ejl4uexUx9Wcjq9b7FWYA9oh9OQ2IXCfzqRgvLijAN9F+5E/SfWxc6eOxfshjHtFoDJJdkTOmcGS29l7IS7LGLniItxsggUndgNOudIQxMmgOnL6+BxNSYHmVntW5NVC2M20k/sqArpJEfqHC4Zqqqj+gdVL6MdMy45dfLwZ8qTTALve4yJGgK/M5JHl59FC3A3KiZJFn1G1/rnYndlnVjpxRjp4kz6UIiLhrHOLyfZ6XYDaEQWD8WO3BuI7jFQ16pbr/F02EPxgBsQwFOEXqFhztYYSPa08D8cq+89vNaefsEBpK0tIsB+4IoDk7ioGMOi69l5jQw6RFSZbffcALgJYOZvA4g77cqAmqir9TExn7xBo4cgUAty2rTXXA3pCHS5oUvYYIBjHaBFQny8tlbBQGvUCaeZpQlAR2evIMquQuqtKidsu4fYGOBAK1CF4b1h0/L5F2A=="
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
