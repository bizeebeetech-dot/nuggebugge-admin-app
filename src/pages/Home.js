import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Card, CardContent, Grid, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown, Category, Assignment, People, Home as HomeIcon, Event, Groups, BarChart, Dashboard, School } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
function Home() {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsxs(Box, { sx: { p: 4 }, children: [_jsxs(Typography, { variant: "h4", component: "h1", gutterBottom: true, sx: { color: '#1a1a2e', mb: 1 }, children: ["Welcome, ", user?.first_name, "! \uD83D\uDC4B"] }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 4 }, children: "Manage your dashboard and access all features" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)',
                                        color: '#fff',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                                        },
                                    }, onClick: () => navigate('/dashboard'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#7877c6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(Dashboard, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Dashboard" })] }), _jsx(Typography, { variant: "body2", sx: { color: 'rgba(255,255,255,0.7)' }, children: "View live stats, downloads & invoices" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/entities'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#6366f1',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(Category, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Add Entities" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Manage States, Districts, and School Boards" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/schools'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#0891b2',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(School, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Schools" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Manage schools with state, district & board" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/tasks'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#22c55e',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(Assignment, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Task List" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "View tasks and evaluate student submissions" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/users'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#f59e0b',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(People, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "User List" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Manage admin users and their access" })] }) }) })] }), _jsx(Typography, { variant: "h5", component: "h2", sx: { color: '#1a1a2e', mt: 4, mb: 2 }, children: "Website Pages Management" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/website/home'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#ec4899',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(HomeIcon, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Page 1: Home" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "4 Sliding Cover Photos & Text Content" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/website/activities'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#8b5cf6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(Event, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Page 2: Activities" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "List of Activities with Photo Attachments" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/website/about-us'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#14b8a6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(Groups, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Page 3: About Us" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Team Members, Photos & Contact Details" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: {
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        },
                                    }, onClick: () => navigate('/website/statistics'), children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Box, { sx: {
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            bgcolor: '#f97316',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }, children: _jsx(BarChart, { sx: { color: '#fff', fontSize: 24 } }) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "Page 4: Statistics" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Stats & App Feedback Scrolling Window" })] }) }) })] })] })] }));
}
export default Home;
