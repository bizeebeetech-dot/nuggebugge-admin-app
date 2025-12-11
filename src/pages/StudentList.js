import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Breadcrumbs, Link, TableSortLabel, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { Search, Logout, Person, KeyboardArrowDown, NavigateNext, } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { submissionService, taskService, } from '../services/submission.service';
const statusLabels = {
    submitted_for_evaluation: 'Submitted for evaluation',
    under_review: 'Under review',
    evaluated: 'Evaluated',
    rejected: 'Rejected',
};
const statusColors = {
    submitted_for_evaluation: '#f59e0b',
    under_review: '#3b82f6',
    evaluated: '#22c55e',
    rejected: '#ef4444',
};
export default function StudentList() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = authService.getUser();
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('submitted_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [anchorEl, setAnchorEl] = useState(null);
    const [evaluateDialogOpen, setEvaluateDialogOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [evaluationScore, setEvaluationScore] = useState('');
    const [evaluationRemarks, setEvaluationRemarks] = useState('');
    const open = Boolean(anchorEl);
    // Fetch task details
    const { data: task } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => taskService.getById(parseInt(taskId, 10)),
        enabled: !!taskId,
    });
    // Fetch submissions
    const { data: submissions = [], isLoading } = useQuery({
        queryKey: ['submissions', taskId, search],
        queryFn: () => submissionService.getByTask(parseInt(taskId, 10), search || undefined),
        enabled: !!taskId,
    });
    // Evaluate mutation
    const evaluateMutation = useMutation({
        mutationFn: ({ id, data, }) => submissionService.evaluate(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions', taskId] });
            setEvaluateDialogOpen(false);
            setSelectedSubmission(null);
            setEvaluationScore('');
            setEvaluationRemarks('');
        },
    });
    const handleSearch = () => {
        setSearch(searchInput);
    };
    const handleClearSearch = () => {
        setSearchInput('');
        setSearch('');
    };
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
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
    const handleEvaluateClick = (submission) => {
        setSelectedSubmission(submission);
        setEvaluationScore(submission.score?.toString() || '');
        setEvaluationRemarks(submission.remarks || '');
        setEvaluateDialogOpen(true);
    };
    const handleEvaluateSubmit = (status) => {
        if (!selectedSubmission)
            return;
        evaluateMutation.mutate({
            id: selectedSubmission.id,
            data: {
                evaluation_status: status,
                score: evaluationScore ? parseFloat(evaluationScore) : undefined,
                remarks: evaluationRemarks || undefined,
            },
        });
    };
    const getInitials = () => {
        if (!user)
            return '?';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
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
    // Sort submissions
    const sortedSubmissions = [...submissions].sort((a, b) => {
        let comparison = 0;
        if (sortField === 'app_code') {
            comparison = a.student.app_code.localeCompare(b.student.app_code);
        }
        else if (sortField === 'student_name') {
            const nameA = `${a.student.first_name} ${a.student.last_name}`;
            const nameB = `${b.student.first_name} ${b.student.last_name}`;
            comparison = nameA.localeCompare(nameB);
        }
        else if (sortField === 'submitted_at') {
            comparison = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
        }
        return sortDirection === 'asc' ? comparison : -comparison;
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Breadcrumbs, { separator: _jsx(NavigateNext, { fontSize: "small" }), sx: { mb: 2 }, children: [_jsxs(Link, { color: "primary", href: "#", onClick: (e) => {
                                    e.preventDefault();
                                    navigate('/tasks');
                                }, sx: { textDecoration: 'none', fontWeight: 500 }, children: [task?.activity?.points || 20, " POINT TASK LIST"] }), _jsxs(Typography, { color: "text.secondary", fontWeight: 500, children: [task?.activity?.points || 20, " STUDENT LIST"] })] }), _jsxs(Paper, { sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsxs(Box, { sx: { p: 3, borderBottom: '1px solid #e5e7eb' }, children: [_jsxs(Typography, { variant: "h6", sx: { fontWeight: 600, mb: 3 }, children: [task?.activity?.points || 20, " STUDENT LIST"] }), _jsxs(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }, children: [_jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(TextField, { size: "small", placeholder: "Search", value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), InputProps: {
                                                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, { sx: { color: 'rgba(0,0,0,0.4)' } }) })),
                                                        }, sx: { width: 250 } }), _jsx(Button, { variant: "contained", onClick: handleSearch, sx: {
                                                            bgcolor: '#6366f1',
                                                            '&:hover': { bgcolor: '#4f46e5' },
                                                            textTransform: 'none',
                                                        }, children: "Search" }), _jsx(Button, { variant: "contained", onClick: handleClearSearch, sx: {
                                                            bgcolor: '#475569',
                                                            '&:hover': { bgcolor: '#334155' },
                                                            textTransform: 'none',
                                                        }, children: "Clear" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 4, flexWrap: 'wrap', ml: 'auto' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Activity Name :" }), _jsx(Typography, { variant: "body1", fontWeight: 600, sx: { maxWidth: 350 }, children: task?.activity?.name || 'Loading...' })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Activity Type :" }), _jsxs(Typography, { variant: "body1", fontWeight: 600, children: [task?.activity?.points || 20, " Points"] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Task Number :" }), _jsx(Typography, { variant: "body1", fontWeight: 600, children: task?.task_number || 'Loading...' })] })] })] })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f8fafc' }, children: [_jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 60 }, children: "No" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: _jsx(TableSortLabel, { active: sortField === 'app_code', direction: sortField === 'app_code' ? sortDirection : 'asc', onClick: () => handleSort('app_code'), children: "App Code" }) }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: _jsx(TableSortLabel, { active: sortField === 'student_name', direction: sortField === 'student_name' ? sortDirection : 'asc', onClick: () => handleSort('student_name'), children: "Student Name" }) }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Submitted Date & Time" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Evaluation Status" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Click here to Evaluate" })] }) }), _jsx(TableBody, { children: isLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 32 }) }) })) : sortedSubmissions.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4, color: '#94a3b8' }, children: "No submissions found" }) })) : (sortedSubmissions.map((submission, index) => (_jsxs(TableRow, { sx: {
                                                    bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                                                    '&:hover': { bgcolor: '#e0f2fe' },
                                                }, children: [_jsx(TableCell, { sx: { color: '#3b82f6', fontWeight: 500 }, children: index + 1 }), _jsx(TableCell, { sx: { fontWeight: 500 }, children: submission.student.app_code }), _jsx(TableCell, { sx: { fontWeight: 500 }, children: `${submission.student.first_name} ${submission.student.last_name}`.toUpperCase() }), _jsx(TableCell, { children: formatDate(submission.submitted_at) }), _jsx(TableCell, { children: _jsx(Chip, { label: statusLabels[submission.evaluation_status], size: "small", sx: {
                                                                bgcolor: `${statusColors[submission.evaluation_status]}20`,
                                                                color: statusColors[submission.evaluation_status],
                                                                fontWeight: 500,
                                                            } }) }), _jsx(TableCell, { children: _jsx(Button, { variant: "outlined", size: "small", onClick: () => handleEvaluateClick(submission), sx: {
                                                                color: '#22c55e',
                                                                borderColor: '#22c55e',
                                                                textTransform: 'none',
                                                                '&:hover': {
                                                                    borderColor: '#16a34a',
                                                                    bgcolor: '#f0fdf4',
                                                                },
                                                            }, children: "Evaluate" }) })] }, submission.id)))) })] }) })] })] }), _jsxs(Dialog, { open: evaluateDialogOpen, onClose: () => setEvaluateDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: "Evaluate Submission" }), _jsx(DialogContent, { children: selectedSubmission && (_jsxs(Box, { sx: { pt: 1 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: ["Student: ", selectedSubmission.student.first_name, " ", selectedSubmission.student.last_name] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: ["App Code: ", selectedSubmission.student.app_code] }), _jsx(Divider, { sx: { my: 2 } }), _jsx(TextField, { fullWidth: true, label: "Score", type: "number", value: evaluationScore, onChange: (e) => setEvaluationScore(e.target.value), inputProps: { min: 0, max: task?.activity?.points || 20 }, sx: { mb: 2 } }), _jsx(TextField, { fullWidth: true, label: "Remarks", multiline: true, rows: 3, value: evaluationRemarks, onChange: (e) => setEvaluationRemarks(e.target.value) })] })) }), _jsxs(DialogActions, { sx: { px: 3, pb: 2, gap: 1 }, children: [_jsx(Button, { onClick: () => setEvaluateDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "error", onClick: () => handleEvaluateSubmit('rejected'), disabled: evaluateMutation.isPending, children: "Reject" }), _jsx(Button, { variant: "contained", onClick: () => handleEvaluateSubmit('evaluated'), disabled: evaluateMutation.isPending, sx: {
                                    bgcolor: '#22c55e',
                                    '&:hover': { bgcolor: '#16a34a' },
                                }, children: evaluateMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Approve') })] })] })] }));
}
