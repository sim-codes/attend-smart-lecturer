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
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.student.getAll}?${queryString}`)
    );
  }
}

export const facultyService = {
  async getAllFaculties(params) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.faculty.getAll)
    );
  }
}

export const departmentService = {
  async getAllDepartments() {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.department.getAll)
    );
  },
  async getAllDepartmentsByFaculty(facultyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.department.getAllForFaculty(facultyId)}?${queryString}`)
    );
  }
}


