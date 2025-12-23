import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Entities from '../pages/Entities';
import SchoolList from '../pages/SchoolList';
import TaskList from '../pages/TaskList';
import StudentList from '../pages/StudentList';
import Evaluation from '../pages/Evaluation';
import AnswerEvaluation from '../pages/AnswerEvaluation';
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
import WebsiteObjective from '../pages/WebsiteObjective';
import WebsiteGovtProjects from '../pages/WebsiteGovtProjects';
import WebsiteHowToImplement from '../pages/WebsiteHowToImplement';
import WebsiteUserManual from '../pages/WebsiteUserManual';
import WebsiteVisionMission from '../pages/WebsiteVisionMission';
import WebsiteOurTeam from '../pages/WebsiteOurTeam';
import ComplaintSubmissions from '../pages/ComplaintSubmissions';
import Feedbacks from '../pages/Feedbacks';
import WebsiteSocialSitesLink from '../pages/WebsiteSocialSitesLink';
import WebsiteContactUs from '../pages/WebsiteContactUs';
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
        path="/evaluation"
        element={
          <ProtectedRoute>
            <Evaluation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluation/student/:studentId/activity/:activityId/answer"
        element={
          <ProtectedRoute>
            <AnswerEvaluation />
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
      <Route
        path="/website/objective"
        element={
          <ProtectedRoute>
            <WebsiteObjective />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/govt-projects"
        element={
          <ProtectedRoute>
            <WebsiteGovtProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/how-to-implement"
        element={
          <ProtectedRoute>
            <WebsiteHowToImplement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/user-manual"
        element={
          <ProtectedRoute>
            <WebsiteUserManual />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/vision-mission"
        element={
          <ProtectedRoute>
            <WebsiteVisionMission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/our-team"
        element={
          <ProtectedRoute>
            <WebsiteOurTeam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/social-sites-links"
        element={
          <ProtectedRoute>
            <WebsiteSocialSitesLink />
          </ProtectedRoute>
        }
      />
      <Route
        path="/website/contact-us"
        element={
          <ProtectedRoute>
            <WebsiteContactUs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaint-submissions"
        element={
          <ProtectedRoute>
            <ComplaintSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedbacks"
        element={
          <ProtectedRoute>
            <Feedbacks />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
