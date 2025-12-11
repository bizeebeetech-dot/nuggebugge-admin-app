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
  Switch,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Search,
  Logout,
  Person,
  KeyboardArrowDown,
  Add,
  Edit,
  Delete,
  LockReset,
  Block,
  CheckCircle,
  ArrowBack,
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
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form state
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');

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

  // Toggle enabled mutation
  const toggleEnabledMutation = useMutation({
    mutationFn: ({ id, is_enabled }: { id: string; is_enabled: boolean }) =>
      userService.toggleEnabled(id, is_enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      userService.resetPassword(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setResetPasswordDialogOpen(false);
      setResetPasswordUser(null);
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  // Deactivate user mutation
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => userService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeactivateDialogOpen(false);
      setDeactivatingUser(null);
    },
  });

  // Activate user mutation
  const activateMutation = useMutation({
    mutationFn: (id: string) => userService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const resetForm = () => {
    setFormFirstName('');
    setFormLastName('');
    setFormDesignation('');
    setFormEmployeeId('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('');
    setFormConfirmPassword('');
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
      setFormFirstName(user.first_name);
      setFormLastName(user.last_name);
      setFormDesignation(user.designation || '');
      setFormEmployeeId(user.employee_id || '');
      setFormEmail(user.email);
      setFormUsername(user.username || '');
      setFormPassword('');
      setFormConfirmPassword('');
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
    if (!editingUser && formPassword !== formConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (editingUser) {
      const data: UpdateUserData = {
        first_name: formFirstName,
        last_name: formLastName,
        designation: formDesignation || undefined,
        employee_id: formEmployeeId || undefined,
        email: formEmail,
        username: formUsername || undefined,
      };
      if (formPassword) {
        data.password = formPassword;
      }
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      if (!formEmail || !formPassword || !formFirstName || !formLastName) return;
      createMutation.mutate({
        first_name: formFirstName,
        last_name: formLastName,
        designation: formDesignation || undefined,
        employee_id: formEmployeeId || undefined,
        email: formEmail,
        username: formUsername || undefined,
        password: formPassword,
        role: 'admin',
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

  const handleResetPasswordClick = (user: User) => {
    setResetPasswordUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setResetPasswordDialogOpen(true);
  };

  const handleConfirmResetPassword = () => {
    if (resetPasswordUser && newPassword && newPassword === confirmPassword) {
      resetPasswordMutation.mutate({ id: resetPasswordUser.id, password: newPassword });
    }
  };

  const handleDeactivateClick = (user: User) => {
    setDeactivatingUser(user);
    setDeactivateDialogOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (deactivatingUser) {
      deactivateMutation.mutate(deactivatingUser.id);
    }
  };

  const handleToggleEnabled = (user: User) => {
    toggleEnabledMutation.mutate({ id: user.id, is_enabled: !user.is_enabled });
  };

  const handleActivateUser = (user: User) => {
    activateMutation.mutate(user.id);
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: '#fff' }}>
              <ArrowBack />
            </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
              User Management
          </Typography>
          </Box>

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
              <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ADMIN USER MANAGEMENT
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and manage admin users
              </Typography>
              </Box>
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
                Add Admin User
              </Button>
            </Box>

            {/* Search */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search by name, email, username, or employee ID..."
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
                sx={{ width: 400 }}
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
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 50 }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 100 }}>Enabled</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 100 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 200 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        bgcolor: user.is_deactivated ? '#fef2f2' : index % 2 === 0 ? '#f0f9ff' : '#fff',
                        '&:hover': { bgcolor: user.is_deactivated ? '#fee2e2' : '#e0f2fe' },
                        opacity: user.is_deactivated ? 0.7 : 1,
                      }}
                    >
                      <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.designation || '-'}</TableCell>
                      <TableCell>{user.employee_id || '-'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username || '-'}</TableCell>
                      <TableCell>
                        <Switch
                          checked={user.is_enabled !== false}
                          onChange={() => handleToggleEnabled(user)}
                          disabled={user.is_deactivated || user.id === currentUser?.id}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {user.is_deactivated ? (
                          <Chip label="Deactivated" color="error" size="small" />
                        ) : user.is_enabled === false ? (
                          <Chip label="Disabled" color="warning" size="small" />
                        ) : (
                          <Chip label="Active" color="success" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(user)}
                              disabled={user.is_deactivated}
                              sx={{
                                border: '1px solid #22d3ee',
                                color: '#22d3ee',
                                '&:hover': { bgcolor: '#ecfeff' },
                                '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset Password">
                            <IconButton
                              size="small"
                              onClick={() => handleResetPasswordClick(user)}
                              disabled={user.is_deactivated}
                              sx={{
                                border: '1px solid #f59e0b',
                                color: '#f59e0b',
                                '&:hover': { bgcolor: '#fffbeb' },
                                '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
                              }}
                            >
                              <LockReset fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user.is_deactivated ? (
                            <Tooltip title="Activate User">
                              <IconButton
                                size="small"
                                onClick={() => handleActivateUser(user)}
                                sx={{
                                  border: '1px solid #22c55e',
                                  color: '#22c55e',
                                  '&:hover': { bgcolor: '#f0fdf4' },
                                }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Deactivate User">
                              <IconButton
                                size="small"
                                onClick={() => handleDeactivateClick(user)}
                                disabled={user.id === currentUser?.id}
                                sx={{
                                  border: '1px solid #f87171',
                                  color: '#f87171',
                                  '&:hover': { bgcolor: '#fef2f2' },
                                  '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
                                }}
                              >
                                <Block fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Permanently">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(user)}
                              disabled={user.id === currentUser?.id}
                              sx={{
                                border: '1px solid #dc2626',
                                color: '#dc2626',
                                '&:hover': { bgcolor: '#fef2f2' },
                                '&:disabled': { border: '1px solid #d1d5db', color: '#d1d5db' },
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
          {editingUser ? 'Edit Admin User' : 'Add New Admin User'}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Creating admin users with access to the admin panel.
          </Alert>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name *"
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name *"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                value={formDesignation}
                onChange={(e) => setFormDesignation(e.target.value)}
                placeholder="e.g., Manager, Developer"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID Number"
                value={formEmployeeId}
                onChange={(e) => setFormEmployeeId(e.target.value)}
                placeholder="e.g., EMP001"
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
              fullWidth
                label="Email *"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                placeholder="Optional unique username"
              />
            </Grid>
            {!editingUser && (
              <>
                <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
                    label="Password *"
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
            />
                </Grid>
                <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
                    label="Confirm Password *"
                    type="password"
                    value={formConfirmPassword}
                    onChange={(e) => setFormConfirmPassword(e.target.value)}
                    error={formConfirmPassword !== '' && formPassword !== formConfirmPassword}
                    helperText={
                      formConfirmPassword !== '' && formPassword !== formConfirmPassword
                        ? 'Passwords do not match'
                        : ''
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
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
              (!editingUser && (!formPassword || formPassword !== formConfirmPassword)) ||
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

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onClose={() => setResetPasswordDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Reset password for: <strong>{resetPasswordUser?.email}</strong>
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword !== '' && newPassword !== confirmPassword}
            helperText={
              confirmPassword !== '' && newPassword !== confirmPassword
                ? 'Passwords do not match'
                : ''
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setResetPasswordDialogOpen(false)} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmResetPassword}
            disabled={!newPassword || newPassword !== confirmPassword || resetPasswordMutation.isPending}
            sx={{
              bgcolor: '#f59e0b',
              '&:hover': { bgcolor: '#d97706' },
            }}
          >
            {resetPasswordMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              'Reset Password'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate user "<strong>{deactivatingUser?.email}</strong>"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The user will not be able to log in but their data will be preserved. You can reactivate them later.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeactivateDialogOpen(false)} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeactivate}
            disabled={deactivateMutation.isPending}
          >
            {deactivateMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              'Deactivate'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 600, color: '#dc2626' }}>⚠️ Permanent Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <strong>permanently delete</strong> user "{deletingUser?.email}"?
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            This action cannot be undone. Consider deactivating the user instead.
          </Alert>
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
              'Delete Permanently'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
