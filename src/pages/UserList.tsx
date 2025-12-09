import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Logout,
  Person,
  KeyboardArrowDown,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import userService, { User, CreateUserData, UpdateUserData } from '../services/user.service';

export default function UserList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = authService.getUser();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Form state
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formRole, setFormRole] = useState('');

  const open = Boolean(anchorEl);

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userService.getAll(search || undefined),
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseDialog();
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseDialog();
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteDialogOpen(false);
      setDeletingUser(null);
    },
  });

  const resetForm = () => {
    setFormEmail('');
    setFormPassword('');
    setFormFirstName('');
    setFormLastName('');
    setFormRole('');
    setEditingUser(null);
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormEmail(user.email);
      setFormFirstName(user.first_name);
      setFormLastName(user.last_name);
      setFormRole(user.role || '');
      setFormPassword('');
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (editingUser) {
      const data: UpdateUserData = {
        email: formEmail,
        first_name: formFirstName,
        last_name: formLastName,
        role: formRole || undefined,
      };
      if (formPassword) {
        data.password = formPassword;
      }
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      if (!formEmail || !formPassword || !formFirstName || !formLastName) return;
      createMutation.mutate({
        email: formEmail,
        password: formPassword,
        first_name: formFirstName,
        last_name: formLastName,
        role: formRole || undefined,
      });
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteMutation.mutate(deletingUser.id);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    authService.logout();
  };

  const getInitials = () => {
    if (!currentUser) return '?';
    return `${currentUser.first_name?.[0] || ''}${currentUser.last_name?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#1a1a2e',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            nuggebugge
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#7877c6',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {getInitials()}
              </Avatar>
              <Box sx={{ ml: 1.5, textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.2 }}
                >
                  {currentUser?.first_name} {currentUser?.last_name}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  {currentUser?.email}
                </Typography>
              </Box>
              <KeyboardArrowDown sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.5 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  bgcolor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '& .MuiMenuItem-root': {
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Person sx={{ mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }} />
                Profile
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b !important' }}>
                <Logout sx={{ mr: 1.5, fontSize: '1.2rem' }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                USER LIST
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: '#22c55e',
                  '&:hover': { bgcolor: '#16a34a' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Add User
              </Button>
            </Box>

            {/* Search */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search by email or name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'rgba(0,0,0,0.4)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  bgcolor: '#6366f1',
                  '&:hover': { bgcolor: '#4f46e5' },
                  textTransform: 'none',
                }}
              >
                Search
              </Button>
              <Button
                variant="contained"
                onClick={handleClearSearch}
                sx={{
                  bgcolor: '#475569',
                  '&:hover': { bgcolor: '#334155' },
                  textTransform: 'none',
                }}
              >
                Clear
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 60 }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 150 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                        '&:hover': { bgcolor: '#e0f2fe' },
                      }}
                    >
                      <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{user.email}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(user)}
                              sx={{
                                border: '1px solid #22d3ee',
                                color: '#22d3ee',
                                '&:hover': { bgcolor: '#ecfeff' },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(user)}
                              disabled={user.id === currentUser?.id}
                              sx={{
                                border: '1px solid #f87171',
                                color: '#f87171',
                                '&:hover': { bgcolor: '#fef2f2' },
                                '&:disabled': {
                                  border: '1px solid #d1d5db',
                                  color: '#d1d5db',
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label={editingUser ? 'Password (leave blank to keep current)' : 'Password'}
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              required={!editingUser}
            />
            <TextField
              fullWidth
              label="First Name"
              value={formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Role"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              placeholder="e.g., admin, user"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formEmail ||
              !formFirstName ||
              !formLastName ||
              (!editingUser && !formPassword) ||
              createMutation.isPending ||
              updateMutation.isPending
            }
            sx={{
              bgcolor: '#6366f1',
              '&:hover': { bgcolor: '#4f46e5' },
            }}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : editingUser ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{deletingUser?.email}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

