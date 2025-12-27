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
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { VisionMission } from '../services/website.service';

function WebsiteVisionMission() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [items, setItems] = useState<VisionMission[]>([]);
  const [contentDialog, setContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<Partial<VisionMission> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const content = await websiteService.getVisionMission();
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
    if (!editingContent || !editingContent.description) {
      showSnackbar('Description is required', 'error');
      return;
    }
    try {
      if (editingContent.id) {
        await websiteService.updateVisionMission(editingContent.id, editingContent);
      } else {
        await websiteService.createVisionMission(editingContent);
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
    if (!confirm('Delete this content?')) return;
    try {
      await websiteService.deleteVisionMission(id);
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
              Vision and Mission
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
            <Typography variant="h5">Vision and Mission</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingContent({ description: '', display_order: items.length }); setContentDialog(true); }}>Add Vision & Mission</Button>
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>Add vision and mission description. Supports alphanumeric, special characters, and hyperlinks.</Alert>
          
          {items.map((content) => (
            <Card key={content.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      bgcolor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1
                    }}>
                      {content.description?.replace(/<[^>]*>/g, '') || 'No content'}
                    </Typography>
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
              <Visibility sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography color="text.secondary">No vision and mission added yet.</Typography>
            </Card>
          )}
        </Box>
      </Box>

      <Dialog open={contentDialog} onClose={() => setContentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingContent?.id ? 'Edit Vision & Mission' : 'Add Vision & Mission'}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Description *" 
            value={editingContent?.description || ''} 
            onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })} 
            margin="normal" 
            multiline 
            rows={8}
            required
            helperText="Use <a href='url'>link text</a> for hyperlinks"
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Display Order" 
                type="number" 
                value={editingContent?.display_order || 0} 
                onChange={(e) => setEditingContent({ ...editingContent, display_order: parseInt(e.target.value) })} 
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

export default WebsiteVisionMission;

