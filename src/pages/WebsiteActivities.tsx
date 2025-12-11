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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { ActivityItem } from '../services/website.service';
import MultiImageUpload from '../components/MultiImageUpload';

function WebsiteActivities() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activityDialog, setActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Partial<ActivityItem> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const acts = await websiteService.getActivityItems();
      setActivities(acts);
    } catch {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveActivity = async () => {
    if (!editingActivity) return;
    try {
      if (editingActivity.id) {
        await websiteService.updateActivityItem(editingActivity.id, editingActivity);
      } else {
        await websiteService.createActivityItem(editingActivity);
      }
      showSnackbar('Activity saved successfully', 'success');
      setActivityDialog(false);
      setEditingActivity(null);
      const acts = await websiteService.getActivityItems();
      setActivities(acts);
    } catch {
      showSnackbar('Failed to save activity', 'error');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Delete this activity?')) return;
    try {
      await websiteService.deleteActivityItem(id);
      showSnackbar('Activity deleted', 'success');
      setActivities(activities.filter(a => a.id !== id));
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
              Page 2: List of Activities
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
        {/* Activities Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">List of Activities</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingActivity({ title: '', description: '', photo_urls: [], display_order: activities.length }); setActivityDialog(true); }}>Add Activity</Button>
          </Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Each activity includes text content (alphanumeric, special characters @#$%&*, hyperlinks) and photo attachments in a single form.
          </Alert>
          
          {/* Activity Cards */}
          <Grid container spacing={3}>
            {activities.map((activity) => (
              <Grid item xs={12} md={6} key={activity.id}>
                <Card sx={{ height: '100%' }}>
                  {/* Photo Preview */}
                  {activity.photo_urls && activity.photo_urls.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, p: 1, bgcolor: '#f5f5f5', overflowX: 'auto' }}>
                      {activity.photo_urls.slice(0, 4).map((url, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            width: 80,
                            height: 60,
                            flexShrink: 0,
                            borderRadius: 1,
                            backgroundImage: `url(${url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      ))}
                      {activity.photo_urls.length > 4 && (
                        <Box sx={{ width: 80, height: 60, flexShrink: 0, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography color="white" variant="body2">+{activity.photo_urls.length - 4}</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>{activity.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => { setEditingActivity(activity); setActivityDialog(true); }}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteActivity(activity.id)}><Delete fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {activity.description.replace(/<[^>]*>/g, '')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip icon={<PhotoLibrary />} label={`${activity.photo_urls?.length || 0} photos`} size="small" variant="outlined" />
                      {activity.activity_date && <Chip label={new Date(activity.activity_date).toLocaleDateString()} size="small" variant="outlined" />}
                      {activity.location && <Chip label={activity.location} size="small" variant="outlined" />}
                      <Chip label={activity.is_active ? 'Active' : 'Inactive'} color={activity.is_active ? 'success' : 'default'} size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {activities.length === 0 && (
              <Grid item xs={12}>
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <PhotoLibrary sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography color="text.secondary">No activities added yet.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Click "Add Activity" to create your first activity with text and photos.</Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingActivity({ title: '', description: '', photo_urls: [], display_order: 0 }); setActivityDialog(true); }}>Add Activity</Button>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      {/* Activity Dialog - Combined Form for Text + Photos */}
      <Dialog open={activityDialog} onClose={() => setActivityDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingActivity?.id ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Add activity details with text content and photos together.
          </Alert>
          
          <TextField 
            fullWidth 
            label="Activity Title" 
            value={editingActivity?.title || ''} 
            onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })} 
            margin="normal" 
            required
          />
          
          <TextField 
            fullWidth 
            label="Description / Text Content" 
            value={editingActivity?.description || ''} 
            onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })} 
            margin="normal" 
            multiline 
            rows={6} 
            required
            helperText="Supports alphanumeric, special characters (@#$%&*), and hyperlinks using HTML: <a href='url'>link text</a>"
          />
          
          <Divider sx={{ my: 3 }} />
          
          <MultiImageUpload
            values={editingActivity?.photo_urls || []}
            onChange={(urls) => setEditingActivity({ ...editingActivity, photo_urls: urls })}
            label="Photo Attachments"
            maxImages={10}
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Activity Date (optional)" 
                type="date" 
                value={editingActivity?.activity_date ? new Date(editingActivity.activity_date).toISOString().split('T')[0] : ''} 
                onChange={(e) => setEditingActivity({ ...editingActivity, activity_date: e.target.value })} 
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Location (optional)" 
                value={editingActivity?.location || ''} 
                onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Display Order" 
                type="number" 
                value={editingActivity?.display_order || 0} 
                onChange={(e) => setEditingActivity({ ...editingActivity, display_order: parseInt(e.target.value) })} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Switch checked={editingActivity?.is_active ?? true} onChange={(e) => setEditingActivity({ ...editingActivity, is_active: e.target.checked })} />} 
                label="Active" 
                sx={{ mt: 1 }} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivityDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveActivity} disabled={!editingActivity?.title || !editingActivity?.description}>Save Activity</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default WebsiteActivities;
