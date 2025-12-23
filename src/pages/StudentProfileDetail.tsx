import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  KeyboardArrowDown,
  Logout,
  Edit,
  Save,
  Cancel,
  LockReset,
  ShoppingCart,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import studentService, { Student } from '../services/student.service';
import { studentOrderService } from '../services/student-order.service';
import api from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Dropdowns {
  states: { id: string; name: string }[];
  boards: { id: string; name: string }[];
  schools: { id: string; name: string; state_id?: string; board_id?: string }[];
  classes: { id: string; name: string; board_id?: string }[];
  districts: { id: string; name: string; state_id?: string }[];
}

export default function StudentProfileDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const user = authService.getUser();

  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Form state
  const [formData, setFormData] = useState<Partial<Student>>({});

  const open = Boolean(anchorEl);

  // Fetch student
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getById(Number(id)),
    enabled: !!id,
  });

  // Fetch dropdowns
  const { data: dropdowns } = useQuery<Dropdowns>({
    queryKey: ['student-dropdowns'],
    queryFn: async () => {
      const response = await api.get('/student-auth/dropdowns');
      return response.data.data;
    },
  });

  // Fetch student orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['student-orders', id],
    queryFn: () => studentOrderService.getByStudentId(Number(id)),
    enabled: !!id && tabValue === 1,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Student>) => studentService.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      setIsEditing(false);
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (password: string) => studentService.resetPassword(Number(id), password),
    onSuccess: () => {
      setResetPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    },
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        gender: student.gender || '',
        state_id: student.state_id || '',
        board_id: student.board_id || '',
        school_id: student.school_id || '',
        class_id: student.class_id || '',
        section: student.section || '',
        roll_number: student.roll_number || '',
        district_id: student.district_id || '',
        device_type: student.device_type || '',
        phone: student.phone || '',
      });
    }
  }, [student]);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (student) {
      setFormData({
        name: student.name || '',
        gender: student.gender || '',
        state_id: student.state_id || '',
        board_id: student.board_id || '',
        school_id: student.school_id || '',
        class_id: student.class_id || '',
        section: student.section || '',
        roll_number: student.roll_number || '',
        district_id: student.district_id || '',
        device_type: student.device_type || '',
        phone: student.phone || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError('Both password fields are required');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    resetPasswordMutation.mutate(newPassword);
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filtered options based on selections
  const filteredSchools = dropdowns?.schools?.filter(
    (s) => (!formData.state_id || s.state_id === formData.state_id) && (!formData.board_id || s.board_id === formData.board_id)
  ) || [];

  const filteredClasses = dropdowns?.classes?.filter(
    (c) => !formData.board_id || c.board_id === formData.board_id
  ) || [];

  const filteredDistricts = dropdowns?.districts?.filter(
    (d) => !formData.state_id || d.state_id === formData.state_id
  ) || [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Student not found</Alert>
      </Box>
    );
  }

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
            <IconButton onClick={() => navigate('/student-profiles')} sx={{ color: '#fff' }}>
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
              Student Profile: {student.name?.toUpperCase()}
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
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Profile" icon={<Person />} iconPosition="start" />
              <Tab label="Purchased Activity" icon={<ShoppingCart />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Profile Information
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                      sx={{ textTransform: 'none' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LockReset />}
                      onClick={() => setResetPasswordDialogOpen(true)}
                      sx={{ textTransform: 'none', borderColor: '#f59e0b', color: '#f59e0b' }}
                    >
                      Reset Password
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      sx={{ textTransform: 'none', bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{ textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Student Mem. ID"
                  value={student.app_code}
                  disabled
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={student.email}
                  disabled
                  variant="outlined"
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="State"
                  value={formData.state_id || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, state_id: e.target.value, district_id: '', school_id: '' });
                  }}
                  disabled={!isEditing}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select State</option>
                  {dropdowns?.states?.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="District"
                  value={formData.district_id || ''}
                  onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                  disabled={!isEditing || !formData.state_id}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Board"
                  value={formData.board_id || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, board_id: e.target.value, school_id: '', class_id: '' });
                  }}
                  disabled={!isEditing}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Board</option>
                  {dropdowns?.boards?.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="School"
                  value={formData.school_id || ''}
                  onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                  disabled={!isEditing || !formData.state_id || !formData.board_id}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select School</option>
                  {filteredSchools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Class"
                  value={formData.class_id || ''}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  disabled={!isEditing || !formData.board_id}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Class</option>
                  {filteredClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Section"
                  value={formData.section || ''}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Roll Number"
                  value={formData.roll_number || ''}
                  onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Device Type"
                  value={formData.device_type || ''}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                  helperText="e.g., android, ios, web"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Verified"
                  value={student.email_verified ? 'Yes' : 'No'}
                  disabled
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Status"
                  value={student.is_active ? 'Active' : 'Inactive'}
                  disabled
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Purchased Activity Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Purchased Activities
            </Typography>
            {ordersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <ShoppingCart sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography color="text.secondary">No activities purchased yet</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Invoice Number</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Activity</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} sx={{ '&:hover': { bgcolor: '#f0f9ff' } }}>
                        <TableCell>{order.invoice_number}</TableCell>
                        <TableCell>{order.activity?.title || order.activity?.name || 'N/A'}</TableCell>
                        <TableCell>{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status.toUpperCase()}
                            color={order.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Paper>
      </Box>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onClose={() => setResetPasswordDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError('');
            }}
            margin="normal"
            error={!!passwordError}
            helperText={passwordError || 'Password must be at least 6 characters long'}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError('');
            }}
            margin="normal"
            error={!!passwordError}
          />
          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleResetPassword}
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? <CircularProgress size={20} /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

