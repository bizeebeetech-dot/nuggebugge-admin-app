import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Switch, FormControlLabel, Alert, Snackbar, CircularProgress, Chip, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown, Add, Edit, Delete, ArrowBack, PhotoLibrary, } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService from '../services/website.service';
import MultiImageUpload from '../components/MultiImageUpload';
function WebsiteActivities() {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [activities, setActivities] = useState([]);
    const [activityDialog, setActivityDialog] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const acts = await websiteService.getActivityItems();
            setActivities(acts);
        }
        catch {
            showSnackbar('Failed to load data', 'error');
        }
        setLoading(false);
    };
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };
    const handleSaveActivity = async () => {
        if (!editingActivity)
            return;
        try {
            if (editingActivity.id) {
                await websiteService.updateActivityItem(editingActivity.id, editingActivity);
            }
            else {
                await websiteService.createActivityItem(editingActivity);
            }
            showSnackbar('Activity saved successfully', 'success');
            setActivityDialog(false);
            setEditingActivity(null);
            const acts = await websiteService.getActivityItems();
            setActivities(acts);
        }
        catch {
            showSnackbar('Failed to save activity', 'error');
        }
    };
    const handleDeleteActivity = async (id) => {
        if (!confirm('Delete this activity?'))
            return;
        try {
            await websiteService.deleteActivityItem(id);
            showSnackbar('Activity deleted', 'success');
            setActivities(activities.filter(a => a.id !== id));
        }
        catch {
            showSnackbar('Failed to delete', 'error');
        }
    };
    const getInitials = () => {
        if (!user)
            return '?';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: { bgcolor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }, children: "Page 2: List of Activities" })] }), _jsxs(IconButton, { onClick: (e) => setAnchorEl(e.currentTarget), sx: { borderRadius: 2, px: 1.5, py: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }, children: [_jsx(Avatar, { sx: { width: 36, height: 36, bgcolor: '#7877c6', fontSize: '0.9rem', fontWeight: 600 }, children: getInitials() }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: () => setAnchorEl(null), PaperProps: { sx: { mt: 1, minWidth: 200, bgcolor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', '& .MuiMenuItem-root': { color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } } } }, children: [_jsxs(MenuItem, { children: [_jsx(Person, { sx: { mr: 1.5 } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: () => authService.logout(), sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5 } }), "Logout"] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(Typography, { variant: "h5", children: "List of Activities" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => { setEditingActivity({ title: '', description: '', photo_urls: [], display_order: activities.length }); setActivityDialog(true); }, children: "Add Activity" })] }), _jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "Each activity includes text content (alphanumeric, special characters @#$%&*, hyperlinks) and photo attachments in a single form." }), _jsxs(Grid, { container: true, spacing: 3, children: [activities.map((activity) => (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Card, { sx: { height: '100%' }, children: [activity.photo_urls && activity.photo_urls.length > 0 && (_jsxs(Box, { sx: { display: 'flex', gap: 0.5, p: 1, bgcolor: '#f5f5f5', overflowX: 'auto' }, children: [activity.photo_urls.slice(0, 4).map((url, idx) => (_jsx(Box, { sx: {
                                                            width: 80,
                                                            height: 60,
                                                            flexShrink: 0,
                                                            borderRadius: 1,
                                                            backgroundImage: `url(${url})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        } }, idx))), activity.photo_urls.length > 4 && (_jsx(Box, { sx: { width: 80, height: 60, flexShrink: 0, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsxs(Typography, { color: "white", variant: "body2", children: ["+", activity.photo_urls.length - 4] }) }))] })), _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }, children: [_jsx(Typography, { variant: "h6", fontWeight: 600, children: activity.title }), _jsxs(Box, { sx: { display: 'flex', gap: 0.5 }, children: [_jsx(IconButton, { size: "small", onClick: () => { setEditingActivity(activity); setActivityDialog(true); }, children: _jsx(Edit, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDeleteActivity(activity.id), children: _jsx(Delete, { fontSize: "small" }) })] })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }, children: activity.description.replace(/<[^>]*>/g, '') }), _jsxs(Box, { sx: { display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }, children: [_jsx(Chip, { icon: _jsx(PhotoLibrary, {}), label: `${activity.photo_urls?.length || 0} photos`, size: "small", variant: "outlined" }), activity.activity_date && _jsx(Chip, { label: new Date(activity.activity_date).toLocaleDateString(), size: "small", variant: "outlined" }), activity.location && _jsx(Chip, { label: activity.location, size: "small", variant: "outlined" }), _jsx(Chip, { label: activity.is_active ? 'Active' : 'Inactive', color: activity.is_active ? 'success' : 'default', size: "small" })] })] })] }) }, activity.id))), activities.length === 0 && (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Card, { sx: { p: 4, textAlign: 'center' }, children: [_jsx(PhotoLibrary, { sx: { fontSize: 48, color: 'grey.400', mb: 2 } }), _jsx(Typography, { color: "text.secondary", children: "No activities added yet." }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Click \"Add Activity\" to create your first activity with text and photos." }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => { setEditingActivity({ title: '', description: '', photo_urls: [], display_order: 0 }); setActivityDialog(true); }, children: "Add Activity" })] }) }))] })] }) }), _jsxs(Dialog, { open: activityDialog, onClose: () => setActivityDialog(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: editingActivity?.id ? 'Edit Activity' : 'Add New Activity' }), _jsxs(DialogContent, { children: [_jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "Add activity details with text content and photos together." }), _jsx(TextField, { fullWidth: true, label: "Activity Title", value: editingActivity?.title || '', onChange: (e) => setEditingActivity({ ...editingActivity, title: e.target.value }), margin: "normal", required: true }), _jsx(TextField, { fullWidth: true, label: "Description / Text Content", value: editingActivity?.description || '', onChange: (e) => setEditingActivity({ ...editingActivity, description: e.target.value }), margin: "normal", multiline: true, rows: 6, required: true, helperText: "Supports alphanumeric, special characters (@#$%&*), and hyperlinks using HTML: <a href='url'>link text</a>" }), _jsx(Divider, { sx: { my: 3 } }), _jsx(MultiImageUpload, { values: editingActivity?.photo_urls || [], onChange: (urls) => setEditingActivity({ ...editingActivity, photo_urls: urls }), label: "Photo Attachments", maxImages: 10 }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Activity Date (optional)", type: "date", value: editingActivity?.activity_date ? new Date(editingActivity.activity_date).toISOString().split('T')[0] : '', onChange: (e) => setEditingActivity({ ...editingActivity, activity_date: e.target.value }), InputLabelProps: { shrink: true } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Location (optional)", value: editingActivity?.location || '', onChange: (e) => setEditingActivity({ ...editingActivity, location: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Display Order", type: "number", value: editingActivity?.display_order || 0, onChange: (e) => setEditingActivity({ ...editingActivity, display_order: parseInt(e.target.value) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: editingActivity?.is_active ?? true, onChange: (e) => setEditingActivity({ ...editingActivity, is_active: e.target.checked }) }), label: "Active", sx: { mt: 1 } }) })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setActivityDialog(false), children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSaveActivity, disabled: !editingActivity?.title || !editingActivity?.description, children: "Save Activity" })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 4000, onClose: () => setSnackbar({ ...snackbar, open: false }), children: _jsx(Alert, { severity: snackbar.severity, children: snackbar.message }) })] }));
}
export default WebsiteActivities;
