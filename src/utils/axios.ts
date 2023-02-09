import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { injectStore } from './injectStore';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // withCredentials: true,
  // timeout: 10000,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = `Bearer ${injectStore().getState().auth.accessToken}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
