import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown } from '@mui/icons-material';
import EntityTable from '../components/EntityTable';
import authService from '../services/auth.service';
const tabs = [
    { label: 'State', entityType: 'state', title: 'State' },
    { label: 'Degree', entityType: 'degree', title: 'Degree' },
    { label: 'Branch', entityType: 'branch', title: 'Branch' },
    { label: 'Batch', entityType: 'batch', title: 'Batch' },
    { label: 'Implementation year', entityType: 'implementation_year', title: 'Implementation Year' },
    { label: 'Activity Category', entityType: 'activity_category', title: 'Activity Category' },
    { label: 'Activity Type', entityType: 'activity_type', title: 'Activity Type' },
];
export default function Entities() {
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
                }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsx(Typography, { variant: "h6", sx: {
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }, children: "nuggebugge" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsxs(IconButton, { onClick: handleMenuOpen, sx: {
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
                                            }, children: getInitials() }), _jsxs(Box, { sx: { ml: 1.5, textAlign: 'left', display: { xs: 'none', sm: 'block' } }, children: [_jsxs(Typography, { sx: { color: '#fff', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.2 }, children: [user?.first_name, " ", user?.last_name] }), _jsx(Typography, { sx: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }, children: user?.email })] }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: handleMenuClose, transformOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, PaperProps: {
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Paper, { sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsx(Box, { sx: { p: 2, borderBottom: '1px solid #e5e7eb' }, children: _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color: '#1a1a2e' }, children: "ADD ENTITIES" }) }), _jsx(Box, { sx: { borderBottom: '1px solid #e5e7eb' }, children: _jsx(Tabs, { value: activeTab, onChange: handleTabChange, variant: "scrollable", scrollButtons: "auto", sx: {
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        color: '#64748b',
                                        minHeight: 48,
                                        '&.Mui-selected': {
                                            color: '#3b82f6',
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        bgcolor: '#3b82f6',
                                    },
                                }, children: tabs.map((tab, index) => (_jsx(Tab, { label: tab.label, sx: {
                                        bgcolor: activeTab === index ? '#fff' : '#e5e7eb',
                                        borderRight: '1px solid #d1d5db',
                                        '&:first-of-type': {
                                            borderTopLeftRadius: 0,
                                        },
                                    } }, tab.entityType))) }) }), _jsx(Box, { sx: { p: 3 }, children: _jsx(EntityTable, { entityType: tabs[activeTab].entityType, title: tabs[activeTab].title }) })] }) })] }));
}
