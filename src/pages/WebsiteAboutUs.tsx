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
  Info,
  PhotoLibrary,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { AboutUsPageContent } from '../services/website.service';
import MultiImageUpload from '../components/MultiImageUpload';

function WebsiteAboutUs() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [aboutUsItems, setAboutUsItems] = useState<AboutUsPageContent[]>([]);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AboutUsPageContent> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const content = await websiteService.getAboutUsPageContent();
      setAboutUsItems(content);
    } catch {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    try {
      if (editingItem.id) {
        await websiteService.updateAboutUsPageContent(editingItem.id, editingItem);
      } else {
        await websiteService.createAboutUsPageContent(editingItem);
      }
      showSnackbar('About Us content saved successfully', 'success');
      setItemDialog(false);
      setEditingItem(null);
      loadData();
    } catch {
      showSnackbar('Failed to save content', 'error');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this About Us content?')) return;
    try {
      await websiteService.deleteAboutUsPageContent(id);
      showSnackbar('Content deleted', 'success');
      setAboutUsItems(aboutUsItems.filter(item => item.id !== id));
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
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: '#fff' }}><ArrowBack /></IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Page 3: About Us
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
        {/* About Us Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">About Us Page Content</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { 
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
            }}>
              Add Content
            </Button>
          </Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Each About Us entry includes text content (alphanumeric, special characters @#$%&*, hyperlinks), 
            multiple photo attachments for team members, and contact details - all in a single form.
          </Alert>
          
          {/* Content Cards */}
          <Grid container spacing={3}>
            {aboutUsItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    {/* Photo Preview */}
                    {item.team_photos && item.team_photos.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Team Member Photos ({item.team_photos.length})
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {item.team_photos.map((url, idx) => (
                            <Avatar
                              key={idx}
                              src={url}
                              sx={{ width: 60, height: 60 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Text Content Preview */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Text Content</Typography>
                      <Typography variant="body2" sx={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden',
                        bgcolor: '#f5f5f5',
                        p: 2,
                        borderRadius: 1
                      }}>
                        {item.text_content?.replace(/<[^>]*>/g, '') || 'No content'}
                      </Typography>
                    </Box>

                    {/* Contact Info Preview */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Organization</Typography>
                        <Typography variant="body2">{item.organization_name || '-'}</Typography>
                        {item.address && <Typography variant="caption" color="text.secondary">{item.address}</Typography>}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Contact</Typography>
                        <Typography variant="body2">
                          {item.email && <span>📧 {item.email}<br/></span>}
                          {item.phone && <span>📞 {item.phone}</span>}
                          {!item.email && !item.phone && '-'}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Status & Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Chip label={item.is_active ? 'Active' : 'Inactive'} color={item.is_active ? 'success' : 'default'} size="small" />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<Edit />} onClick={() => { setEditingItem(item); setItemDialog(true); }}>Edit</Button>
                        <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {aboutUsItems.length === 0 && (
              <Grid item xs={12}>
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Info sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography color="text.secondary">No About Us content added yet.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add content with text, team photos, and contact details.
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => { 
                    setEditingItem({ text_content: '', team_photos: [], display_order: 0 }); 
                    setItemDialog(true); 
                  }}>
                    Add About Us Content
                  </Button>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      {/* Unified About Us Dialog */}
      <Dialog open={itemDialog} onClose={() => setItemDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem?.id ? 'Edit About Us Content' : 'Add About Us Content'}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Single form with text content, team member photos, and contact details.
          </Alert>
          
          {/* 1. Text Content */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>📝</span> Text Content
          </Typography>
          <TextField 
            fullWidth 
            label="About Us Text" 
            value={editingItem?.text_content || ''} 
            onChange={(e) => setEditingItem({ ...editingItem, text_content: e.target.value })} 
            multiline 
            rows={6}
            helperText="Supports alphanumeric, special characters (@#$%&*), and hyperlinks using HTML: <a href='url'>link text</a>"
            sx={{ mb: 3 }}
          />
          
          <Divider sx={{ my: 3 }} />
          
          {/* 2. Team Member Photos */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoLibrary /> Photo Attachments - Team Members
          </Typography>
          <MultiImageUpload
            values={editingItem?.team_photos || []}
            onChange={(urls) => setEditingItem({ ...editingItem, team_photos: urls })}
            label="Upload Team Member Photos"
            maxImages={20}
          />
          
          <Divider sx={{ my: 3 }} />
          
          {/* 3. Contact Us Details */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>📞</span> Contact Us Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Organization Name" 
                value={editingItem?.organization_name || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, organization_name: e.target.value })} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Address" 
                value={editingItem?.address || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })} 
                multiline 
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Email" 
                value={editingItem?.email || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Phone" 
                value={editingItem?.phone || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Alternate Phone" 
                value={editingItem?.alternate_phone || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, alternate_phone: e.target.value })} 
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Settings */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Display Order" 
                type="number" 
                value={editingItem?.display_order || 0} 
                onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) })} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={<Switch checked={editingItem?.is_active ?? true} onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })} />} 
                label="Active" 
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveItem}>Save About Us</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default WebsiteAboutUs;
