import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, } from '@mui/material';
import { Search, Logout, Person, KeyboardArrowDown, Add, Visibility, } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { activityService, taskService } from '../services/submission.service';
export default function TaskList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = authService.getUser();
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [taskNumber, setTaskNumber] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const open = Boolean(anchorEl);
    // Fetch activities
    const { data: activities = [] } = useQuery({
        queryKey: ['activities'],
        queryFn: () => activityService.getAll(),
    });
    // Fetch tasks
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['tasks', search],
        queryFn: () => taskService.getAll(),
    });
    // Create task mutation
    const createTaskMutation = useMutation({
        mutationFn: (data) => taskService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setDialogOpen(false);
            resetForm();
        },
    });
    const resetForm = () => {
        setSelectedActivity('');
        setTaskNumber('');
        setTaskTitle('');
        setTaskDescription('');
    };
    const handleSearch = () => {
        setSearch(searchInput);
    };
    const handleClearSearch = () => {
        setSearchInput('');
        setSearch('');
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
    const handleCreateTask = () => {
        if (!selectedActivity || !taskNumber || !taskTitle)
            return;
        createTaskMutation.mutate({
            activity_id: selectedActivity,
            task_number: taskNumber,
            title: taskTitle,
            description: taskDescription,
        });
    };
    const getInitials = () => {
        if (!user)
            return '?';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };
    // Filter tasks by search
    const filteredTasks = tasks.filter((task) => {
        if (!search)
            return true;
        const searchLower = search.toLowerCase();
        return (task.task_number.toLowerCase().includes(searchLower) ||
            task.title.toLowerCase().includes(searchLower) ||
            task.activity?.name?.toLowerCase().includes(searchLower));
    });
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Paper, { sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsxs(Box, { sx: { p: 3, borderBottom: '1px solid #e5e7eb' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "TASK LIST" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => setDialogOpen(true), sx: {
                                                bgcolor: '#22c55e',
                                                '&:hover': { bgcolor: '#16a34a' },
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }, children: "Add Task" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(TextField, { size: "small", placeholder: "Search tasks...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, { sx: { color: 'rgba(0,0,0,0.4)' } }) })),
                                            }, sx: { width: 300 } }), _jsx(Button, { variant: "contained", onClick: handleSearch, sx: {
                                                bgcolor: '#6366f1',
                                                '&:hover': { bgcolor: '#4f46e5' },
                                                textTransform: 'none',
                                            }, children: "Search" }), _jsx(Button, { variant: "contained", onClick: handleClearSearch, sx: {
                                                bgcolor: '#475569',
                                                '&:hover': { bgcolor: '#334155' },
                                                textTransform: 'none',
                                            }, children: "Clear" })] })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f8fafc' }, children: [_jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 60 }, children: "No" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Activity Name" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Points" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Task Number" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Task Title" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Actions" })] }) }), _jsx(TableBody, { children: isLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 32 }) }) })) : filteredTasks.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4, color: '#94a3b8' }, children: "No tasks found" }) })) : (filteredTasks.map((task, index) => (_jsxs(TableRow, { sx: {
                                                bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                                                '&:hover': { bgcolor: '#e0f2fe' },
                                            }, children: [_jsx(TableCell, { sx: { color: '#3b82f6', fontWeight: 500 }, children: index + 1 }), _jsx(TableCell, { sx: { fontWeight: 500, maxWidth: 300 }, children: task.activity?.name || 'N/A' }), _jsxs(TableCell, { children: [task.activity?.points || 20, " Points"] }), _jsx(TableCell, { sx: { fontWeight: 500 }, children: task.task_number }), _jsx(TableCell, { children: task.title }), _jsx(TableCell, { children: _jsx(Button, { variant: "outlined", size: "small", startIcon: _jsx(Visibility, {}), onClick: () => navigate(`/tasks/${task.id}/students`), sx: {
                                                            color: '#3b82f6',
                                                            borderColor: '#3b82f6',
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                                borderColor: '#2563eb',
                                                                bgcolor: '#eff6ff',
                                                            },
                                                        }, children: "View Students" }) })] }, task.id)))) })] }) })] }) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: "Add New Task" }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Activity" }), _jsx(Select, { value: selectedActivity, label: "Activity", onChange: (e) => setSelectedActivity(e.target.value), children: activities.map((activity) => (_jsxs(MenuItem, { value: activity.id, children: [activity.name, " (", activity.points, " Points)"] }, activity.id))) })] }), _jsx(TextField, { fullWidth: true, label: "Task Number", placeholder: "e.g., task_1", value: taskNumber, onChange: (e) => setTaskNumber(e.target.value) }), _jsx(TextField, { fullWidth: true, label: "Task Title", value: taskTitle, onChange: (e) => setTaskTitle(e.target.value) }), _jsx(TextField, { fullWidth: true, label: "Description", multiline: true, rows: 3, value: taskDescription, onChange: (e) => setTaskDescription(e.target.value) })] }) }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: () => setDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleCreateTask, disabled: !selectedActivity || !taskNumber || !taskTitle || createTaskMutation.isPending, sx: {
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                }, children: createTaskMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Create Task') })] })] })] }));
}
