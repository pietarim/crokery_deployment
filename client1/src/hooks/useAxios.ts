import axios from 'axios';
import { useAuth } from './useAuth';

export const useAxios = () => {
  const { token, setToken } = useAuth();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api',
  });

  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.token}`;
  }

  const refreshAccessToken = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/access-token', { withCredentials: true });
      const newAccessToken = response.data;
      setToken({ token: newAccessToken.token, username: newAccessToken.username, id: newAccessToken.id });
      return newAccessToken.token;
    } catch (error) {
      console.error('Error refreshing access token', error);
      throw error;
    }
  };

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      if (error.response) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken();
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
        return Promise.reject(error);
      }
    }
  );

  const get = async (url: string, config = {}) => {
    return await axiosInstance.get(url, config);
  };

  const post = async (url: string, data = {}, config = {}) => {
    return await axiosInstance.post(url, data, config);
  };

  const put = async (url: string, data = {}, config = {}) => {
    return await axiosInstance.put(url, data, config);
  };

  const deleteReq = async (url: string, config = {}) => {
    return await axiosInstance.delete(url, config);
  };

  return { get, post, put, deleteReq };
};