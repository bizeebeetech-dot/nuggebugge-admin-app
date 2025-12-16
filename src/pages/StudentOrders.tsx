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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Logout,
  Person,
  KeyboardArrowDown,
  ArrowBack,
  Receipt,
  Description,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import studentOrderService, { StudentOrder } from '../services/student-order.service';
import activityService from '../services/activity.service';
import studentService from '../services/student.service';
import api from '../services/api';

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  completed: 'Completed',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  completed: { bg: '#d1fae5', text: '#065f46' },
};

export default function StudentOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<StudentOrder | null>(null);

  // Form state for editing
  const [studentId, setStudentId] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [activityId, setActivityId] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasedResponse, setPurchasedResponse] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');

  const open = Boolean(anchorEl);

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['studentOrders', search, statusFilter],
    queryFn: () => studentOrderService.getAll(search || undefined, statusFilter || undefined),
  });

  // Fetch activities for dropdown
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => activityService.getAll(),
  });

  // Fetch students for search
  const { data: students = [] } = useQuery({
    queryKey: ['students', studentSearch],
    queryFn: () => studentService.getAll(studentSearch || undefined),
    enabled: studentSearch.length > 0,
  });

  // Update order mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StudentOrder> }) =>
      studentOrderService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentOrders'] });
      handleCloseDialog();
    },
  });

  const resetForm = () => {
    setStudentId('');
    setStudentSearch('');
    setActivityId('');
    setAmount('');
    setPurchasedResponse('');
    setStatus('pending');
    setEditingOrder(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleSaveOrder = () => {
    const parsedStudentId = parseInt(studentId, 10);
    const parsedActivityId = parseInt(activityId, 10);
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedStudentId) || parsedStudentId <= 0) {
      alert('Please select a valid student');
      return;
    }

    if (isNaN(parsedActivityId) || parsedActivityId <= 0) {
      alert('Please select a valid activity');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!editingOrder) return;

    const orderData = {
      student_id: parsedStudentId,
      activity_id: parsedActivityId,
      amount: parsedAmount,
      purchased_response: purchasedResponse || null,
      status,
    };

    updateMutation.mutate({ id: editingOrder.id, data: orderData });
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('');
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
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
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
              Student Orders
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
          {/* Header Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                STUDENT ORDERS
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search by invoice, student name, email, app code..."
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
                sx={{ width: 350 }}
              />

              {/* Status Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>

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
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Invoice Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Activity</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 100 }}>Document</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Receipt sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                      <Typography color="text.secondary">No orders found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                        '&:hover': { bgcolor: '#e0f2fe' },
                      }}
                    >
                      <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {order.invoice_number}
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {order.student?.name || '-'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.student?.app_code} • {order.student?.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {order.activity?.title || order.activity?.name || '-'}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {formatAmount(Number(order.amount))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[order.status]}
                          size="small"
                          sx={{
                            bgcolor: statusColors[order.status]?.bg,
                            color: statusColors[order.status]?.text,
                            fontWeight: 500,
                            border: `1px solid ${statusColors[order.status]?.text}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Download Invoice">
                          <IconButton
                            size="small"
                            onClick={async () => {
                              try {
                                const response = await api.get(`/student-orders/${order.id}/invoice`, {
                                  responseType: 'blob',
                                });
                                const blob = new Blob([response.data], { type: 'application/pdf' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `Invoice_${order.invoice_number}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Failed to download invoice:', error);
                                alert('Failed to download invoice. Please try again.');
                              }
                            }}
                            sx={{
                              border: '1px solid #22d3ee',
                              color: '#22d3ee',
                              '&:hover': { bgcolor: '#ecfeff' },
                            }}
                          >
                            <Description fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Edit Order Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Edit Order
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Student</InputLabel>
              <Select
                value={studentId}
                label="Student"
                onChange={(e) => setStudentId(e.target.value)}
                onOpen={() => setStudentSearch('')}
              >
                <MenuItem value="">
                  <em>Search for student...</em>
                </MenuItem>
                {students.slice(0, 50).map((student) => (
                  <MenuItem key={student.id} value={String(student.id)}>
                    {student.app_code} - {student.name} ({student.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="Search Student (App Code, Name, Email)"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              helperText="Type to search for a student"
            />

            <FormControl fullWidth required>
              <InputLabel>Activity</InputLabel>
              <Select
                value={activityId}
                label="Activity"
                onChange={(e) => {
                  setActivityId(e.target.value);
                  // Auto-fill amount from activity price
                  const activity = activities.find((a) => String(a.id) === e.target.value);
                  if (activity?.price) {
                    setAmount(String(activity.price));
                  }
                }}
              >
                {activities.map((activity) => (
                  <MenuItem key={activity.id} value={String(activity.id)}>
                    {activity.title || activity.name} - ₹{activity.price || 0}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              inputProps={{ inputMode: 'decimal' }}
            />

            <TextField
              fullWidth
              label="Purchased Response (JSON)"
              multiline
              rows={3}
              value={purchasedResponse}
              onChange={(e) => setPurchasedResponse(e.target.value)}
              placeholder='{"transaction_id": "...", "payment_method": "..."}'
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveOrder}
            disabled={
              !editingOrder ||
              studentId.trim() === '' || 
              activityId === '' || 
              amount.trim() === '' || 
              updateMutation.isPending
            }
            sx={{
              bgcolor: '#6366f1',
              '&:hover': { bgcolor: '#4f46e5' },
            }}
          >
            {updateMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
