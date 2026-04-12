# Course Platform Frontend

React + Vite + Bootstrap frontend for the Course Management & Trainer Interaction Platform.

## Tech Stack
- **React 18** with React Router v6
- **Vite** (dev server + build)
- **Bootstrap 5.3** + Bootstrap Icons
- **Axios** with JWT interceptors

## Project Structure

```
src/
├── api/
│   ├── axiosInstance.js     # Axios with JWT request interceptor & 401 handler
│   └── services.js          # All API calls (authAPI, courseAPI, userAPI, trainerAPI, adminAPI)
├── context/
│   └── AuthContext.jsx      # Global auth state (login/logout/role helpers)
├── components/common/
│   ├── Layout.jsx           # Page wrapper (Sidebar + Topbar + content)
│   ├── Sidebar.jsx          # Role-based navigation sidebar
│   ├── Topbar.jsx           # Top header bar
│   ├── ProtectedRoute.jsx   # Route guard with role checks
│   └── UI.jsx               # Shared: Spinner, Alert, StatusBadge, StarRating
└── pages/
    ├── auth/        Login.jsx, Register.jsx
    ├── admin/       AdminDashboard, AdminUsers, AdminCourses,
    │                AdminTrainerRequests, AdminFeedback, AdminReports
    ├── trainer/     TrainerDashboard, TrainerCourses, TrainerRequests, TrainerStudents
    └── user/        UserDashboard, BrowseCourses, UserEnrollments,
                     UserRequests, UserNotifications, UserProfile
```

## Role-Based Access

| Role        | Access                                                    |
|-------------|-----------------------------------------------------------|
| ROLE_ADMIN  | Full platform management (users, courses, trainers, reports) |
| ROLE_TRAINER| Create/manage courses, handle enrollment requests         |
| ROLE_USER   | Browse/request courses, feedback, notifications, profile  |

## Setup & Run

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:8080`

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (proxies /api → http://localhost:8080)
npm run dev

# 3. Open http://localhost:3000
```

### Build for Production

```bash
npm run build
# Output goes to dist/
```

## Backend API Endpoints Used

| Module  | Endpoint                                    | Method |
|---------|---------------------------------------------|--------|
| Auth    | /api/auth/login                             | POST   |
| Auth    | /api/auth/register                          | POST   |
| Courses | /api/courses/search                         | GET    |
| Courses | /api/courses/{id}                           | GET    |
| User    | /api/user/profile                           | GET/PUT|
| User    | /api/user/trainer-upgrade                   | POST   |
| User    | /api/user/course-request                    | POST   |
| User    | /api/user/course-requests                   | GET    |
| User    | /api/user/enrollments                       | GET    |
| User    | /api/user/feedback                          | POST   |
| User    | /api/user/notifications                     | GET    |
| Trainer | /api/trainer/courses                        | GET/POST|
| Trainer | /api/trainer/courses/{id}                   | PUT    |
| Trainer | /api/trainer/requests                       | GET    |
| Trainer | /api/trainer/requests/{id}/decision         | PUT    |
| Trainer | /api/trainer/students                       | GET    |
| Admin   | /api/admin/users                            | GET    |
| Admin   | /api/admin/courses                          | GET    |
| Admin   | /api/admin/trainer-requests                 | GET    |
| Admin   | /api/admin/trainer-requests/{id}/decision   | PUT    |
| Admin   | /api/admin/feedback                         | GET    |
| Admin   | /api/admin/feedback/{id}                    | DELETE |
| Admin   | /api/admin/reports                          | GET    |

## Default Admin Credentials
```
Email:    admin@courseplatform.com
Password: admin@123
```
