import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Entities from '../pages/Entities';
import SchoolList from '../pages/SchoolList';
import TaskList from '../pages/TaskList';
import StudentList from '../pages/StudentList';
import UserList from '../pages/UserList';
import WebsiteHome from '../pages/WebsiteHome';
import WebsiteActivities from '../pages/WebsiteActivities';
import WebsiteAboutUs from '../pages/WebsiteAboutUs';
import WebsiteStatistics from '../pages/WebsiteStatistics';
import authService from '../services/auth.service';
// Protected route wrapper
function ProtectedRoute({ children }) {
    if (!authService.isAuthenticated()) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
// Public route wrapper (redirects to home if already logged in)
function PublicRoute({ children }) {
    if (authService.isAuthenticated()) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Home, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/entities", element: _jsx(ProtectedRoute, { children: _jsx(Entities, {}) }) }), _jsx(Route, { path: "/schools", element: _jsx(ProtectedRoute, { children: _jsx(SchoolList, {}) }) }), _jsx(Route, { path: "/tasks", element: _jsx(ProtectedRoute, { children: _jsx(TaskList, {}) }) }), _jsx(Route, { path: "/tasks/:taskId/students", element: _jsx(ProtectedRoute, { children: _jsx(StudentList, {}) }) }), _jsx(Route, { path: "/users", element: _jsx(ProtectedRoute, { children: _jsx(UserList, {}) }) }), _jsx(Route, { path: "/website/home", element: _jsx(ProtectedRoute, { children: _jsx(WebsiteHome, {}) }) }), _jsx(Route, { path: "/website/activities", element: _jsx(ProtectedRoute, { children: _jsx(WebsiteActivities, {}) }) }), _jsx(Route, { path: "/website/about-us", element: _jsx(ProtectedRoute, { children: _jsx(WebsiteAboutUs, {}) }) }), _jsx(Route, { path: "/website/statistics", element: _jsx(ProtectedRoute, { children: _jsx(WebsiteStatistics, {}) }) })] }));
}
export default AppRoutes;
