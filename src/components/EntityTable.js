import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Switch, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, InputAdornment, TableSortLabel, Tooltip, CircularProgress, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import { Edit, Delete, Search, Add, } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import entityService from '../services/entity.service';
export default function EntityTable({ entityType, title }) {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState(null);
    const [deletingEntity, setDeletingEntity] = useState(null);
    const [entityName, setEntityName] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    // Fetch entities
    const { data: entities = [], isLoading } = useQuery({
        queryKey: ['entities', entityType, search],
        queryFn: () => entityService.getAll(entityType, search || undefined),
    });
    // Fetch states for district dropdown
    const { data: states = [] } = useQuery({
        queryKey: ['entities', 'state'],
        queryFn: () => entityService.getAll('state'),
        enabled: entityType === 'district', // Only fetch when on district tab
    });
    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => entityService.create(entityType, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
            queryClient.invalidateQueries({ queryKey: ['school-dropdowns'] }); // Refresh school dropdowns
            handleCloseDialog();
        },
    });
    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => entityService.update(entityType, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
            queryClient.invalidateQueries({ queryKey: ['school-dropdowns'] }); // Refresh school dropdowns
            handleCloseDialog();
        },
    });
    // Toggle active mutation
    const toggleMutation = useMutation({
        mutationFn: (id) => entityService.toggleActive(entityType, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
        },
    });
    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => entityService.delete(entityType, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
            queryClient.invalidateQueries({ queryKey: ['school-dropdowns'] }); // Refresh school dropdowns
            setDeleteDialogOpen(false);
            setDeletingEntity(null);
        },
    });
    const handleSearch = () => {
        setSearch(searchInput);
    };
    const handleClearSearch = () => {
        setSearchInput('');
        setSearch('');
    };
    const handleOpenDialog = (entity) => {
        if (entity) {
            setEditingEntity(entity);
            setEntityName(entity.name);
            setSelectedStateId(entity.state_id || '');
        }
        else {
            setEditingEntity(null);
            setEntityName('');
            setSelectedStateId('');
        }
        setDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingEntity(null);
        setEntityName('');
        setSelectedStateId('');
    };
    const handleSubmit = () => {
        if (!entityName.trim())
            return;
        const data = {
            name: entityName.trim(),
        };
        // Include state_id for districts
        if (entityType === 'district' && selectedStateId) {
            data.state_id = selectedStateId;
        }
        if (editingEntity) {
            updateMutation.mutate({ id: editingEntity.id, data });
        }
        else {
            createMutation.mutate(data);
        }
    };
    const handleDeleteClick = (entity) => {
        setDeletingEntity(entity);
        setDeleteDialogOpen(true);
    };
    const handleConfirmDelete = () => {
        if (deletingEntity) {
            deleteMutation.mutate(deletingEntity.id);
        }
    };
    const handleSort = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };
    // Get state name by ID
    const getStateName = (stateId) => {
        if (!stateId)
            return '-';
        const state = states.find(s => String(s.id) === stateId);
        return state?.name || '-';
    };
    // Sort entities
    const sortedEntities = [...entities].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? comparison : -comparison;
    });
    // Check if we need to show state column (for districts)
    const showStateColumn = entityType === 'district';
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color: '#1a1a2e' }, children: title.toUpperCase() }), _jsxs(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => handleOpenDialog(), sx: {
                            bgcolor: '#22c55e',
                            '&:hover': { bgcolor: '#16a34a' },
                            textTransform: 'none',
                            fontWeight: 600,
                        }, children: ["Add ", title] })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1, mb: 3 }, children: [_jsx(TextField, { size: "small", placeholder: `Search ${title.toLowerCase()}...`, value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, { sx: { color: 'rgba(0,0,0,0.4)' } }) })),
                        }, sx: { width: 250 } }), _jsx(Button, { variant: "contained", onClick: handleSearch, sx: {
                            bgcolor: '#6366f1',
                            '&:hover': { bgcolor: '#4f46e5' },
                            textTransform: 'none',
                        }, children: "Search" }), _jsx(Button, { variant: "contained", onClick: handleClearSearch, sx: {
                            bgcolor: '#475569',
                            '&:hover': { bgcolor: '#334155' },
                            textTransform: 'none',
                        }, children: "Clear" })] }), _jsx(TableContainer, { component: Paper, sx: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f8fafc' }, children: [_jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 80 }, children: "No" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: _jsx(TableSortLabel, { active: true, direction: sortDirection, onClick: handleSort, children: "Name" }) }), showStateColumn && (_jsx(TableCell, { sx: { fontWeight: 600, color: '#475569' }, children: "State" })), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 100 }, children: "Status" }), _jsx(TableCell, { sx: { fontWeight: 600, color: '#475569', width: 150 }, children: "Actions" })] }) }), _jsx(TableBody, { children: isLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: showStateColumn ? 5 : 4, align: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 32 }) }) })) : sortedEntities.length === 0 ? (_jsx(TableRow, { children: _jsxs(TableCell, { colSpan: showStateColumn ? 5 : 4, align: "center", sx: { py: 4, color: '#94a3b8' }, children: ["No ", title.toLowerCase(), "s found. Click \"Add ", title, "\" to create one."] }) })) : (sortedEntities.map((entity, index) => (_jsxs(TableRow, { sx: {
                                    bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                                    '&:hover': { bgcolor: '#e0f2fe' },
                                }, children: [_jsx(TableCell, { sx: { color: '#3b82f6', fontWeight: 500 }, children: index + 1 }), _jsx(TableCell, { sx: { fontWeight: 500 }, children: entity.name }), showStateColumn && (_jsx(TableCell, { children: getStateName(entity.state_id) })), _jsx(TableCell, { children: _jsx(Tooltip, { title: entity.is_active ? 'Active' : 'Inactive', children: _jsx(Switch, { checked: entity.is_active, onChange: () => toggleMutation.mutate(entity.id), size: "small", sx: {
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#22c55e',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        bgcolor: '#22c55e',
                                                    },
                                                } }) }) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => handleOpenDialog(entity), sx: {
                                                            border: '1px solid #22d3ee',
                                                            color: '#22d3ee',
                                                            '&:hover': { bgcolor: '#ecfeff' },
                                                        }, children: _jsx(Edit, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteClick(entity), sx: {
                                                            border: '1px solid #f87171',
                                                            color: '#f87171',
                                                            '&:hover': { bgcolor: '#fef2f2' },
                                                        }, children: _jsx(Delete, { fontSize: "small" }) }) })] }) })] }, entity.id)))) })] }) }), _jsxs(Dialog, { open: dialogOpen, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: editingEntity ? `Edit ${title}` : `Add New ${title}` }), _jsxs(DialogContent, { children: [_jsx(TextField, { autoFocus: true, fullWidth: true, label: "Name", value: entityName, onChange: (e) => setEntityName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && !showStateColumn && handleSubmit(), placeholder: `Enter ${title.toLowerCase()} name`, sx: { mt: 2 } }), showStateColumn && (_jsxs(FormControl, { fullWidth: true, sx: { mt: 2 }, children: [_jsx(InputLabel, { children: "State" }), _jsxs(Select, { value: selectedStateId, label: "State", onChange: (e) => setSelectedStateId(e.target.value), children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "Select State" }) }), states.map((state) => (_jsx(MenuItem, { value: String(state.id), children: state.name }, state.id)))] }), states.length === 0 && (_jsx(Typography, { variant: "caption", color: "error", sx: { mt: 0.5 }, children: "No states available. Please add states first." }))] }))] }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: handleCloseDialog, sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", disabled: !entityName.trim() || createMutation.isPending || updateMutation.isPending, sx: {
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                }, children: createMutation.isPending || updateMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : editingEntity ? ('Update') : ('Add') })] })] }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: "Confirm Delete" }), _jsxs(DialogContent, { children: [_jsxs(Typography, { children: ["Are you sure you want to delete \"", deletingEntity?.name, "\"?"] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: "This action cannot be undone." })] }), _jsxs(DialogActions, { sx: { px: 3, pb: 2 }, children: [_jsx(Button, { onClick: () => setDeleteDialogOpen(false), sx: { color: '#64748b' }, children: "Cancel" }), _jsx(Button, { onClick: handleConfirmDelete, variant: "contained", color: "error", disabled: deleteMutation.isPending, children: deleteMutation.isPending ? (_jsx(CircularProgress, { size: 20, sx: { color: '#fff' } })) : ('Delete') })] })] })] }));
}
