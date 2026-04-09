import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { addError } from './ErrorHandler';
import type { ApiResponse } from './ApiResponse';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * BaseApiClient provides a wrapper around Axios for consistent API calls.
 * Implemented as a singleton-like static class to maintain a clean infrastructure layer.
 */
export class BaseApiClient {
  private static instance: AxiosInstance;

  private static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Response interceptor for global error handling
      this.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          const status = error.response?.status;
          const message = error.response?.data?.meta?.message || error.message || 'An unexpected error occurred';
          
          addError(message, status);
          return Promise.reject(error);
        }
      );
    }
    return this.instance;
  }

  static async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.getInstance().get<ApiResponse<T>>(endpoint, config);
    return response.data;
  }

  static async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.getInstance().post<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  static async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.getInstance().patch<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  static async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.getInstance().delete<ApiResponse<T>>(endpoint, config);
    return response.data;
  }
}
