
import axios from 'axios';
import { getCookie, handleLoggingOff, setCookie } from './helpers';
import { returnHeaders } from './utils';

const token = "U2FsdGVkX1+Z7633J7NIL/82wuZJq0rAeQ2NCpBS0f3/+9RZuWMlyKSf/+wQQyahMmASipzn2BropGVUX4Rhn05MYmEfL2GP8FBOfHMcd7lCRhiRM6CNnygtgk8TxAYlS//3SlZu2/euk+25CJAzLwgxxuTiX8wn3EMY9LatZBp6bw1u7P5SoJ/Qt2FDSgcINdyPUsUq119DObiF2ZbFU5EdblQ8Ma/1ZTnTwwhnvwzQhQfEs2htxrAEnVL+f/u7EfMiCzxl8pyUQBa/tgr5ZCjLMGMijiI1wobJZ20Sr4idZ0e/0w3N3Jw94muBGYZvqXpcFQ25mIv/5ME2XiYiKX0z4o+BkhjljdPSIY59vGrwWrOxWGybdVGumphXcWMXUjaynPSFox1r8b7kH7/9bWzoBSVjoQKXiQbIYSmFrXqCXA8TH3y/ovcZa1puWIPzBfOgcme1NA0eflPkIwBrIc3vJkGUZVCdg1pKY/QCLsv2M5gkavGuC1QhG2Ym1IClVn384rG+ZufgCPuOln+kdeZzIWfbXbYB7j/n67MfrbEbK82jkRMbswcyakxVaEfMsjn/ZTKOpXNLqwxv+EFroqGWSP4HB8anEjY2gaQDQMHn6+7CPiR0VPhCrFXzm6r+zlADDy9vA/OOZjndfyYY4mI32H75enQdvs53KJOg0gfs+qcAWuxYpb85zP51DmLAbi7fVn6bV5n010d0OZBcu4k0Y5As/IO9EDkdyOBHvIAltgJapDaQ9PUZKjSLuqgaKz9dmtmb4gZF3FbGulPyaCiu6DkMxrJCJykBJBNcbKf5T2KajHtbpOl3K2SmmTtJKLjulKkk3BPoZ9WXboKTcyyQ3NRhUgOw7o0cqxEfYxURg+NquBVeRwBRsMKJC5uHQ4sgrXrzAg+Ub3/Uh97mqGfSMgKYWPzMhzL3xL/TjCiG1biGPh456r2fy7dkQAlNNbyXZj6ao+ixnWEWkD9IJKvczBn7pVHC5N9/cKluOSJiG7uUm94h8iqQIQVpKpcwlJVfnMOPX4XWHDxR6gsESI+uw5vzquwdwHH5nWc5iVh/afVEYnQKvo2h6PnnEZaFZ7EVkIMl1FfMbnQlYPkwyFaiusBOd1hL+lrDMO6CvnbA95gU2IURYx75ULl/V859c4lYwGoyuqI3E2QDR6oAVr8PSUckTomRQo53a2Yn+8mnlwSOnl/71H+DU2//LtspDvkFHwtgeOF872wMkAV6SsF0WL/UMiwicL+eq7Gfwcm/FrRIORh/Xrc9/+FjhHo55kPkNspiUMjh8jmvSz2YbpfvRySofChViH+heK775rcmP2obA9X0Ji/NY7+p2KVmgxjn+Fywi+xHRPbEgsFNO5MGYSqWd13Rn9oRYkM/Gt9l124a83DyAHCPtX8fdIq91zgjGWAoCSNgHk1YNSP4mm/O2VC5xXsN+R2pXUXCfjHCGYIWM6+RSqXqWQm8glVlWVI8/fK4NTEkyQi/5A9iWXa0MO8uk80drkrP0lDqM1GB6RJnLNH+HsZq+OB/lqmfeZhzqZd3gZo8MBOKWXwrRl89kweV4VsF/aWu8Cuxx3bOHfFhift88F/FI8kYHqu+A6Mr9YzyQKnsHNhnRqpCN6PfBpsU6vp+4TFvp1eYNT4AzNTsfl9sIDkWGzCb5sC3D+mRcYzss7SNOSzmt0khIR8R5ENTmV0eNuVmHiJ9uia/M/pG0R12VY3PiBTfwP1IVR6v7Gdp/T+0TVTwLwb/nGKRSpoWjjZSnyyqiSkaw8mWHv+6ygp7jAYJXKf50mmxn+PjeJXGx5Cr+u7Sm6cwIw=="
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
