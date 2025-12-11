import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Card, CardContent, Grid, CircularProgress, Chip, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown, ArrowBack, AdminPanelSettings, People, PhoneAndroid, Apple, CloudDownload, Receipt, Refresh, Circle, } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import authService from '../services/auth.service';
import dashboardService from '../services/dashboard.service';
function StatCard({ title, value, icon, color, bgColor, subtitle, isLive }) {
    return (_jsxs(Card, { sx: { height: '100%', position: 'relative', overflow: 'visible' }, children: [isLive && (_jsx(Chip, { icon: _jsx(Circle, { sx: { fontSize: 8, color: '#22c55e', animation: 'pulse 2s infinite' } }), label: "LIVE", size: "small", sx: {
                    position: 'absolute',
                    top: -10,
                    right: 10,
                    bgcolor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    '& .MuiChip-icon': { ml: 0.5 },
                } })), _jsx(CardContent, { sx: { p: 3 }, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1, fontWeight: 500 }, children: title }), _jsx(Typography, { variant: "h3", sx: { fontWeight: 700, color, lineHeight: 1 }, children: value.toLocaleString() }), subtitle && (_jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 1, display: 'block' }, children: subtitle }))] }), _jsx(Box, { sx: {
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: bgColor,
                                color,
                            }, children: icon })] }) })] }));
}
export default function Dashboard() {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { data: stats, isLoading, refetch } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => dashboardService.getStats(),
        refetchInterval: 30000, // Refresh every 30 seconds
    });
    const getInitials = () => {
        if (!user)
            return '?';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        handleMenuClose();
        authService.logout();
    };
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx("style", { children: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        ` }), _jsx(AppBar, { position: "static", elevation: 0, sx: {
                    bgcolor: '#1a1a2e',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: {
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }, children: "Dashboard" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => refetch(), sx: { color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }, children: _jsx(Refresh, {}) }), _jsxs(IconButton, { onClick: handleMenuOpen, sx: {
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 0.5,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                    }, children: [_jsx(Avatar, { sx: {
                                                width: 36,
                                                height: 36,
                                                bgcolor: '#7877c6',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                            }, children: getInitials() }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: handleMenuClose, PaperProps: {
                                        sx: {
                                            mt: 1,
                                            minWidth: 200,
                                            bgcolor: '#1a1a2e',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            '& .MuiMenuItem-root': {
                                                color: '#fff',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                            },
                                        },
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: isLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }, children: _jsx(CircularProgress, { size: 48 }) })) : (_jsxs(_Fragment, { children: [_jsxs(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Circle, { sx: { fontSize: 12, color: '#22c55e', animation: 'pulse 2s infinite' } }), "Live Statistics"] }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Admin Users Online", value: stats?.admin_users_online || 0, icon: _jsx(AdminPanelSettings, { sx: { fontSize: 28 } }), color: "#7c3aed", bgColor: "#ede9fe", isLive: true, subtitle: `of ${stats?.total_admin_users || 0} total admins` }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Students Live on Android", value: stats?.students_on_android || 0, icon: _jsx(PhoneAndroid, { sx: { fontSize: 28 } }), color: "#16a34a", bgColor: "#dcfce7", isLive: true }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Students Live on iOS", value: stats?.students_on_ios || 0, icon: _jsx(Apple, { sx: { fontSize: 28 } }), color: "#1d4ed8", bgColor: "#dbeafe", isLive: true }) })] }), _jsxs(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(CloudDownload, { sx: { color: '#6366f1' } }), "App Downloads"] }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Android Downloads", value: stats?.android_downloads || 0, icon: _jsx(PhoneAndroid, { sx: { fontSize: 28 } }), color: "#16a34a", bgColor: "#dcfce7", subtitle: "Total Google Play downloads" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "iOS Downloads", value: stats?.ios_downloads || 0, icon: _jsx(Apple, { sx: { fontSize: 28 } }), color: "#1d4ed8", bgColor: "#dbeafe", subtitle: "Total App Store downloads" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Total Downloads", value: stats?.total_downloads || 0, icon: _jsx(CloudDownload, { sx: { fontSize: 28 } }), color: "#6366f1", bgColor: "#e0e7ff", subtitle: "Combined all platforms" }) })] }), _jsxs(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Receipt, { sx: { color: '#f59e0b' } }), "Other Statistics"] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Total Invoices", value: stats?.total_invoices || 0, icon: _jsx(Receipt, { sx: { fontSize: 28 } }), color: "#f59e0b", bgColor: "#fef3c7", subtitle: "All time invoice count" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Total Students", value: stats?.total_students || 0, icon: _jsx(People, { sx: { fontSize: 28 } }), color: "#0891b2", bgColor: "#cffafe", subtitle: "Registered in system" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(StatCard, { title: "Total Admin Users", value: stats?.total_admin_users || 0, icon: _jsx(AdminPanelSettings, { sx: { fontSize: 28 } }), color: "#7c3aed", bgColor: "#ede9fe", subtitle: "Active admin accounts" }) })] }), _jsx(Box, { sx: { mt: 4, textAlign: 'center' }, children: _jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["Auto-refreshes every 30 seconds \u2022 Last updated: ", new Date().toLocaleTimeString()] }) })] })) })] }));
}
