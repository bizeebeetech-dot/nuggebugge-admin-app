import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Paper, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown, ArrowBack } from '@mui/icons-material';
import EntityTable from '../components/EntityTable';
import authService from '../services/auth.service';
// Only 3 tabs: State, District, School Board
const tabs = [
    { label: 'STATE', entityType: 'state', title: 'State' },
    { label: 'DISTRICT', entityType: 'district', title: 'District' },
    { label: 'SCHOOL BOARD', entityType: 'school_board', title: 'School Board' },
];
export default function Entities() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const user = authService.getUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleTabChange = (_, newValue) => {
        setActiveTab(newValue);
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
    const getInitials = () => {
        if (!user)
            return '?';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: {
                    bgcolor: '#1a1a2e',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: {
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }, children: "Add Entities" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsxs(IconButton, { onClick: handleMenuOpen, sx: {
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
                                            }, children: getInitials() }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: handleMenuClose, transformOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, PaperProps: {
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Paper, { sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsxs(Box, { sx: { p: 2, borderBottom: '1px solid #e5e7eb' }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color: '#1a1a2e' }, children: "ADD ENTITIES" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Manage States, Districts, and School Boards" })] }), _jsx(Box, { sx: { borderBottom: '1px solid #e5e7eb' }, children: _jsx(Tabs, { value: activeTab, onChange: handleTabChange, sx: {
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        color: '#64748b',
                                        minHeight: 56,
                                        px: 4,
                                        '&.Mui-selected': {
                                            color: '#1a1a2e',
                                            bgcolor: '#fff',
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        bgcolor: '#7877c6',
                                        height: 3,
                                    },
                                }, children: tabs.map((tab, index) => (_jsx(Tab, { label: tab.label, sx: {
                                        bgcolor: activeTab === index ? '#fff' : '#f1f5f9',
                                        borderRight: index < tabs.length - 1 ? '1px solid #e2e8f0' : 'none',
                                        '&:hover': {
                                            bgcolor: activeTab === index ? '#fff' : '#e2e8f0',
                                        },
                                    } }, tab.entityType))) }) }), _jsx(Box, { sx: { p: 3, bgcolor: '#fff' }, children: _jsx(EntityTable, { entityType: tabs[activeTab].entityType, title: tabs[activeTab].title }) })] }) })] }));
}
