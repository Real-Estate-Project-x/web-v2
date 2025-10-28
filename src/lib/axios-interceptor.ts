
import axios from 'axios';
import { getCookie, handleLoggingOff, setCookie } from './helpers';
import { returnHeaders } from './utils';

const token = "U2FsdGVkX1/7nqfTLSBRE+UO/pKUBqzZzNrSHvoSplJFqM48KiMQ4SW0V4ODs449FqsSndiUOCKXCsAkIv3FhMVynNopC9yrY/8MpFHuH/+SJ5ZmGPE/KwkQzhYcWlhDVirzP6UmA/f3KX74SfbN+3TchiWQtJxsTzl7Ozwx5gI0LUgp0KBjyngwG1ZDZp9C/XTsNDYy7kcrTIRG/KXhQHIo+QOXjGPeilneoqVO6/tjvaipa+FU8w6kTVze7salGuj/9xaXgbVE7UcvmOa1chwHmXpuPWt6VNT8eVVonPaZ2mMWODY0dYi9NQBIbR/6ZoaAOMHU3EH7GPm4YkeOiphf188KFo1OLYSjlSrLsbR4twj+8guxk8RklLQ9OqVc1lpDA7r3ToZnTQoVa9ufZP+TM/6Thw8pScN+3EnFtLX32gRD+hUla7/uP0wfZz2+zrolANtRscVcszpc1WHH6AFtQ9ctFby7U4zAQYzarWcHI5ISyqs5qsh26FQH8cjODKRjUPTrsE1veFlJ57ymP9qVKTJzJK1Xsx4ZSn9loprtMr1Uregb2FvI7gE9S3wJl6WnbpFODM/bKGyxiTSRd4ysG88jFy0T+KOQGbQ1L4hcWrQBzS1wIKYjMs/GDhRn63xl/CgFWu4d7q39EBB5PbHv4Iw2XaOareIzKmFs6kthqTPreOF2ZYAldtdJM4mZH/yb8pcoskWk9bpMHm+8nGaCrw83tu8d5VayN3+vcPyyNkmryT85dTuJkfG7adkXmp6PlWcZY6mnXSST+9tqPxryGczvhsEwSinJ6PNAOxT4I9L0a1cNwLfHOjjkrUI/FpE2wpbptNSXaXwEeuLxaYP148RRV1nC4RX0w+4gZzmftWO5KaZZi2tV1ppNp4BK1Qe50lEsHZ/TmXXNgdzskD+KhTp/MYNMGXncY+gpNrCqMU9X0xITYmu4g9e7KIg4Z/IAX43yN6rIFeLK7x6C+jkxKAj355HpxCs0ErlsZGOA49bDit06ziniZvBLsd6EIknysc06/54DlrZ8qwA4o8UbCDBJ3kg8sce9ThzJoHekuJq6YDkNrTvLp9hWiaOvAVSJ6BOD+A1V44CbAR5SjYV+aVfb4/JYHNh3DKZQE5Q/Fp/W10QISfnyM0qHcXk5ISyopF+uK11bpLW6yYFs3Ck/UrcV0zA+34Y7VthCL/px/1wvEtb380gj7flTQM9xY7W87aFbD81cepjPP/fQqySKByy66q7kYbo1DYGSwstff6mEq1HT1Z8FRK8qXnCLswT+vArSYonAz+0kCs3Umrr/bk8O6XruItKE8ooQ+J89g1aP9LO7BHJRE3RxFws7QIONVXIus6zQXiAm6NpbuePpkc/Ps/m7FYAYRlnIRgKooJ/tMoyrepI0qTYhQGubQh2j2kh7E2awimLYdEgvuWH2C9SKDJAi1D2h10CRg+H5UXINWO3fluisRsZDrb0ix30AMPoHNdXqGRiLo9HSHF15P7rLf2wnkRocas1LJ8shQeJ0YIn9vDESFhLN+VUk/dh+7XVJcZIrhaayiUGuL+DcWf7c9BMwjm2HRrSf+ks0EEE6mYiFTkWre6QfMxRs+VbmeZiX1MQoGHLZQxvNNrshwDwFDvUsnM7RJe80Ruwz7OyXQuYCj/bj69RbfnfllADZkDBArwQG7j0TzEPHUnhher0ZGJGbI92+An5xVBOTObRte4Y1nGlHATt+cFsQQWDBAHHv5jN+fhqb8Wq6GiO7ktXlLdos1Er9lY43ghpLlSn9jB38tq2h0IAYm0dtbXFe2FDLEn7jvJqzlIkz/g=="
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
