import axiosInstance from './axiosInstance'

// ─── AUTH ───────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
}

// ─── COURSES (public) ────────────────────────────────────────────────────────
export const courseAPI = {
  search: (keyword = '') => axiosInstance.get(`/courses/search?keyword=${keyword}`),
  getById: (id) => axiosInstance.get(`/courses/${id}`),
  getCourseFeedback: (id) => axiosInstance.get(`/courses/${id}/feedback`),
}

// ─── USER ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => axiosInstance.get('/user/profile'),
  updateProfile: (data) => axiosInstance.put('/user/profile', data),
  requestTrainerUpgrade: (formData) =>
    axiosInstance.post('/user/trainer-upgrade', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  sendCourseRequest: (data) => axiosInstance.post('/user/course-request', data),
  getMyCourseRequests: () => axiosInstance.get('/user/course-requests'),
  getEnrolledCourses: () => axiosInstance.get('/user/enrollments'),
  submitFeedback: (data) => axiosInstance.post('/user/feedback', data),
  getNotifications: () => axiosInstance.get('/user/notifications'),
  markNotificationRead: (id) => axiosInstance.put(`/user/notifications/${id}/read`),
  markAllRead: () => axiosInstance.put('/user/notifications/read-all'),
}

// ─── TRAINER ─────────────────────────────────────────────────────────────────
export const trainerAPI = {
  createCourse: (data) => axiosInstance.post('/trainer/courses', data),
  updateCourse: (id, data) => axiosInstance.put(`/trainer/courses/${id}`, data),
  getMyCourses: () => axiosInstance.get('/trainer/courses'),
  getCourseRequests: () => axiosInstance.get('/trainer/requests'),
  decideCourseRequest: (id, data) => axiosInstance.put(`/trainer/requests/${id}/decision`, data),
  getStudents: () => axiosInstance.get('/trainer/students'),
  getCourseEnrollments: (courseId) => axiosInstance.get(`/trainer/courses/${courseId}/enrollments`),
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getAllTrainerRequests: () => axiosInstance.get('/admin/trainer-requests'),
  getPendingTrainerRequests: () => axiosInstance.get('/admin/trainer-requests/pending'),
  decideTrainerRequest: (id, data) => axiosInstance.put(`/admin/trainer-requests/${id}/decision`, data),
  getAllUsers: () => axiosInstance.get('/admin/users'),
  getAllCourses: () => axiosInstance.get('/admin/courses'),
  getAllFeedback: () => axiosInstance.get('/admin/feedback'),
  deleteFeedback: (id) => axiosInstance.delete(`/admin/feedback/${id}`),
  getReport: () => axiosInstance.get('/admin/reports'),
}
