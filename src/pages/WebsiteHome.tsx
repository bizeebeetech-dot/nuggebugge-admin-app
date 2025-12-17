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
  PhotoLibrary,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { HomePageContent } from '../services/website.service';
import MultiImageUpload from '../components/MultiImageUpload';
import { getImageUrl } from '../utils/imageUrl';

function WebsiteHome() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [homeItems, setHomeItems] = useState<HomePageContent[]>([]);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<HomePageContent> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const content = await websiteService.getHomePageContent();
      setHomeItems(content);
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
        await websiteService.updateHomePageContent(editingItem.id, editingItem);
      } else {
        await websiteService.createHomePageContent(editingItem);
      }
      showSnackbar('Home page content saved successfully', 'success');
      setItemDialog(false);
      setEditingItem(null);
      loadData();
    } catch {
      showSnackbar('Failed to save content', 'error');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this Home page content?')) return;
    try {
      await websiteService.deleteHomePageContent(id);
      showSnackbar('Content deleted', 'success');
      setHomeItems(homeItems.filter(item => item.id !== id));
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
              Page 1: Home
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
        {/* Home Page Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Home Page Content</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { 
              setEditingItem({ 
                cover_photos: [], 
                text_content: '',
                display_order: homeItems.length 
              }); 
              setItemDialog(true); 
            }}>
              Add Content
            </Button>
          </Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Single form with 4 sliding cover photos and text content (alphanumeric, special characters @#$%&*, hyperlinks).
          </Alert>
          
          {/* Content Cards */}
          <Grid container spacing={3}>
            {homeItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    {/* Cover Photos Preview */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Sliding Cover Photos ({item.cover_photos?.length || 0}/4)
                      </Typography>
                      {item.cover_photos && item.cover_photos.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {item.cover_photos.map((url, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                width: 150,
                                height: 100,
                                borderRadius: 1,
                                backgroundImage: `url(${getImageUrl(url)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                                border: '2px solid',
                                borderColor: 'primary.main',
                              }}
                            >
                              <Chip 
                                label={`Slide ${idx + 1}`} 
                                size="small" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: 4, 
                                  left: 4, 
                                  bgcolor: 'rgba(0,0,0,0.7)', 
                                  color: '#fff',
                                  fontSize: '0.7rem'
                                }} 
                              />
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
                          <PhotoLibrary sx={{ color: 'grey.400', fontSize: 32 }} />
                          <Typography variant="body2" color="text.secondary">No cover photos uploaded</Typography>
                        </Box>
                      )}
                    </Box>

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
            {homeItems.length === 0 && (
              <Grid item xs={12}>
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <HomeIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography color="text.secondary">No Home page content added yet.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add 4 sliding cover photos and text content.
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => { 
                    setEditingItem({ cover_photos: [], text_content: '', display_order: 0 }); 
                    setItemDialog(true); 
                  }}>
                    Add Home Content
                  </Button>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      {/* Unified Home Dialog */}
      <Dialog open={itemDialog} onClose={() => setItemDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem?.id ? 'Edit Home Page Content' : 'Add Home Page Content'}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Single form with 4 sliding cover photos and text content.
          </Alert>
          
          {/* 1. Cover Photos */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoLibrary /> 4 Sliding Cover Photos
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }} icon={false}>
            Upload exactly 4 photos for the homepage slider. Photos will be displayed in the order uploaded.
          </Alert>
          <MultiImageUpload
            values={editingItem?.cover_photos || []}
            onChange={(urls) => setEditingItem({ ...editingItem, cover_photos: urls })}
            label="Upload Cover Photos (4 max)"
            maxImages={4}
          />
          
          <Divider sx={{ my: 3 }} />
          
          {/* 2. Text Content */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>📝</span> Text Content
          </Typography>
          <TextField 
            fullWidth 
            label="Home Page Text Content" 
            value={editingItem?.text_content || ''} 
            onChange={(e) => setEditingItem({ ...editingItem, text_content: e.target.value })} 
            multiline 
            rows={6}
            helperText="Supports alphanumeric, special characters (@#$%&*), and hyperlinks using HTML: <a href='url'>link text</a>"
            sx={{ mb: 3 }}
          />
          
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
          <Button variant="contained" onClick={handleSaveItem}>Save Home Content</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default WebsiteHome;
