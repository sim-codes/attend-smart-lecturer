import axios from "axios";
import { API_ENDPOINTS, PUBLIC_ENDPOINTS } from "@/app/constants/endpoint";
import { API_CONFIG } from "@/app/constants/config";
import { authUtils } from "./utils";

class ApiClient{
  _client;

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
        const isPublicEndpoint = PUBLIC_ENDPOINTS.some(
          endpoint => config.url?.includes(endpoint)
        );

        if (!isPublicEndpoint) {
          const tokens = await authUtils.getTokens();
          const accessToken = tokens.accessToken;

          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this._client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        console.log(error)

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
