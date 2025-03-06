import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import axios, { AxiosRequestConfig } from 'axios';

export const fetchAPI = async (
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options?: AxiosRequestConfig
) => {
  try {
    const requestURL = `${getAPIDetectedIP()}/${path}`;

    const defaultOptions: AxiosRequestConfig = {
      url: requestURL,
      method,
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Merge provided options with default options
    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options?.headers || {}),
      },
    };

    const response = await axios.request(finalOptions);

    // Handle non-2xx status codes
    if (![200, 201].includes(response.status)) {
      console.error(`Error: ${response.statusText} in ${path}`, response);
      return null;
    }

    return response.data.data;
  } catch (error) {
    // Centralized error handling for network or other issues
    if (axios.isAxiosError(error)) {
      console.error(`Axios error: ${error.message} in ${path}`, error.response);
    } else {
      console.error(`Unexpected error: ${error}`, error);
    }
    return null;
  }
};

