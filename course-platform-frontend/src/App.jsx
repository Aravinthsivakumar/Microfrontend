import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminTrainerRequests from "./pages/admin/AdminTrainerRequests";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminReports from "./pages/admin/AdminReports";

// Trainer
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerCourses from "./pages/trainer/TrainerCourses";
import TrainerRequests from "./pages/trainer/TrainerRequests";
import TrainerStudents from "./pages/trainer/TrainerStudents";

// User
import UserDashboard from "./pages/user/UserDashboard";
import BrowseCourses from "./pages/user/BrowseCourses";
import UserEnrollments from "./pages/user/UserEnrollments";
import UserRequests from "./pages/user/UserRequests";
import UserNotifications from "./pages/user/UserNotifications";
import UserProfile from "./pages/user/UserProfile";

// Misc
import Unauthorized from "./pages/Unauthorized";
import TrainerBrowse from "./pages/trainer/TrainerBrowse";

const ADMIN = ["ROLE_ADMIN"];
const TRAINER = ["ROLE_TRAINER", "ROLE_ADMIN"];
const USER = ["ROLE_USER", "ROLE_TRAINER", "ROLE_ADMIN"];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={ADMIN}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute roles={ADMIN}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trainer-requests"
            element={
              <ProtectedRoute roles={ADMIN}>
                <AdminTrainerRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute roles={ADMIN}>
                <AdminFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={ADMIN}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* Trainer */}
          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute roles={TRAINER}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/courses"
            element={
              <ProtectedRoute roles={TRAINER}>
                <TrainerCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/requests"
            element={
              <ProtectedRoute roles={TRAINER}>
                <TrainerRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/students"
            element={
              <ProtectedRoute roles={TRAINER}>
                <TrainerStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/Browse"
            element={
              <ProtectedRoute roles={TRAINER}>
                <TrainerBrowse />
              </ProtectedRoute>
            }
          />

          {/* User */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute roles={USER}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/courses"
            element={
              <ProtectedRoute roles={USER}>
                <BrowseCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/enrollments"
            element={
              <ProtectedRoute roles={USER}>
                <UserEnrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/requests"
            element={
              <ProtectedRoute roles={USER}>
                <UserRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/notifications"
            element={
              <ProtectedRoute roles={USER}>
                <UserNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute roles={USER}>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
