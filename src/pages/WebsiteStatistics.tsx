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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
} from '@mui/material';
import {
  Logout,
  Person,
  KeyboardArrowDown,
  Add,
  Edit,
  Delete,
  ArrowBack,
  Star,
  BarChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { StatisticsPageContent, AppFeedback } from '../services/website.service';

function WebsiteStatistics() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [statisticsContent, setStatisticsContent] = useState<StatisticsPageContent[]>([]);
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>([]);
  const [contentDialog, setContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<Partial<StatisticsPageContent> | null>(null);

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
    } catch {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveContent = async () => {
    if (!editingContent) return;
    try {
      if (editingContent.id) {
        await websiteService.updateStatisticsPageContent(editingContent.id, editingContent);
      } else {
        await websiteService.createStatisticsPageContent(editingContent);
      }
      showSnackbar('Content saved successfully', 'success');
      setContentDialog(false);
      setEditingContent(null);
      const content = await websiteService.getStatisticsPageContent();
      setStatisticsContent(content);
    } catch {
      showSnackbar('Failed to save content', 'error');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Delete this content?')) return;
    try {
      await websiteService.deleteStatisticsPageContent(id);
      showSnackbar('Content deleted', 'success');
      setStatisticsContent(statisticsContent.filter(c => c.id !== id));
    } catch {
      showSnackbar('Failed to delete', 'error');
    }
  };

  const handleToggleApproval = async (feedback: AppFeedback) => {
    try {
      await websiteService.updateFeedback(feedback.id, { is_approved: !feedback.is_approved });
      setFeedbacks(feedbacks.map(f => f.id === feedback.id ? { ...f, is_approved: !f.is_approved } : f));
      showSnackbar(`Feedback ${!feedback.is_approved ? 'approved' : 'unapproved'}`, 'success');
    } catch {
      showSnackbar('Failed to update feedback', 'error');
    }
  };

  const handleToggleFeatured = async (feedback: AppFeedback) => {
    try {
      await websiteService.updateFeedback(feedback.id, { is_featured: !feedback.is_featured });
      setFeedbacks(feedbacks.map(f => f.id === feedback.id ? { ...f, is_featured: !f.is_featured } : f));
      showSnackbar(`Feedback ${!feedback.is_featured ? 'featured' : 'unfeatured'}`, 'success');
    } catch {
      showSnackbar('Failed to update feedback', 'error');
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await websiteService.deleteFeedback(id);
      showSnackbar('Feedback deleted', 'success');
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch {
      showSnackbar('Failed to delete', 'error');
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const approvedCount = feedbacks.filter(f => f.is_approved).length;
  const avgRating = feedbacks.length > 0 
    ? feedbacks.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / feedbacks.filter(f => f.rating).length 
    : 0;

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
              Page 4: Statistics
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
        {/* Text Content Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Statistics Page - Text Content</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingContent({ text_content: '', display_order: statisticsContent.length }); setContentDialog(true); }}>Add Text Content</Button>
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>Add statistics page text content. Supports alphanumeric, special characters (@#$%&*), and hyperlinks.</Alert>
          
          {statisticsContent.map((content) => (
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
                      {content.text_content?.replace(/<[^>]*>/g, '') || 'No content'}
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
          {statisticsContent.length === 0 && (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <BarChart sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography color="text.secondary">No text content added yet.</Typography>
            </Card>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Feedback Stats */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>Feedback from APP (Scrolling Window)</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Approved feedbacks will be displayed in a scrolling window on the website. Toggle approval to show/hide feedbacks.
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{feedbacks.length}</Typography>
                <Typography color="text.secondary">Total Feedbacks</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">{approvedCount}</Typography>
                <Typography color="text.secondary">Approved</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="h3" color="warning.main">{avgRating.toFixed(1)}</Typography>
                  <Star sx={{ color: '#f59e0b', fontSize: 32 }} />
                </Box>
                <Typography color="text.secondary">Avg Rating</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Feedback Table */}
        <Box>
          <Typography variant="h6" gutterBottom>All Feedbacks</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Approved</TableCell>
                  <TableCell>Featured</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id} sx={{ bgcolor: feedback.is_approved ? 'rgba(46, 160, 67, 0.05)' : 'inherit' }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{feedback.user_name || 'Anonymous'}</Typography>
                      <Typography variant="caption" color="text.secondary">{feedback.user_email || '-'}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{feedback.feedback_text.substring(0, 100)}{feedback.feedback_text.length > 100 && '...'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Rating value={feedback.rating || 0} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={feedback.source || 'unknown'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(feedback.created_at).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Switch checked={feedback.is_approved} onChange={() => handleToggleApproval(feedback)} color="success" />
                    </TableCell>
                    <TableCell>
                      <Switch checked={feedback.is_featured} onChange={() => handleToggleFeatured(feedback)} color="warning" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => handleDeleteFeedback(feedback.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {feedbacks.length === 0 && (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>No feedbacks received yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Content Dialog */}
      <Dialog open={contentDialog} onClose={() => setContentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingContent?.id ? 'Edit Content' : 'Add Content'}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Text Content (supports HTML, special chars @#$%&*, hyperlinks)" 
            value={editingContent?.text_content || ''} 
            onChange={(e) => setEditingContent({ ...editingContent, text_content: e.target.value })} 
            margin="normal" 
            multiline 
            rows={8}
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

export default WebsiteStatistics;
