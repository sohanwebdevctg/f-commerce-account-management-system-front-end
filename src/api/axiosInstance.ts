import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
});


// Request Interceptor: Adding a token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response Interceptor: Handling 401/Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If a 401 Unauthorized error occurs, it will clear the local storage and redirect to the login page
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("email");
      localStorage.removeItem("role");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;