import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import AppRoutes from './routes/Routes';
import './App.css';
function AppContent() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login';
    // Auth pages render without Container for full-width layout
    if (isAuthPage) {
        return (_jsx(Box, { sx: { minHeight: '100vh' }, children: _jsx(AppRoutes, {}) }));
    }
    return (_jsx(Container, { maxWidth: "xl", children: _jsx(AppRoutes, {}) }));
}
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AppContent, {}) }));
}
export default App;
