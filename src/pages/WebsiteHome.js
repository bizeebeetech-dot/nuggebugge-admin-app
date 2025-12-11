import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Switch, FormControlLabel, Alert, Snackbar, CircularProgress, Chip, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown, Add, Edit, Delete, ArrowBack, PhotoLibrary, Home as HomeIcon, } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService from '../services/website.service';
import MultiImageUpload from '../components/MultiImageUpload';
function WebsiteHome() {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [homeItems, setHomeItems] = useState([]);
    const [itemDialog, setItemDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const content = await websiteService.getHomePageContent();
            setHomeItems(content);
        }
        catch {
            showSnackbar('Failed to load data', 'error');
        }
        setLoading(false);
    };
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };
    const handleSaveItem = async () => {
        if (!editingItem)
            return;
        try {
            if (editingItem.id) {
                await websiteService.updateHomePageContent(editingItem.id, editingItem);
            }
            else {
                await websiteService.createHomePageContent(editingItem);
            }
            showSnackbar('Home page content saved successfully', 'success');
            setItemDialog(false);
            setEditingItem(null);
            loadData();
        }
        catch {
            showSnackbar('Failed to save content', 'error');
        }
    };
    const handleDeleteItem = async (id) => {
        if (!confirm('Delete this Home page content?'))
            return;
        try {
            await websiteService.deleteHomePageContent(id);
            showSnackbar('Content deleted', 'success');
            setHomeItems(homeItems.filter(item => item.id !== id));
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
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: { bgcolor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }, children: "Page 1: Home" })] }), _jsxs(IconButton, { onClick: (e) => setAnchorEl(e.currentTarget), sx: { borderRadius: 2, px: 1.5, py: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }, children: [_jsx(Avatar, { sx: { width: 36, height: 36, bgcolor: '#7877c6', fontSize: '0.9rem', fontWeight: 600 }, children: getInitials() }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: () => setAnchorEl(null), PaperProps: { sx: { mt: 1, minWidth: 200, bgcolor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', '& .MuiMenuItem-root': { color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } } } }, children: [_jsxs(MenuItem, { children: [_jsx(Person, { sx: { mr: 1.5 } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: () => authService.logout(), sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5 } }), "Logout"] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(Typography, { variant: "h5", children: "Home Page Content" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => {
                                        setEditingItem({
                                            cover_photos: [],
                                            text_content: '',
                                            display_order: homeItems.length
                                        });
                                        setItemDialog(true);
                                    }, children: "Add Content" })] }), _jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "Single form with 4 sliding cover photos and text content (alphanumeric, special characters @#$%&*, hyperlinks)." }), _jsxs(Grid, { container: true, spacing: 3, children: [homeItems.map((item) => (_jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: ["Sliding Cover Photos (", item.cover_photos?.length || 0, "/4)"] }), item.cover_photos && item.cover_photos.length > 0 ? (_jsx(Box, { sx: { display: 'flex', gap: 2, flexWrap: 'wrap' }, children: item.cover_photos.map((url, idx) => (_jsx(Box, { sx: {
                                                                    width: 150,
                                                                    height: 100,
                                                                    borderRadius: 1,
                                                                    backgroundImage: `url(${url})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center',
                                                                    position: 'relative',
                                                                    border: '2px solid',
                                                                    borderColor: 'primary.main',
                                                                }, children: _jsx(Chip, { label: `Slide ${idx + 1}`, size: "small", sx: {
                                                                        position: 'absolute',
                                                                        top: 4,
                                                                        left: 4,
                                                                        bgcolor: 'rgba(0,0,0,0.7)',
                                                                        color: '#fff',
                                                                        fontSize: '0.7rem'
                                                                    } }) }, idx))) })) : (_jsxs(Box, { sx: { p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }, children: [_jsx(PhotoLibrary, { sx: { color: 'grey.400', fontSize: 32 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "No cover photos uploaded" })] }))] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Text Content" }), _jsx(Typography, { variant: "body2", sx: {
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                bgcolor: '#f5f5f5',
                                                                p: 2,
                                                                borderRadius: 1
                                                            }, children: item.text_content?.replace(/<[^>]*>/g, '') || 'No content' })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }, children: [_jsx(Chip, { label: item.is_active ? 'Active' : 'Inactive', color: item.is_active ? 'success' : 'default', size: "small" }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { size: "small", startIcon: _jsx(Edit, {}), onClick: () => { setEditingItem(item); setItemDialog(true); }, children: "Edit" }), _jsx(Button, { size: "small", color: "error", startIcon: _jsx(Delete, {}), onClick: () => handleDeleteItem(item.id), children: "Delete" })] })] })] }) }) }, item.id))), homeItems.length === 0 && (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Card, { sx: { p: 4, textAlign: 'center' }, children: [_jsx(HomeIcon, { sx: { fontSize: 48, color: 'grey.400', mb: 2 } }), _jsx(Typography, { color: "text.secondary", children: "No Home page content added yet." }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Add 4 sliding cover photos and text content." }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => {
                                                    setEditingItem({ cover_photos: [], text_content: '', display_order: 0 });
                                                    setItemDialog(true);
                                                }, children: "Add Home Content" })] }) }))] })] }) }), _jsxs(Dialog, { open: itemDialog, onClose: () => setItemDialog(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: editingItem?.id ? 'Edit Home Page Content' : 'Add Home Page Content' }), _jsxs(DialogContent, { children: [_jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "Single form with 4 sliding cover photos and text content." }), _jsxs(Typography, { variant: "h6", sx: { mb: 2, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(PhotoLibrary, {}), " 4 Sliding Cover Photos"] }), _jsx(Alert, { severity: "warning", sx: { mb: 2 }, icon: false, children: "Upload exactly 4 photos for the homepage slider. Photos will be displayed in the order uploaded." }), _jsx(MultiImageUpload, { values: editingItem?.cover_photos || [], onChange: (urls) => setEditingItem({ ...editingItem, cover_photos: urls }), label: "Upload Cover Photos (4 max)", maxImages: 4 }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Typography, { variant: "h6", sx: { mb: 2, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx("span", { children: "\uD83D\uDCDD" }), " Text Content"] }), _jsx(TextField, { fullWidth: true, label: "Home Page Text Content", value: editingItem?.text_content || '', onChange: (e) => setEditingItem({ ...editingItem, text_content: e.target.value }), multiline: true, rows: 6, helperText: "Supports alphanumeric, special characters (@#$%&*), and hyperlinks using HTML: <a href='url'>link text</a>", sx: { mb: 3 } }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Display Order", type: "number", value: editingItem?.display_order || 0, onChange: (e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) }) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: editingItem?.is_active ?? true, onChange: (e) => setEditingItem({ ...editingItem, is_active: e.target.checked }) }), label: "Active", sx: { mt: 1 } }) })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setItemDialog(false), children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSaveItem, children: "Save Home Content" })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 4000, onClose: () => setSnackbar({ ...snackbar, open: false }), children: _jsx(Alert, { severity: snackbar.severity, children: snackbar.message }) })] }));
}
export default WebsiteHome;
