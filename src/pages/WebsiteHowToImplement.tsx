import { useState, useEffect, useRef } from 'react';
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
  Link,
} from '@mui/material';
import {
  Logout,
  Person,
  KeyboardArrowDown,
  Add,
  Edit,
  Delete,
  ArrowBack,
  Build,
  Upload,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import websiteService, { HowToImplement } from '../services/website.service';
import { getImageUrl } from '../utils/imageUrl';

function WebsiteHowToImplement() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [items, setItems] = useState<HowToImplement[]>([]);
  const [contentDialog, setContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<Partial<HowToImplement> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const content = await websiteService.getHowToImplement();
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
        await websiteService.updateHowToImplement(editingContent.id, editingContent);
      } else {
        await websiteService.createHowToImplement(editingContent);
      }
      showSnackbar('Content saved successfully', 'success');
      setContentDialog(false);
      setEditingContent(null);
      loadData();
    } catch {
      showSnackbar('Failed to save content', 'error');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (50 MB limit for documents)
    if (file.size > 50 * 1024 * 1024) {
      showSnackbar('File size must be less than 50 MB', 'error');
      return;
    }

    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      showSnackbar('Please upload a PDF file', 'error');
      return;
    }

    setUploading(true);
    try {
      const response = await websiteService.uploadDocument(file);
      setEditingContent({ ...editingContent, pdf_file: response.url });
      showSnackbar('PDF uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload failed:', error);
      showSnackbar('Failed to upload PDF', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Delete this content?')) return;
    try {
      await websiteService.deleteHowToImplement(id);
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
              How to Implement
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
            <Typography variant="h5">How to Implement</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingContent({ pdf_file: '', link: '', display_order: items.length }); setContentDialog(true); }}>Add Implementation Guide</Button>
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>Upload PDF file or add a link for implementation guide.</Alert>
          
          {items.map((content) => (
            <Card key={content.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    {content.pdf_file && (
                      <Box sx={{ mb: 1 }}>
                        <Chip 
                          label="PDF File" 
                          size="small" 
                          color="primary"
                          component="a"
                          href={getImageUrl(content.pdf_file)}
                          target="_blank"
                          clickable
                        />
                      </Box>
                    )}
                    {content.link && (
                      <Box sx={{ mb: 1 }}>
                        <Link href={content.link} target="_blank" sx={{ fontSize: '0.875rem' }}>
                          {content.link}
                        </Link>
                      </Box>
                    )}
                    {!content.pdf_file && !content.link && (
                      <Typography variant="body2" color="text.secondary">
                        No PDF or link added
                      </Typography>
                    )}
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
              <Build sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography color="text.secondary">No implementation guides added yet.</Typography>
            </Card>
          )}
        </Box>
      </Box>

      <Dialog open={contentDialog} onClose={() => setContentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingContent?.id ? 'Edit Implementation Guide' : 'Add Implementation Guide'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>PDF File:</Typography>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".pdf"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose PDF file'}
              </Button>
              {editingContent?.pdf_file && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    File: {editingContent.pdf_file.split('/').pop()}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => window.open(getImageUrl(editingContent.pdf_file!), '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setEditingContent({ ...editingContent, pdf_file: '' })}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <TextField 
            fullWidth 
            label="Link" 
            value={editingContent?.link || ''} 
            onChange={(e) => setEditingContent({ ...editingContent, link: e.target.value })} 
            margin="normal"
            placeholder="https://..."
            helperText="Add a link to the implementation guide"
          />
          {editingContent?.link && (
            <Box sx={{ mt: 1 }}>
              <Link 
                href={editingContent.link} 
                target="_blank" 
                sx={{ fontSize: '0.875rem' }}
              >
                {editingContent.link}
              </Link>
            </Box>
          )}

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

export default WebsiteHowToImplement;

