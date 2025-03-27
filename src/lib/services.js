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
  },
  async refreshToken(payload) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.authentication.refreshToken, payload)
    );
  },
  async resetPassword(payload) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.authentication.resetPassword, payload)
    );
  },
  async changePassword(payload) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.authentication.changePassword, payload)
    );
  },
  async generateResetToken(payload) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.authentication.generateResetToken, payload)
    );
  }
}

export const studentService = {
  async getAllStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.student.getAll}?${queryString}`)
    );
  },
  async getStudentById(id) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.student.getSingle(id))
    );
  }
}

export const levelService = {
  async getAllLevels() {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.level.getAll)
    );
  },
  async getLevelById(id) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.level.getSingle(id))
    );
  },
}

export const facultyService = {
  async getAllFaculties(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.faculty.getAll}?${queryString}`)
    );
  },
  async getFacultyById(id) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.faculty.getSingle(id))
    );
  },
  async createFaculty(facultyData) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.faculty.create, facultyData)
    );
  }
}

export const departmentService = {
  async getAllDepartments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.department.getAll}?${queryString}`)
    );
  },
  async getAllDepartmentsByFaculty(facultyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.department.getAllForFaculty(facultyId)}?${queryString}`)
    );
  },
  async getDepartmentById(facultyId, id) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.department.getSingle(facultyId, id))
    );
  },
  async createDepartment(facultyId, departmentData) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.department.create(facultyId), departmentData)
    );
  }
}

export const courseService = {
  async getAllCoursesByDepartment(departmentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.course.getAllForDepartment(departmentId)}?${queryString}`)
    );
  },
  async getCourseById(departmentId, id) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.course.getSingle(departmentId, id))
    );
  },
  async createCourseForDepartment(departmentId, courseData) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.course.createForDepartment(departmentId), courseData)
    );
  }
}

export const classScheduleService = {
  async getAllClassSchedules(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.classSchedule.getAll}?${queryString}`)
    );
  },
  async getAllClassSchedulesByCourseIds(courseIds) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.classSchedule.getAllByCourseIds, { courseIds })
    );
  },
  async getClassScheduleById(id) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.classSchedule.getSingle(id))
    );
  },
  async createClassSchedule(scheduleData) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.classSchedule.create, scheduleData)
    );
  },
  async updateClassSchedule(id, scheduleData) {
    return ServiceHandler.execute(() =>
      apiClient.put(API_ENDPOINTS.classSchedule.update(id), scheduleData)
    );
  },
  async deleteClassSchedule(id) {
    return ServiceHandler.execute(() =>
      apiClient.delete(API_ENDPOINTS.classSchedule.delete(id))
    );
  }
}

export const classroomService = {
  async getAllClassroomsByFaculty(facultyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.classroom.getAllForFaculty(facultyId)}?${queryString}`)
    );
  },
  async getClassroomById(facultyId, id) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.classroom.getSingle(facultyId, id))
    );
  },
  async createClassroom(facultyId, classroomData) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.classroom.create(facultyId), classroomData)
    );
  },
  async deleteClassroom(facultyId, id) {
    return ServiceHandler.execute(() =>
      apiClient.delete(API_ENDPOINTS.classroom.delete(facultyId, id))
    );
  }
};

export const attendanceService = {
  async getAllAttendance(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.attendance.getAll}?${queryString}`)
    );
  },
  async getStudentAttendance(studentId) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.attendance.getSingle(studentId))
    );
  },
  async signAttendance(studentId, attendanceData) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.attendance.sign(studentId), attendanceData)
    );
  },
  async signAttendanceWithoutLocation(studentId) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.attendance.signWithoutLocation(studentId))
    );
  }
}

export const enrollmentService = {
  async getAllEnrollments(studentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return ServiceHandler.execute(() =>
      apiClient.get(`${API_ENDPOINTS.enrollment.getAll(studentId)}?${queryString}`)
    );
  },
  async getEnrollmentDetails(studentId, courseId) {
    return ServiceHandler.execute(() =>
      apiClient.get(API_ENDPOINTS.enrollment.getSingle(studentId, courseId))
    );
  },
  async createEnrollment(studentId, enrollmentData) {
    return ServiceHandler.execute(() =>
      apiClient.post(API_ENDPOINTS.enrollment.create(studentId), enrollmentData)
    );
  },
  async deleteEnrollment(studentId, courseId) {
    return ServiceHandler.execute(() =>
      apiClient.delete(API_ENDPOINTS.enrollment.delete(studentId, courseId))
    );
  }
};
