import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/app/constants/endpoint";
import { ServiceHandler } from "@/lib/serviceHangler";

export const authService = {
  async login(credentials) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.authentication.login, credentials)
    );
  },

  async register(user) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.authentication.register, user)
    );
  }
}

export const studentService = {
  async getAllStudents(params = {}) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.student.getAll, { params })
    );
  }
}
