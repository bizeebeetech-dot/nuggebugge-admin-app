import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Logout,
  Person,
  KeyboardArrowDown,
  Add,
  Edit,
  Delete,
  ArrowBack,
  ContactMail,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { ContactUs } from '../services/website.service';

function WebsiteContactUs() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [items, setItems] = useState<ContactUs[]>([]);
  const [contentDialog, setContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<Partial<ContactUs> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const content = await websiteService.getContactUs();
      setItems(content);
    } catch {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveContent = async () => {
    if (!editingContent) {
      showSnackbar('Please fill in the required fields', 'error');
      return;
    }
    try {
      if (editingContent.id) {
        await websiteService.updateContactUs(editingContent.id, editingContent);
      } else {
        await websiteService.createContactUs(editingContent);
      }
      showSnackbar('Content saved successfully', 'success');
      setContentDialog(false);
      setEditingContent(null);
      loadData();
    } catch {
      showSnackbar('Failed to save content', 'error');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Delete this contact information?')) return;
    try {
      await websiteService.deleteContactUs(id);
      showSnackbar('Content deleted', 'success');
      setItems(items.filter(c => c.id !== id));
    } catch {
      showSnackbar('Failed to delete', 'error');
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: '#fff' }}><ArrowBack /></IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Contact Us
            </Typography>
          </Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ borderRadius: 2, px: 1.5, py: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#7877c6', fontSize: '0.9rem', fontWeight: 600 }}>{getInitials()}</Avatar>
            <KeyboardArrowDown sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.5 }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { mt: 1, minWidth: 200, bgcolor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', '& .MuiMenuItem-root': { color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } } } }}>
            <MenuItem><Person sx={{ mr: 1.5 }} />Profile</MenuItem>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem onClick={() => authService.logout()} sx={{ color: '#ff6b6b !important' }}><Logout sx={{ mr: 1.5 }} />Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Contact Us</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingContent({ address: '', email: '', whatsapp_number: '', display_order: items.length }); setContentDialog(true); }}>Add Contact Information</Button>
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>Add contact information including address, email, and WhatsApp number.</Alert>
          
          {items.map((content) => (
            <Card key={content.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {content.address && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <LocationOn sx={{ color: '#6366f1', fontSize: 20, mt: 0.5 }} />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {content.address}
                          </Typography>
                        </Box>
                      )}
                      {content.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email sx={{ color: '#6366f1', fontSize: 20 }} />
                          <Typography variant="body2">
                            {content.email}
                          </Typography>
                        </Box>
                      )}
                      {content.whatsapp_number && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ color: '#25D366', fontSize: 20 }} />
                          <Typography variant="body2">
                            {content.whatsapp_number}
                          </Typography>
                        </Box>
                      )}
                      {!content.address && !content.email && !content.whatsapp_number && (
                        <Typography variant="body2" color="text.secondary">
                          No contact information added
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ mt: 1 }}><Chip label={content.is_active ? 'Active' : 'Inactive'} color={content.is_active ? 'success' : 'default'} size="small" /></Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <IconButton size="small" onClick={() => { setEditingContent(content); setContentDialog(true); }}><Edit /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteContent(content.id)}><Delete /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <ContactMail sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography color="text.secondary">No contact information added yet.</Typography>
            </Card>
          )}
        </Box>
      </Box>

      <Dialog open={contentDialog} onClose={() => setContentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingContent?.id ? 'Edit Contact Information' : 'Add Contact Information'}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Address" 
            value={editingContent?.address || ''} 
            onChange={(e) => setEditingContent({ ...editingContent, address: e.target.value })} 
            margin="normal"
            multiline
            rows={4}
            placeholder="Enter full address"
            InputProps={{
              startAdornment: <LocationOn sx={{ color: '#6366f1', mr: 1 }} />,
            }}
          />
          <TextField 
            fullWidth 
            label="Email ID" 
            value={editingContent?.email || ''} 
            onChange={(e) => setEditingContent({ ...editingContent, email: e.target.value })} 
            margin="normal"
            type="email"
            placeholder="contact@example.com"
            InputProps={{
              startAdornment: <Email sx={{ color: '#6366f1', mr: 1 }} />,
            }}
          />
          <TextField 
            fullWidth 
            label="WhatsApp Number" 
            value={editingContent?.whatsapp_number || ''} 
            onChange={(e) => setEditingContent({ ...editingContent, whatsapp_number: e.target.value })} 
            margin="normal"
            placeholder="+91 1234567890"
            InputProps={{
              startAdornment: <Phone sx={{ color: '#25D366', mr: 1 }} />,
            }}
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Display Order" 
                type="number" 
                value={editingContent?.display_order || 0} 
                onChange={(e) => setEditingContent({ ...editingContent, display_order: parseInt(e.target.value) || 0 })} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={<Switch checked={editingContent?.is_active ?? true} onChange={(e) => setEditingContent({ ...editingContent, is_active: e.target.checked })} />} 
                label="Active" 
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveContent}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default WebsiteContactUs;

