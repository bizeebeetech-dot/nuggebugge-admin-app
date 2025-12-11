import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Switch, FormControlLabel, Alert, Snackbar, CircularProgress, Chip, } from '@mui/material';
import { Logout, Person, KeyboardArrowDown, Add, Edit, Delete, ArrowBack, Info, PhotoLibrary, } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService from '../services/website.service';
import MultiImageUpload from '../components/MultiImageUpload';
function WebsiteAboutUs() {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [aboutUsItems, setAboutUsItems] = useState([]);
    const [itemDialog, setItemDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const content = await websiteService.getAboutUsPageContent();
            setAboutUsItems(content);
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
                await websiteService.updateAboutUsPageContent(editingItem.id, editingItem);
            }
            else {
                await websiteService.createAboutUsPageContent(editingItem);
            }
            showSnackbar('About Us content saved successfully', 'success');
            setItemDialog(false);
            setEditingItem(null);
            loadData();
        }
        catch {
            showSnackbar('Failed to save content', 'error');
        }
    };
    const handleDeleteItem = async (id) => {
        if (!confirm('Delete this About Us content?'))
            return;
        try {
            await websiteService.deleteAboutUsPageContent(id);
            showSnackbar('Content deleted', 'success');
            setAboutUsItems(aboutUsItems.filter(item => item.id !== id));
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
    return (_jsxs(Box, { sx: { minHeight: '100vh', bgcolor: '#f5f5f5' }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: { bgcolor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }, children: _jsxs(Toolbar, { sx: { justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(IconButton, { onClick: () => navigate('/'), sx: { color: '#fff' }, children: _jsx(ArrowBack, {}) }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }, children: "Page 3: About Us" })] }), _jsxs(IconButton, { onClick: (e) => setAnchorEl(e.currentTarget), sx: { borderRadius: 2, px: 1.5, py: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }, children: [_jsx(Avatar, { sx: { width: 36, height: 36, bgcolor: '#7877c6', fontSize: '0.9rem', fontWeight: 600 }, children: getInitials() }), _jsx(KeyboardArrowDown, { sx: { color: 'rgba(255,255,255,0.5)', ml: 0.5 } })] }), _jsxs(Menu, { anchorEl: anchorEl, open: open, onClose: () => setAnchorEl(null), PaperProps: { sx: { mt: 1, minWidth: 200, bgcolor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', '& .MuiMenuItem-root': { color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } } } }, children: [_jsxs(MenuItem, { children: [_jsx(Person, { sx: { mr: 1.5 } }), "Profile"] }), _jsx(Divider, { sx: { borderColor: 'rgba(255,255,255,0.1)' } }), _jsxs(MenuItem, { onClick: () => authService.logout(), sx: { color: '#ff6b6b !important' }, children: [_jsx(Logout, { sx: { mr: 1.5 } }), "Logout"] })] })] }) }), _jsx(Box, { sx: { p: 3 }, children: _jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(Typography, { variant: "h5", children: "About Us Page Content" }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => {
                                        setEditingItem({
                                            text_content: '',
                                            team_photos: [],
                                            organization_name: '',
                                            address: '',
                                            email: '',
                                            phone: '',
                                            alternate_phone: '',
                                            display_order: aboutUsItems.length
                                        });
                                        setItemDialog(true);
                                    }, children: "Add Content" })] }), _jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "Each About Us entry includes text content (alphanumeric, special characters @#$%&*, hyperlinks), multiple photo attachments for team members, and contact details - all in a single form." }), _jsxs(Grid, { container: true, spacing: 3, children: [aboutUsItems.map((item) => (_jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [item.team_photos && item.team_photos.length > 0 && (_jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: ["Team Member Photos (", item.team_photos.length, ")"] }), _jsx(Box, { sx: { display: 'flex', gap: 1, flexWrap: 'wrap' }, children: item.team_photos.map((url, idx) => (_jsx(Avatar, { src: url, sx: { width: 60, height: 60 } }, idx))) })] })), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Text Content" }), _jsx(Typography, { variant: "body2", sx: {
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                bgcolor: '#f5f5f5',
                                                                p: 2,
                                                                borderRadius: 1
                                                            }, children: item.text_content?.replace(/<[^>]*>/g, '') || 'No content' })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Organization" }), _jsx(Typography, { variant: "body2", children: item.organization_name || '-' }), item.address && _jsx(Typography, { variant: "caption", color: "text.secondary", children: item.address })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Contact" }), _jsxs(Typography, { variant: "body2", children: [item.email && _jsxs("span", { children: ["\uD83D\uDCE7 ", item.email, _jsx("br", {})] }), item.phone && _jsxs("span", { children: ["\uD83D\uDCDE ", item.phone] }), !item.email && !item.phone && '-'] })] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }, children: [_jsx(Chip, { label: item.is_active ? 'Active' : 'Inactive', color: item.is_active ? 'success' : 'default', size: "small" }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { size: "small", startIcon: _jsx(Edit, {}), onClick: () => { setEditingItem(item); setItemDialog(true); }, children: "Edit" }), _jsx(Button, { size: "small", color: "error", startIcon: _jsx(Delete, {}), onClick: () => handleDeleteItem(item.id), children: "Delete" })] })] })] }) }) }, item.id))), aboutUsItems.length === 0 && (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Card, { sx: { p: 4, textAlign: 'center' }, children: [_jsx(Info, { sx: { fontSize: 48, color: 'grey.400', mb: 2 } }), _jsx(Typography, { color: "text.secondary", children: "No About Us content added yet." }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Add content with text, team photos, and contact details." }), _jsx(Button, { variant: "contained", startIcon: _jsx(Add, {}), onClick: () => {
                                                    setEditingItem({ text_content: '', team_photos: [], display_order: 0 });
                                                    setItemDialog(true);
                                                }, children: "Add About Us Content" })] }) }))] })] }) }), _jsxs(Dialog, { open: itemDialog, onClose: () => setItemDialog(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: editingItem?.id ? 'Edit About Us Content' : 'Add About Us Content' }), _jsxs(DialogContent, { children: [_jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "Single form with text content, team member photos, and contact details." }), _jsxs(Typography, { variant: "h6", sx: { mb: 2, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx("span", { children: "\uD83D\uDCDD" }), " Text Content"] }), _jsx(TextField, { fullWidth: true, label: "About Us Text", value: editingItem?.text_content || '', onChange: (e) => setEditingItem({ ...editingItem, text_content: e.target.value }), multiline: true, rows: 6, helperText: "Supports alphanumeric, special characters (@#$%&*), and hyperlinks using HTML: <a href='url'>link text</a>", sx: { mb: 3 } }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Typography, { variant: "h6", sx: { mb: 2, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(PhotoLibrary, {}), " Photo Attachments - Team Members"] }), _jsx(MultiImageUpload, { values: editingItem?.team_photos || [], onChange: (urls) => setEditingItem({ ...editingItem, team_photos: urls }), label: "Upload Team Member Photos", maxImages: 20 }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Typography, { variant: "h6", sx: { mb: 2, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx("span", { children: "\uD83D\uDCDE" }), " Contact Us Details"] }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Organization Name", value: editingItem?.organization_name || '', onChange: (e) => setEditingItem({ ...editingItem, organization_name: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Address", value: editingItem?.address || '', onChange: (e) => setEditingItem({ ...editingItem, address: e.target.value }), multiline: true, rows: 2 }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Email", value: editingItem?.email || '', onChange: (e) => setEditingItem({ ...editingItem, email: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Phone", value: editingItem?.phone || '', onChange: (e) => setEditingItem({ ...editingItem, phone: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Alternate Phone", value: editingItem?.alternate_phone || '', onChange: (e) => setEditingItem({ ...editingItem, alternate_phone: e.target.value }) }) })] }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Display Order", type: "number", value: editingItem?.display_order || 0, onChange: (e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) }) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: editingItem?.is_active ?? true, onChange: (e) => setEditingItem({ ...editingItem, is_active: e.target.checked }) }), label: "Active", sx: { mt: 1 } }) })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setItemDialog(false), children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSaveItem, children: "Save About Us" })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 4000, onClose: () => setSnackbar({ ...snackbar, open: false }), children: _jsx(Alert, { severity: snackbar.severity, children: snackbar.message }) })] }));
}
export default WebsiteAboutUs;
