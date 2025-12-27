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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Logout,
  Person,
  KeyboardArrowDown,
  ArrowBack,
  Report,
  Delete,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { ComplaintSubmission } from '../services/website.service';
import { getImageUrl } from '../utils/imageUrl';

function ComplaintSubmissions() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [submissions, setSubmissions] = useState<ComplaintSubmission[]>([]);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ComplaintSubmission | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await websiteService.getComplaintSubmissions();
      setSubmissions(data);
    } catch {
      showSnackbar('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleToggleResolved = async (submission: ComplaintSubmission) => {
    try {
      await websiteService.updateComplaintSubmission(submission.id, {
        is_resolved: !submission.is_resolved,
      });
      showSnackbar('Status updated successfully', 'success');
      loadData();
    } catch {
      showSnackbar('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this complaint submission?')) return;
    try {
      await websiteService.deleteComplaintSubmission(id);
      showSnackbar('Complaint deleted', 'success');
      loadData();
    } catch {
      showSnackbar('Failed to delete', 'error');
    }
  };

  const handleView = (submission: ComplaintSubmission) => {
    setSelectedSubmission(submission);
    setViewDialog(true);
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
              Complaint Submissions
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
            <Typography variant="h5">User Complaint Submissions</Typography>
            <Chip label={`Total: ${submissions.length}`} color="primary" />
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>View and manage complaints submitted by users.</Alert>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Header</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Submitted By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Report sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                      <Typography color="text.secondary">No complaint submissions yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow 
                      key={submission.id}
                      sx={{ 
                        bgcolor: submission.is_resolved ? 'rgba(46, 160, 67, 0.05)' : 'inherit',
                        '&:hover': { bgcolor: '#f0f9ff' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {new Date(submission.created_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {submission.header}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {submission.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {submission.submitted_by || 'Anonymous'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {submission.image ? (
                          <Chip 
                            label="View Image" 
                            size="small" 
                            color="primary"
                            onClick={() => window.open(getImageUrl(submission.image!), '_blank')}
                            sx={{ cursor: 'pointer' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">No image</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={submission.is_resolved}
                              onChange={() => handleToggleResolved(submission)}
                              size="small"
                              color="success"
                            />
                          }
                          label={submission.is_resolved ? 'Resolved' : 'Pending'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleView(submission)}
                            sx={{ color: '#6366f1' }}
                          >
                            <CheckCircle fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(submission.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Complaint Details
          {selectedSubmission && (
            <Chip 
              label={selectedSubmission.is_resolved ? 'Resolved' : 'Pending'} 
              color={selectedSubmission.is_resolved ? 'success' : 'warning'}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Date</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {new Date(selectedSubmission.created_at).toLocaleString()}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Submitted By</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedSubmission.submitted_by || 'Anonymous'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Header</Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                {selectedSubmission.header}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
              <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {selectedSubmission.description}
              </Typography>

              {selectedSubmission.image && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Image</Typography>
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={getImageUrl(selectedSubmission.image)} 
                      alt="Complaint" 
                      style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
                    />
                  </Box>
                </>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={selectedSubmission.is_resolved}
                    onChange={() => {
                      handleToggleResolved(selectedSubmission);
                      setSelectedSubmission({ ...selectedSubmission, is_resolved: !selectedSubmission.is_resolved });
                    }}
                    color="success"
                  />
                }
                label="Mark as Resolved"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ComplaintSubmissions;

