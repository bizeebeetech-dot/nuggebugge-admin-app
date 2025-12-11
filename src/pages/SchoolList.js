import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, FormControl, InputLabel, Select, Grid, Chip, Alert, } from '@mui/material';
import { Search, Logout, Person, KeyboardArrowDown, Add, Edit, Delete, ArrowBack, School as SchoolIcon, } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import schoolService from '../services/school.service';
export default function SchoolList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = authService.getUser();
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState(null);
    const [deletingSchool, setDeletingSchool] = useState(null);
    // Form state
    const [formName, setFormName] = useState('');
    const [formStateId, setFormStateId] = useState('');
    const [formDistrictId, setFormDistrictId] = useState('');
    const [formBoardId, setFormBoardId] = useState('');
    const open = Boolean(anchorEl);
    // Fetch schools
    const { data: schools = [], isLoading } = useQuery({
        queryKey: ['schools', search],
        queryFn: () => schoolService.getAll(search || undefined),
    });
    // Fetch dropdowns using React Query
    const { data: dropdowns, isLoading: dropdownsLoading } = useQuery({
        queryKey: ['school-dropdowns'],
        queryFn: () => schoolService.getDropdowns(),
    });
    // Filtered districts based on selected state
    const filteredDistricts = dropdowns?.districts?.filter(d => !formStateId || d.state_id === formStateId) || [];
    // Reset district if state changes and current district doesn't belong to new state
    useEffect(() => {
        if (formStateId && formDistrictId && dropdowns?.districts) {
            const districtBelongsToState = dropdowns.districts.some(d => d.id === formDistrictId && d.state_id === formStateId);
            if (!districtBelongsToState) {
                setFormDistrictId('');
            }
        }
    }, [formStateId, formDistrictId, dropdowns?.districts]);
    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => schoolService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schools'] });
            handleCloseDialog();
        },
    });
    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => schoolService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schools'] });
            handleCloseDialog();
        },
    });
    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => schoolService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schools'] });
            setDeleteDialogOpen(false);
            setDeletingSchool(null);
        },
    });
    const resetForm = () => {
        setFormName('');
        setFormStateId('');
        setFormDistrictId('');
        setFormBoardId('');
        setEditingSchool(null);
    };
    const handleSearch = () => {
        setSearch(searchInput);
    };
    const handleClearSearch = () => {
        setSearchInput('');
        setSearch('');
    };
    const handleOpenDialog = (school) => {
        if (school) {
            setEditingSchool(school);
            setFormName(school.name);
            setFormStateId(school.state_id || '');
            setFormDistrictId(school.district_id || '');
            setFormBoardId(school.board_id || '');
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
        if (!formName.trim())
            return;
        const data = {
            name: formName.trim(),
            state_id: formStateId || undefined,
            district_id: formDistrictId || undefined,
            board_id: formBoardId || undefined,
        };
        if (editingSchool) {
            updateMutation.mutate({ id: editingSchool.id, data });
        }
        else {
            createMutation.mutate(data);
        }
    };
    const handleDeleteClick = (school) => {
        setDeletingSchool(school);
        setDeleteDialogOpen(true);
    };
    const handleConfirmDelete = () => {
        if (deletingSchool) {
            deleteMutation.mutate(deletingSchool.id);
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
        if (!user)
            return '?';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };
    const noDropdownData = !dropdownsLoading &&
        (!dropdowns?.states?.length && !dropdowns?.districts?.length && !dropdowns?.boards?.length);
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: {
                    bgcolor: '#1a1a2e',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: {
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }, children: "Schools Management" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsxs(IconButton, { onClick: handleMenuOpen, sx: {
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
                                    }, children: [_jsxs(MenuItem, { onClick: handleMenuClose, children: [_jsx(Person, { sx: { mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: handleLogout, sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5, fontSize: '1.2rem' } }), "Logout"] })] })] })] }) }), _jsxs(Box, { sx: { p: 3 }, children: [noDropdownData && (_jsxs(Alert, { severity: "info", sx: { mb: 3 }, children: [_jsx("strong", { children: "No dropdown data available." }), " Please add States, Districts, and School Boards in the \"Add Entities\" page first."] })), _jsxs(Paper, { sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsxs(Box, { sx: { p: 3, borderBottom: '1px solid #e5e7eb' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "LIST OF SCHOOLS" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Manage schools with state, district, and board information" })] }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => handleOpenDialog(), sx: {
                                                    bgcolor: '#22c55e',
                                                    '&:hover': { bgcolor: '#16a34a' },
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }, children: "Add School" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(TextField, { size: "small", placeholder: "Search by school name, state, district, or board...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), InputProps: {
                                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, { sx: { color: 'rgba(0,0,0,0.4)' } }) })),
                                                }, sx: { width: 400 } }), _jsx(Button, { variant: "contained", onClick: handleSearch, sx: {
                                                    bgcolor: '#6366f1',
                                                    '&:hover': { bgcolor: '#4f46e5' },
                                                    textTransform: 'none',
                                                }, children: "Search" }), _jsx(Button, { variant: "contained", onClick: handleClearSearch, sx: {
                                                    bgcolor: '#475569',
                                                    '&:hover': { bgcolor: '#334155' },
                                                    textTransform: 'none',
                                                }, children: "Clear" })] })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f8fafc' }, children: [_jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 60 }, children: "No" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "School Name" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "State" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "District" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "Board" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 100 }, children: "Status" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 120 }, children: "Actions" })] }) }), _jsx(TableBody, { children: isLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 32 }) }) })) : schools.length === 0 ? (_jsx(TableRow, { children: _jsxs(TableCell, { colSpan: 7, align: "center", sx: { py: 4 }, children: [_jsx(SchoolIcon, { sx: { fontSize: 48, color: 'grey.400', mb: 1 } }), _jsx(Typography, { color: "text.secondary", children: "No schools found" }), _jsx(Button, { variant: "text", startIcon: _jsx(Add, {}), onClick: () => handleOpenDialog(), sx: { mt: 1 }, children: "Add your first school" })] }) })) : (schools.map((school, index) => (_jsxs(TableRow, { sx: {
                                                    bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                                                    '&:hover': { bgcolor: '#e0f2fe' },
                                                }, children: [_jsx(TableCell, { sx: { color: '#3b82f6', fontWeight: 500 }, children: index + 1 }), _jsx(TableCell, { sx: { fontWeight: 500 }, children: school.name }), _jsx(TableCell, { children: school.state_name || '-' }), _jsx(TableCell, { children: school.district_name || '-' }), _jsx(TableCell, { children: school.board_name || '-' }), _jsx(TableCell, { children: _jsx(Chip, { label: school.is_active ? 'Active' : 'Inactive', color: school.is_active ? 'success' : 'default', size: "small" }) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => handleOpenDialog(school), sx: {
                                                                            border: '1px solid #22d3ee',
                                                                            color: '#22d3ee',
                                                                            '&:hover': { bgcolor: '#ecfeff' },
                                                                        }, children: _jsx(Edit, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteClick(school), sx: {
                                                                            border: '1px solid #f87171',
                                                                            color: '#f87171',
                                                                            '&:hover': { bgcolor: '#fef2f2' },
                                                                        }, children: _jsx(Delete, { fontSize: "small" }) }) })] }) })] }, school.id)))) })] }) })] })] }), _jsxs(Dialog, { open: dialogOpen, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: editingSchool ? 'Edit School' : 'Add New School' }), _jsx(DialogContent, { children: dropdownsLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(Grid, { container: true, spacing: 2, sx: { pt: 1 }, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "School Name *", value: formName, onChange: (e) => setFormName(e.target.value), placeholder: "Enter school name" }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "State" }), _jsxs(Select, { value: formStateId, label: "State", onChange: (e) => setFormStateId(e.target.value), children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "Select State" }) }), dropdowns?.states?.map((state) => (_jsx(MenuItem, { value: state.id, children: state.name }, state.id)))] }), !dropdowns?.states?.length && (_jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 0.5 }, children: "No states available. Add states in \"Add Entities\" page." }))] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "District" }), _jsxs(Select, { value: formDistrictId, label: "District", onChange: (e) => setFormDistrictId(e.target.value), children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "Select District" }) }), filteredDistricts.map((district) => (_jsx(MenuItem, { value: district.id, children: district.name }, district.id)))] }), !dropdowns?.districts?.length && (_jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 0.5 }, children: "No districts available. Add districts in \"Add Entities\" page." }))] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Board" }), _jsxs(Select, { value: formBoardId, label: "Board", onChange: (e) => setFormBoardId(e.target.value), children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "Select Board" }) }), dropdowns?.boards?.map((board) => (_jsx(MenuItem, { value: board.id, children: board.name }, board.id)))] }), !dropdowns?.boards?.length && (_jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 0.5 }, children: "No boards available. Add school boards in \"Add Entities\" page." }))] }) })] })) }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: handleCloseDialog, sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: !formName.trim() ||
                                    createMutation.isPending ||
                                    updateMutation.isPending, sx: {
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                }, children: createMutation.isPending || updateMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : editingSchool ? ('Update') : ('Add School') })] })] }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: "Confirm Delete" }), _jsxs(DialogContent, { children: [_jsxs(Typography, { children: ["Are you sure you want to delete school \"", _jsx("strong", { children: deletingSchool?.name }), "\"?"] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: "This action cannot be undone." })] }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: () => setDeleteDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "error", onClick: handleConfirmDelete, disabled: deleteMutation.isPending, children: deleteMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Delete') })] })] })] }));
}
