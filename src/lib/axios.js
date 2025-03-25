import axios from "axios";
import { API_ENDPOINTS, PUBLIC_ENDPOINTS } from "@/app/constants/endpoint";
import { API_CONFIG } from "@/app/constants/config";
import { authUtils } from "./utils";
import { authService } from "./services";

class ApiClient {
  _client;
  _isRefreshing = false;
  _refreshSubscribers = [];

  constructor() {
    this._client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this._client.interceptors.request.use(
      async (config) => {
        const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
          config.url?.includes(endpoint)
        );

        if (!isPublicEndpoint) {
          const tokens = await authUtils.getTokens();
          const accessToken = tokens?.accessToken;

          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this._client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this._isRefreshing) {
            this._isRefreshing = true;

            try {
              const tokens = await authUtils.getTokens();
              const payload = { accessToken: tokens?.accessToken, refreshToken: tokens?.refreshToken };
              const response = await authService.refreshToken(payload);
              await authUtils.setTokens(response.data);

              this._isRefreshing = false;
              this._refreshSubscribers.forEach((cb) => cb(newTokens.accessToken));
              this._refreshSubscribers = [];
            } catch (refreshError) {
              this._isRefreshing = false;
              return Promise.reject(refreshError);
            }
          }

          return new Promise((resolve) => {
            this._refreshSubscribers.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this._client(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  async get(url, params = {}) {
    return this._client.get(url, { params });
  }

  async post(url, data = {}) {
    return this._client.post(url, data);
  }

  async put(url, data = {}) {
    return this._client.put(url, data);
  }

  async delete(url) {
    return this._client.delete(url);
  }
}

export const apiClient = new ApiClient();
