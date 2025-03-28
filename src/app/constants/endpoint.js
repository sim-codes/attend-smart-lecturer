export const API_ENDPOINTS = {
    faculty: {
        getAll: '/faculties',
        getSingle: (id) => `/faculties/${id}`,
        create: '/faculties',
    },
    level: {
        getAll: '/levels',
        getSingle: (id) => `/levels/${id}`,
        create: '/levels',
    },
    classSchedule: {
        getAll: '/class-schedules',
        getAllByCourseIds: '/class-schedules/courses',
        getSingle: (id) => `/class-schedules/${id}`,
        create: '/class-schedules',
        update: (id) => `/class-schedules/${id}`,
        delete: (id) => `/class-schedules/${id}`,
    },
    classroom: {
        getAllForFaculty: (facultyId) => `faculties/${facultyId}/classrooms`,
        create: (facultyId) => `/faculties/${facultyId}/classrooms`,
        getSingle: (facultyId, id) => `/faculties/${facultyId}/classrooms/${id}`,
        delete: (facultyId, id) => `/faculties/${facultyId}/classrooms/${id}`,
    },
    department: {
        getAll: '/departments',
        getAllForFaculty: (facultyId) => `/faculties/${facultyId}/departments`,
        getSingle: (facultyId, id) => `/faculties/${facultyId}/departments/${id}`,
        create: (facultyId) => `/faculties/${facultyId}/departments`,
    },
    course: {
        getAllForDepartment: (departmentId) => `/departments/${departmentId}/courses`,
        getSingle: (departmentId, id) => `/departments/${departmentId}/courses/${id}`,
        createForDepartment: (departmentId) => `/departments/${departmentId}/courses`,
    },
    authentication: {
        login: '/authentication/login',
        register: '/authentication',
        resetPassword: '/authentication/reset-password',
        changePassword: '/authentication/change-password',
        generateResetToken: '/authentication/generate-reset-token',
        refreshToken: '/token/refresh',
    },
    lecturer: {
        getAll: '/lecturers',
        getSingle: (lecturerId) => `/lecturers/${lecturerId}`,
        create: '/lecturers',
        update: (lecturerId) => `/lecturers/${lecturerId}`,
    },
    student: {
        getAll: '/students',
        getSingle: (id) => `/students/${id}`,
        create: (id) => `/students/${id}`,
        update: (id) => `/students/${id}`,
    },
    attendance: {
        getAll: '/attendance',
        getSingle: (id) => `/students/${id}`,
        sign: (studentId) => `/attendance/${studentId}`,
        signWithoutLocation: (studentId) => `/attendance/${studentId}/signin`,
    },
    enrollment: {
        getAll: (studentId) => `/enrollments/${studentId}`,
        getSingle: (studentId, courseId) => `/enrollments/${studentId}/${courseId}`,
        create: (studentId) => `/enrollments/${studentId}`,
        delete: (studentId, courseId) => `/enrollments/${studentId}/${courseId}`,
    },
};

// Update PUBLIC_ENDPOINTS to use the new structure
export const PUBLIC_ENDPOINTS = [
    API_ENDPOINTS.authentication.login,
    API_ENDPOINTS.authentication.register
];
