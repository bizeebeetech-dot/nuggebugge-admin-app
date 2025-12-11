import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Switch, Chip, Grid, Alert, } from '@mui/material';
import { Search, Logout, Person, KeyboardArrowDown, Add, Edit, Delete, LockReset, Block, CheckCircle, ArrowBack, } from '@mui/icons-material';
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
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [resetPasswordUser, setResetPasswordUser] = useState(null);
    const [deactivatingUser, setDeactivatingUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Form state
    const [formFirstName, setFormFirstName] = useState('');
    const [formLastName, setFormLastName] = useState('');
    const [formDesignation, setFormDesignation] = useState('');
    const [formEmployeeId, setFormEmployeeId] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formUsername, setFormUsername] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formConfirmPassword, setFormConfirmPassword] = useState('');
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
    // Toggle enabled mutation
    const toggleEnabledMutation = useMutation({
        mutationFn: ({ id, is_enabled }) => userService.toggleEnabled(id, is_enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: ({ id, password }) => userService.resetPassword(id, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setResetPasswordDialogOpen(false);
            setResetPasswordUser(null);
            setNewPassword('');
            setConfirmPassword('');
        },
    });
    // Deactivate user mutation
    const deactivateMutation = useMutation({
        mutationFn: (id) => userService.deactivateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDeactivateDialogOpen(false);
            setDeactivatingUser(null);
        },
    });
    // Activate user mutation
    const activateMutation = useMutation({
        mutationFn: (id) => userService.activateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
    const resetForm = () => {
        setFormFirstName('');
        setFormLastName('');
        setFormDesignation('');
        setFormEmployeeId('');
        setFormEmail('');
        setFormUsername('');
        setFormPassword('');
        setFormConfirmPassword('');
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
            setFormFirstName(user.first_name);
            setFormLastName(user.last_name);
            setFormDesignation(user.designation || '');
            setFormEmployeeId(user.employee_id || '');
            setFormEmail(user.email);
            setFormUsername(user.username || '');
            setFormPassword('');
            setFormConfirmPassword('');
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
        if (!editingUser && formPassword !== formConfirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (editingUser) {
            const data = {
                first_name: formFirstName,
                last_name: formLastName,
                designation: formDesignation || undefined,
                employee_id: formEmployeeId || undefined,
                email: formEmail,
                username: formUsername || undefined,
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
                first_name: formFirstName,
                last_name: formLastName,
                designation: formDesignation || undefined,
                employee_id: formEmployeeId || undefined,
                email: formEmail,
                username: formUsername || undefined,
                password: formPassword,
                role: 'admin',
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
    const handleResetPasswordClick = (user) => {
        setResetPasswordUser(user);
        setNewPassword('');
        setConfirmPassword('');
        setResetPasswordDialogOpen(true);
    };
    const handleConfirmResetPassword = () => {
        if (resetPasswordUser && newPassword && newPassword === confirmPassword) {
            resetPasswordMutation.mutate({ id: resetPasswordUser.id, password: newPassword });
        }
    };
    const handleDeactivateClick = (user) => {
        setDeactivatingUser(user);
        setDeactivateDialogOpen(true);
    };
    const handleConfirmDeactivate = () => {
        if (deactivatingUser) {
            deactivateMutation.mutate(deactivatingUser.id);
        }
    };
    const handleToggleEnabled = (user) => {
        toggleEnabledMutation.mutate({ id: user.id, is_enabled: !user.is_enabled });
    };
    const handleActivateUser = (user) => {
        activateMutation.mutate(user.id);
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
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: {
                    bgcolor: '#1a1a2e',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: {
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }, children: "User Management" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsxs(IconButton, { onClick: handleMenuOpen, sx: {
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Paper, { sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsxs(Box, { sx: { p: 3, borderBottom: '1px solid #e5e7eb' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "ADMIN USER MANAGEMENT" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Create and manage admin users" })] }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => handleOpenDialog(), sx: {
                                                bgcolor: '#22c55e',
                                                '&:hover': { bgcolor: '#16a34a' },
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }, children: "Add Admin User" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(TextField, { size: "small", placeholder: "Search by name, email, username, or employee ID...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, { sx: { color: 'rgba(0,0,0,0.4)' } }) })),
                                            }, sx: { width: 400 } }), _jsx(Button, { variant: "contained", onClick: handleSearch, sx: {
                                                bgcolor: '#6366f1',
                                                '&:hover': { bgcolor: '#4f46e5' },
                                                textTransform: 'none',
                                            }, children: "Search" }), _jsx(Button, { variant: "contained", onClick: handleClearSearch, sx: {
                                                bgcolor: '#475569',
                                                '&:hover': { bgcolor: '#334155' },
                                                textTransform: 'none',
                                            }, children: "Clear" })] })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f8fafc' }, children: [_jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 50 }, children: "No" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Name" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Designation" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Employee ID" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Email" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Username" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 100 }, children: "Enabled" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 100 }, children: "Status" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 200 }, children: "Actions" })] }) }), _jsx(TableBody, { children: isLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, align: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 32 }) }) })) : users.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, align: "center", sx: { py: 4, color: '#94a3b8' }, children: "No users found" }) })) : (users.map((user, index) => (_jsxs(TableRow, { sx: {
                                                bgcolor: user.is_deactivated ? '#fef2f2' : index % 2 === 0 ? '#f0f9ff' : '#fff',
                                                '&:hover': { bgcolor: user.is_deactivated ? '#fee2e2' : '#e0f2fe' },
                                                opacity: user.is_deactivated ? 0.7 : 1,
                                            }, children: [_jsx(TableCell, { sx: { color: '#3b82f6', fontWeight: 500 }, children: index + 1 }), _jsxs(TableCell, { sx: { fontWeight: 500 }, children: [user.first_name, " ", user.last_name] }), _jsx(TableCell, { children: user.designation || '-' }), _jsx(TableCell, { children: user.employee_id || '-' }), _jsx(TableCell, { children: user.email }), _jsx(TableCell, { children: user.username || '-' }), _jsx(TableCell, { children: _jsx(Switch, { checked: user.is_enabled !== false, onChange: () => handleToggleEnabled(user), disabled: user.is_deactivated || user.id === currentUser?.id, color: "success", size: "small" }) }), _jsx(TableCell, { children: user.is_deactivated ? (_jsx(Chip, { label: "Deactivated", color: "error", size: "small" })) : user.is_enabled === false ? (_jsx(Chip, { label: "Disabled", color: "warning", size: "small" })) : (_jsx(Chip, { label: "Active", color: "success", size: "small" })) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', gap: 0.5, flexWrap: 'wrap' }, children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => handleOpenDialog(user), disabled: user.is_deactivated, sx: {
                                                                        border: '1px solid #22d3ee',
                                                                        color: '#22d3ee',
                                                                        '&:hover': { bgcolor: '#ecfeff' },
                                                                        '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
                                                                    }, children: _jsx(Edit, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Reset Password", children: _jsx(IconButton, { size: "small", onClick: () => handleResetPasswordClick(user), disabled: user.is_deactivated, sx: {
                                                                        border: '1px solid #f59e0b',
                                                                        color: '#f59e0b',
                                                                        '&:hover': { bgcolor: '#fffbeb' },
                                                                        '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
                                                                    }, children: _jsx(LockReset, { fontSize: "small" }) }) }), user.is_deactivated ? (_jsx(Tooltip, { title: "Activate User", children: _jsx(IconButton, { size: "small", onClick: () => handleActivateUser(user), sx: {
                                                                        border: '1px solid #22c55e',
                                                                        color: '#22c55e',
                                                                        '&:hover': { bgcolor: '#f0fdf4' },
                                                                    }, children: _jsx(CheckCircle, { fontSize: "small" }) }) })) : (_jsx(Tooltip, { title: "Deactivate User", children: _jsx(IconButton, { size: "small", onClick: () => handleDeactivateClick(user), disabled: user.id === currentUser?.id, sx: {
                                                                        border: '1px solid #f87171',
                                                                        color: '#f87171',
                                                                        '&:hover': { bgcolor: '#fef2f2' },
                                                                        '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
                                                                    }, children: _jsx(Block, { fontSize: "small" }) }) })), _jsx(Tooltip, { title: "Delete Permanently", children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteClick(user), disabled: user.id === currentUser?.id, sx: {
                                                                        border: '1px solid #dc2626',
                                                                        color: '#dc2626',
                                                                        '&:hover': { bgcolor: '#fef2f2' },
                                                                        '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
                                                                    }, children: _jsx(Delete, { fontSize: "small" }) }) })] }) })] }, user.id)))) })] }) })] }) }), _jsxs(Dialog, { open: dialogOpen, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: editingUser ? 'Edit Admin User' : 'Add New Admin User' }), _jsxs(DialogContent, { children: [_jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "Creating admin users with access to the admin panel." }), _jsxs(Grid, { container: true, spacing: 2, sx: { pt: 1 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "First Name *", value: formFirstName, onChange: (e) => setFormFirstName(e.target.value) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Last Name *", value: formLastName, onChange: (e) => setFormLastName(e.target.value) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Designation", value: formDesignation, onChange: (e) => setFormDesignation(e.target.value), placeholder: "e.g., Manager, Developer" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Employee ID Number", value: formEmployeeId, onChange: (e) => setFormEmployeeId(e.target.value), placeholder: "e.g., EMP001" }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Email *", type: "email", value: formEmail, onChange: (e) => setFormEmail(e.target.value) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Username", value: formUsername, onChange: (e) => setFormUsername(e.target.value), placeholder: "Optional unique username" }) }), !editingUser && (_jsxs(_Fragment, { children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Password *", type: "password", value: formPassword, onChange: (e) => setFormPassword(e.target.value) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Confirm Password *", type: "password", value: formConfirmPassword, onChange: (e) => setFormConfirmPassword(e.target.value), error: formConfirmPassword !== '' && formPassword !== formConfirmPassword, helperText: formConfirmPassword !== '' && formPassword !== formConfirmPassword
                                                        ? 'Passwords do not match'
                                                        : '' }) })] }))] })] }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: handleCloseDialog, sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: !formEmail ||
                                    !formFirstName ||
                                    !formLastName ||
                                    (!editingUser && (!formPassword || formPassword !== formConfirmPassword)) ||
                                    createMutation.isPending ||
                                    updateMutation.isPending, sx: {
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                }, children: createMutation.isPending || updateMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : editingUser ? ('Update') : ('Create') })] })] }), _jsxs(Dialog, { open: resetPasswordDialogOpen, onClose: () => setResetPasswordDialogOpen(false), maxWidth: "xs", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: "Reset Password" }), _jsxs(DialogContent, { children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: ["Reset password for: ", _jsx("strong", { children: resetPasswordUser?.email })] }), _jsx(TextField, { fullWidth: true, label: "New Password", type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), sx: { mb: 2 } }), _jsx(TextField, { fullWidth: true, label: "Confirm New Password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), error: confirmPassword !== '' && newPassword !== confirmPassword, helperText: confirmPassword !== '' && newPassword !== confirmPassword
                                    ? 'Passwords do not match'
                                    : '' })] }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: () => setResetPasswordDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleConfirmResetPassword, disabled: !newPassword || newPassword !== confirmPassword || resetPasswordMutation.isPending, sx: {
                                    bgcolor: '#f59e0b',
                                    '&:hover': { bgcolor: '#d97706' },
                                }, children: resetPasswordMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Reset Password') })] })] }), _jsxs(Dialog, { open: deactivateDialogOpen, onClose: () => setDeactivateDialogOpen(false), children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: "Confirm Deactivation" }), _jsxs(DialogContent, { children: [_jsxs(Typography, { children: ["Are you sure you want to deactivate user \"", _jsx("strong", { children: deactivatingUser?.email }), "\"?"] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: "The user will not be able to log in but their data will be preserved. You can reactivate them later." })] }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: () => setDeactivateDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "error", onClick: handleConfirmDeactivate, disabled: deactivateMutation.isPending, children: deactivateMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Deactivate') })] })] }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), children: [_jsx(DialogTitle, { sx: { fontWeight: 600, color: '#dc2626' }, children: "\u26A0\uFE0F Permanent Delete" }), _jsxs(DialogContent, { children: [_jsxs(Typography, { children: ["Are you sure you want to ", _jsx("strong", { children: "permanently delete" }), " user \"", deletingUser?.email, "\"?"] }), _jsx(Alert, { severity: "error", sx: { mt: 2 }, children: "This action cannot be undone. Consider deactivating the user instead." })] }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: () => setDeleteDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "error", onClick: handleConfirmDelete, disabled: deleteMutation.isPending, children: deleteMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Delete Permanently') })] })] })] }));
}
