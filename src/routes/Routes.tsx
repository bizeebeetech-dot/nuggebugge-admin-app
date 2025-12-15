import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Entities from '../pages/Entities';
import SchoolList from '../pages/SchoolList';
import TaskList from '../pages/TaskList';
import StudentList from '../pages/StudentList';
import StudentProfiles from '../pages/StudentProfiles';
import StudentProfileDetail from '../pages/StudentProfileDetail';
import StudentOrders from '../pages/StudentOrders';
import UserList from '../pages/UserList';
import ActivityList from '../pages/ActivityList';
import ActivityEdit from '../pages/ActivityEdit';
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
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
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
        path="/schools"
        element={
          <ProtectedRoute>
            <SchoolList />
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
        path="/student-profiles"
        element={
          <ProtectedRoute>
            <StudentProfiles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-profiles/:id"
        element={
          <ProtectedRoute>
            <StudentProfileDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-orders"
        element={
          <ProtectedRoute>
            <StudentOrders />
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
        path="/activities"
        element={
          <ProtectedRoute>
            <ActivityList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities/:id"
        element={
          <ProtectedRoute>
            <ActivityEdit />
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
