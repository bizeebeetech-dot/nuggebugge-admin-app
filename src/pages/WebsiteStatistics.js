import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Switch, FormControlLabel, Alert, Snackbar, CircularProgress, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Rating, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown, Add, Edit, Delete, ArrowBack, Star, BarChart, } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService from '../services/website.service';
function WebsiteStatistics() {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [statisticsContent, setStatisticsContent] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [contentDialog, setContentDialog] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [content, fb] = await Promise.all([
                websiteService.getStatisticsPageContent(),
                websiteService.getAllFeedbacks(),
            ]);
            setStatisticsContent(content);
            setFeedbacks(fb);
        }
        catch {
            showSnackbar('Failed to load data', 'error');
        }
        setLoading(false);
    };
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };
    const handleSaveContent = async () => {
        if (!editingContent)
            return;
        try {
            if (editingContent.id) {
                await websiteService.updateStatisticsPageContent(editingContent.id, editingContent);
            }
            else {
                await websiteService.createStatisticsPageContent(editingContent);
            }
            showSnackbar('Content saved successfully', 'success');
            setContentDialog(false);
            setEditingContent(null);
            const content = await websiteService.getStatisticsPageContent();
            setStatisticsContent(content);
        }
        catch {
            showSnackbar('Failed to save content', 'error');
        }
    };
    const handleDeleteContent = async (id) => {
        if (!confirm('Delete this content?'))
            return;
        try {
            await websiteService.deleteStatisticsPageContent(id);
            showSnackbar('Content deleted', 'success');
            setStatisticsContent(statisticsContent.filter(c => c.id !== id));
        }
        catch {
            showSnackbar('Failed to delete', 'error');
        }
    };
    const handleToggleApproval = async (feedback) => {
        try {
            await websiteService.updateFeedback(feedback.id, { is_approved: !feedback.is_approved });
            setFeedbacks(feedbacks.map(f => f.id === feedback.id ? { ...f, is_approved: !f.is_approved } : f));
            showSnackbar(`Feedback ${!feedback.is_approved ? 'approved' : 'unapproved'}`, 'success');
        }
        catch {
            showSnackbar('Failed to update feedback', 'error');
        }
    };
    const handleToggleFeatured = async (feedback) => {
        try {
            await websiteService.updateFeedback(feedback.id, { is_featured: !feedback.is_featured });
            setFeedbacks(feedbacks.map(f => f.id === feedback.id ? { ...f, is_featured: !f.is_featured } : f));
            showSnackbar(`Feedback ${!feedback.is_featured ? 'featured' : 'unfeatured'}`, 'success');
        }
        catch {
            showSnackbar('Failed to update feedback', 'error');
        }
    };
    const handleDeleteFeedback = async (id) => {
        if (!confirm('Delete this feedback?'))
            return;
        try {
            await websiteService.deleteFeedback(id);
            showSnackbar('Feedback deleted', 'success');
            setFeedbacks(feedbacks.filter(f => f.id !== id));
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
    const approvedCount = feedbacks.filter(f => f.is_approved).length;
    const avgRating = feedbacks.length > 0
        ? feedbacks.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / feedbacks.filter(f => f.rating).length
        : 0;
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: { bgcolor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }, children: "Page 4: Statistics" })] }), _jsxs(IconButton, { onClick: (e) => setAnchorEl(e.currentTarget), sx: { borderRadius: 2, px: 1.5, py: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }, children: [_jsx(Avatar, { sx: { width: 36, height: 36, bgcolor: '#7877c6', fontSize: '0.9rem', fontWeight: 600 }, children: getInitials() }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: () => setAnchorEl(null), PaperProps: { sx: { mt: 1, minWidth: 200, bgcolor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', '& .MuiMenuItem-root': { color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } } } }, children: [_jsxs(MenuItem, { children: [_jsx(Person, { sx: { mr: 1.5 } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: () => authService.logout(), sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5 } }), "Logout"] })] })] }) }), _jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { mb: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(Typography, { variant: "h5", children: "Statistics Page - Text Content" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => { setEditingContent({ text_content: '', display_order: statisticsContent.length }); setContentDialog(true); }, children: "Add Text Content" })] }), _jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "Add statistics page text content. Supports alphanumeric, special characters (@#$%&*), and hyperlinks." }), statisticsContent.map((content) => (_jsx(Card, { sx: { mb: 2 }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: [_jsxs(Box, { sx: { flex: 1 }, children: [_jsx(Typography, { variant: "body2", sx: {
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            bgcolor: '#f5f5f5',
                                                            p: 2,
                                                            borderRadius: 1
                                                        }, children: content.text_content?.replace(/<[^>]*>/g, '') || 'No content' }), _jsx(Box, { sx: { mt: 1 }, children: _jsx(Chip, { label: content.is_active ? 'Active' : 'Inactive', color: content.is_active ? 'success' : 'default', size: "small" }) })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1, ml: 2 }, children: [_jsx(IconButton, { size: "small", onClick: () => { setEditingContent(content); setContentDialog(true); }, children: _jsx(Edit, {}) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDeleteContent(content.id), children: _jsx(Delete, {}) })] })] }) }) }, content.id))), statisticsContent.length === 0 && (_jsxs(Card, { sx: { p: 4, textAlign: 'center' }, children: [_jsx(BarChart, { sx: { fontSize: 48, color: 'grey.400', mb: 2 } }), _jsx(Typography, { color: "text.secondary", children: "No text content added yet." })] }))] }), _jsx(Divider, { sx: { my: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "Feedback from APP (Scrolling Window)" }), _jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "Approved feedbacks will be displayed in a scrolling window on the website. Toggle approval to show/hide feedbacks." }), _jsxs(Box, { sx: { display: 'flex', gap: 2, mb: 3 }, children: [_jsx(Card, { sx: { flex: 1 }, children: _jsxs(CardContent, { sx: { textAlign: 'center' }, children: [_jsx(Typography, { variant: "h3", color: "primary", children: feedbacks.length }), _jsx(Typography, { color: "text.secondary", children: "Total Feedbacks" })] }) }), _jsx(Card, { sx: { flex: 1 }, children: _jsxs(CardContent, { sx: { textAlign: 'center' }, children: [_jsx(Typography, { variant: "h3", color: "success.main", children: approvedCount }), _jsx(Typography, { color: "text.secondary", children: "Approved" })] }) }), _jsx(Card, { sx: { flex: 1 }, children: _jsxs(CardContent, { sx: { textAlign: 'center' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }, children: [_jsx(Typography, { variant: "h3", color: "warning.main", children: avgRating.toFixed(1) }), _jsx(Star, { sx: { color: '#f59e0b', fontSize: 32 } })] }), _jsx(Typography, { color: "text.secondary", children: "Avg Rating" })] }) })] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "All Feedbacks" }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "User" }), _jsx(TableCell, { children: "Feedback" }), _jsx(TableCell, { children: "Rating" }), _jsx(TableCell, { children: "Source" }), _jsx(TableCell, { children: "Date" }), _jsx(TableCell, { children: "Approved" }), _jsx(TableCell, { children: "Featured" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsxs(TableBody, { children: [feedbacks.map((feedback) => (_jsxs(TableRow, { sx: { bgcolor: feedback.is_approved ? 'rgba(46, 160, 67, 0.05)' : 'inherit' }, children: [_jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", fontWeight: 500, children: feedback.user_name || 'Anonymous' }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: feedback.user_email || '-' })] }), _jsx(TableCell, { sx: { maxWidth: 300 }, children: _jsxs(Typography, { variant: "body2", sx: { whiteSpace: 'pre-wrap' }, children: [feedback.feedback_text.substring(0, 100), feedback.feedback_text.length > 100 && '...'] }) }), _jsx(TableCell, { children: _jsx(Rating, { value: feedback.rating || 0, readOnly: true, size: "small" }) }), _jsx(TableCell, { children: _jsx(Chip, { label: feedback.source || 'unknown', size: "small", variant: "outlined" }) }), _jsx(TableCell, { children: _jsx(Typography, { variant: "caption", children: new Date(feedback.created_at).toLocaleDateString() }) }), _jsx(TableCell, { children: _jsx(Switch, { checked: feedback.is_approved, onChange: () => handleToggleApproval(feedback), color: "success" }) }), _jsx(TableCell, { children: _jsx(Switch, { checked: feedback.is_featured, onChange: () => handleToggleFeatured(feedback), color: "warning" }) }), _jsx(TableCell, { children: _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDeleteFeedback(feedback.id), children: _jsx(Delete, {}) }) })] }, feedback.id))), feedbacks.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, align: "center", sx: { py: 4 }, children: "No feedbacks received yet." }) }))] })] }) })] })] }), _jsxs(Dialog, { open: contentDialog, onClose: () => setContentDialog(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: editingContent?.id ? 'Edit Content' : 'Add Content' }), _jsxs(DialogContent, { children: [_jsx(TextField, { fullWidth: true, label: "Text Content (supports HTML, special chars @#$%&*, hyperlinks)", value: editingContent?.text_content || '', onChange: (e) => setEditingContent({ ...editingContent, text_content: e.target.value }), margin: "normal", multiline: true, rows: 8, helperText: "Use <a href='url'>link text</a> for hyperlinks" }), _jsxs(Grid, { container: true, spacing: 2, sx: { mt: 1 }, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Display Order", type: "number", value: editingContent?.display_order || 0, onChange: (e) => setEditingContent({ ...editingContent, display_order: parseInt(e.target.value) }) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: editingContent?.is_active ?? true, onChange: (e) => setEditingContent({ ...editingContent, is_active: e.target.checked }) }), label: "Active", sx: { mt: 1 } }) })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setContentDialog(false), children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSaveContent, children: "Save" })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 4000, onClose: () => setSnackbar({ ...snackbar, open: false }), children: _jsx(Alert, { severity: snackbar.severity, children: snackbar.message }) })] }));
}
export default WebsiteStatistics;
