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
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Switch,
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
  ArrowBack,
  Feedback,
  Delete,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { AppFeedback } from '../services/website.service';

function Feedbacks() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await websiteService.getAllFeedbacks();
      setFeedbacks(data);
    } catch {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleToggleApproval = async (feedback: AppFeedback) => {
    try {
      await websiteService.updateFeedback(feedback.id, {
        is_approved: !feedback.is_approved,
      });
      showSnackbar('Approval status updated', 'success');
      loadData();
    } catch {
      showSnackbar('Failed to update approval', 'error');
    }
  };

  const handleToggleFeatured = async (feedback: AppFeedback) => {
    try {
      await websiteService.updateFeedback(feedback.id, {
        is_featured: !feedback.is_featured,
      });
      showSnackbar('Featured status updated', 'success');
      loadData();
    } catch {
      showSnackbar('Failed to update featured status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await websiteService.deleteFeedback(id);
      showSnackbar('Feedback deleted', 'success');
      loadData();
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
              User Feedbacks
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
            <Typography variant="h5">User Feedbacks</Typography>
            <Chip label={`Total: ${feedbacks.length}`} color="primary" />
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>View and manage feedbacks submitted by users.</Alert>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Feedback</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Approved</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Featured</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Feedback sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                      <Typography color="text.secondary">No feedbacks yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  feedbacks.map((feedback) => (
                    <TableRow 
                      key={feedback.id}
                      sx={{ 
                        bgcolor: feedback.is_approved ? 'rgba(46, 160, 67, 0.05)' : 'inherit',
                        '&:hover': { bgcolor: '#f0f9ff' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {new Date(feedback.created_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {feedback.user_name || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {feedback.user_email || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {feedback.feedback_text}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {feedback.rating ? (
                          <Rating value={feedback.rating} readOnly size="small" />
                        ) : (
                          <Typography variant="caption" color="text.secondary">No rating</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={feedback.source || 'unknown'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={feedback.is_approved}
                          onChange={() => handleToggleApproval(feedback)}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={feedback.is_featured}
                          onChange={() => handleToggleFeatured(feedback)}
                          color="warning"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(feedback.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Feedbacks;

