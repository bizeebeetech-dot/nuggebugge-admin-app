import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Entities from '../pages/Entities';
import TaskList from '../pages/TaskList';
import StudentList from '../pages/StudentList';
import UserList from '../pages/UserList';
import WebsiteHome from '../pages/WebsiteHome';
import WebsiteActivities from '../pages/WebsiteActivities';
import WebsiteAboutUs from '../pages/WebsiteAboutUs';
import WebsiteStatistics from '../pages/WebsiteStatistics';
import authService from '../services/auth.service';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Public route wrapper (redirects to home if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entities"
        element={
          <ProtectedRoute>
            <Entities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:taskId/students"
        element={
          <ProtectedRoute>
            <StudentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/home"
        element={
          <ProtectedRoute>
            <WebsiteHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/activities"
        element={
          <ProtectedRoute>
            <WebsiteActivities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/about-us"
        element={
          <ProtectedRoute>
            <WebsiteAboutUs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/statistics"
        element={
          <ProtectedRoute>
            <WebsiteStatistics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
