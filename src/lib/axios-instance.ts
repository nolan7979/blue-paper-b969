import axios, { AxiosRequestConfig } from 'axios';

// const config: AxiosRequestConfig = { baseURL: process.env.NEXT_PUBLIC_API_BASE_URL};
const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_SOCCER_API_BASE_URL,
};

export const axiosInstance = axios.create(config);

// TODO - add interceptors: request/response if needed
