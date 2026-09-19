import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  withCredentials: true,
})


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (!isLoginRequest && (error.response?.status === 401 || error.response?.status === 403)) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);