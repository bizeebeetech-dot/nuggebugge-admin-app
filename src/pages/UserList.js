import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, } from '@mui/material';
import { Search, Logout, Person, KeyboardArrowDown, Add, Edit, Delete, } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import userService from '../services/user.service';
export default function UserList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = authService.getUser();
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    // Form state
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formFirstName, setFormFirstName] = useState('');
    const [formLastName, setFormLastName] = useState('');
    const [formRole, setFormRole] = useState('');
    const open = Boolean(anchorEl);
    // Fetch users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users', search],
        queryFn: () => userService.getAll(search || undefined),
    });
    // Create user mutation
    const createMutation = useMutation({
        mutationFn: (data) => userService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseDialog();
        },
    });
    // Update user mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => userService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseDialog();
        },
    });
    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => userService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDeleteDialogOpen(false);
            setDeletingUser(null);
        },
    });
    const resetForm = () => {
        setFormEmail('');
        setFormPassword('');
        setFormFirstName('');
        setFormLastName('');
        setFormRole('');
        setEditingUser(null);
    };
    const handleSearch = () => {
        setSearch(searchInput);
    };
    const handleClearSearch = () => {
        setSearchInput('');
        setSearch('');
    };
    const handleOpenDialog = (user) => {
        if (user) {
            setEditingUser(user);
            setFormEmail(user.email);
            setFormFirstName(user.first_name);
            setFormLastName(user.last_name);
            setFormRole(user.role || '');
            setFormPassword('');
        }
        else {
            resetForm();
        }
        setDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setDialogOpen(false);
        resetForm();
    };
    const handleSubmit = () => {
        if (editingUser) {
            const data = {
                email: formEmail,
                first_name: formFirstName,
                last_name: formLastName,
                role: formRole || undefined,
            };
            if (formPassword) {
                data.password = formPassword;
            }
            updateMutation.mutate({ id: editingUser.id, data });
        }
        else {
            if (!formEmail || !formPassword || !formFirstName || !formLastName)
                return;
            createMutation.mutate({
                email: formEmail,
                password: formPassword,
                first_name: formFirstName,
                last_name: formLastName,
                role: formRole || undefined,
            });
        }
    };
    const handleDeleteClick = (user) => {
        setDeletingUser(user);
        setDeleteDialogOpen(true);
    };
    const handleConfirmDelete = () => {
        if (deletingUser) {
            deleteMutation.mutate(deletingUser.id);
        }
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
        if (!currentUser)
            return '?';
        return `${currentUser.first_name?.[0] || ''}${currentUser.last_name?.[0] || ''}`.toUpperCase();
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
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
                                cursor: 'pointer',
                            }, onClick: () => navigate('/'), children: "nuggebugge" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsxs(IconButton, { onClick: handleMenuOpen, sx: {
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
                                            }, children: getInitials() }), _jsxs(Box, { sx: { ml: 1.5, textAlign: 'left', display: { xs: 'none', sm: 'block' } }, children: [_jsxs(Typography, { sx: { color: '#fff', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.2 }, children: [currentUser?.first_name, " ", currentUser?.last_name] }), _jsx(Typography, { sx: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }, children: currentUser?.email })] }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: handleMenuClose, transformOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, PaperProps: {
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Paper, { sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsxs(Box, { sx: { p: 3, borderBottom: '1px solid #e5e7eb' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "USER LIST" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => handleOpenDialog(), sx: {
                                                bgcolor: '#22c55e',
                                                '&:hover': { bgcolor: '#16a34a' },
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }, children: "Add User" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(TextField, { size: "small", placeholder: "Search by email or name...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, { sx: { color: 'rgba(0,0,0,0.4)' } }) })),
                                            }, sx: { width: 300 } }), _jsx(Button, { variant: "contained", onClick: handleSearch, sx: {
                                                bgcolor: '#6366f1',
                                                '&:hover': { bgcolor: '#4f46e5' },
                                                textTransform: 'none',
                                            }, children: "Search" }), _jsx(Button, { variant: "contained", onClick: handleClearSearch, sx: {
                                                bgcolor: '#475569',
                                                '&:hover': { bgcolor: '#334155' },
                                                textTransform: 'none',
                                            }, children: "Clear" })] })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f8fafc' }, children: [_jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 60 }, children: "No" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Email" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "First Name" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Last Name" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Created At" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 150 }, children: "Actions" })] }) }), _jsx(TableBody, { children: isLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 32 }) }) })) : users.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4, color: '#94a3b8' }, children: "No users found" }) })) : (users.map((user, index) => (_jsxs(TableRow, { sx: {
                                                bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                                                '&:hover': { bgcolor: '#e0f2fe' },
                                            }, children: [_jsx(TableCell, { sx: { color: '#3b82f6', fontWeight: 500 }, children: index + 1 }), _jsx(TableCell, { sx: { fontWeight: 500 }, children: user.email }), _jsx(TableCell, { children: user.first_name }), _jsx(TableCell, { children: user.last_name }), _jsx(TableCell, { children: formatDate(user.created_at) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => handleOpenDialog(user), sx: {
                                                                        border: '1px solid #22d3ee',
                                                                        color: '#22d3ee',
                                                                        '&:hover': { bgcolor: '#ecfeff' },
                                                                    }, children: _jsx(Edit, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteClick(user), disabled: user.id === currentUser?.id, sx: {
                                                                        border: '1px solid #f87171',
                                                                        color: '#f87171',
                                                                        '&:hover': { bgcolor: '#fef2f2' },
                                                                        '&:disabled': {
                                                                            border: '1px solid #d1d5db',
                                                                            color: '#d1d5db',
                                                                        },
                                                                    }, children: _jsx(Delete, { fontSize: "small" }) }) })] }) })] }, user.id)))) })] }) })] }) }), _jsxs(Dialog, { open: dialogOpen, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: editingUser ? 'Edit User' : 'Add New User' }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(TextField, { fullWidth: true, label: "Email", type: "email", value: formEmail, onChange: (e) => setFormEmail(e.target.value) }), _jsx(TextField, { fullWidth: true, label: editingUser ? 'Password (leave blank to keep current)' : 'Password', type: "password", value: formPassword, onChange: (e) => setFormPassword(e.target.value), required: !editingUser }), _jsx(TextField, { fullWidth: true, label: "First Name", value: formFirstName, onChange: (e) => setFormFirstName(e.target.value) }), _jsx(TextField, { fullWidth: true, label: "Last Name", value: formLastName, onChange: (e) => setFormLastName(e.target.value) }), _jsx(TextField, { fullWidth: true, label: "Role", value: formRole, onChange: (e) => setFormRole(e.target.value), placeholder: "e.g., admin, user" })] }) }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: handleCloseDialog, sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: !formEmail ||
                                    !formFirstName ||
                                    !formLastName ||
                                    (!editingUser && !formPassword) ||
                                    createMutation.isPending ||
                                    updateMutation.isPending, sx: {
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                }, children: createMutation.isPending || updateMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : editingUser ? ('Update') : ('Create') })] })] }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: "Confirm Delete" }), _jsx(DialogContent, { children: _jsxs(Typography, { children: ["Are you sure you want to delete user \"", deletingUser?.email, "\"?"] }) }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: () => setDeleteDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "error", onClick: handleConfirmDelete, disabled: deleteMutation.isPending, children: deleteMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Delete') })] })] })] }));
}
