import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Breadcrumbs,
  Link,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Logout,
  Person,
  KeyboardArrowDown,
  NavigateNext,
  Archive,
  Unarchive,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { taskService } from '../services/submission.service';
import { studentOrderService, StudentOrder } from '../services/student-order.service';

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
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export default function StudentList() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();

  const [tabValue, setTabValue] = useState(0); // 0 = Active, 1 = Archive
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  // Fetch task details to get activity_id
  const { data: task } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getById(parseInt(taskId!, 10)),
    enabled: !!taskId,
  });

  const activityId = task?.activity?.id;

  // Fetch student orders for the activity (Active tab)
  const { data: activeOrders = [], isLoading: activeLoading } = useQuery({
    queryKey: ['student-orders-activity', activityId, 'active', search],
    queryFn: () => {
      if (!activityId) return Promise.resolve([]);
      return studentOrderService.getByActivityId(activityId, 'active');
    },
    enabled: !!activityId && tabValue === 0,
  });

  // Fetch student orders for the activity (Archive tab)
  const { data: archiveOrders = [], isLoading: archiveLoading } = useQuery({
    queryKey: ['student-orders-activity', activityId, 'archive', search],
    queryFn: () => {
      if (!activityId) return Promise.resolve([]);
      return studentOrderService.getByActivityId(activityId, 'archive');
    },
    enabled: !!activityId && tabValue === 1,
  });

  // Update archive status mutation
  const updateArchiveStatusMutation = useMutation({
    mutationFn: ({ id, archiveStatus }: { id: number; archiveStatus: 'active' | 'archive' }) =>
      studentOrderService.updateArchiveStatus(id, archiveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-orders-activity', activityId] });
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
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

  const handleMoveToArchive = (order: StudentOrder) => {
    updateArchiveStatusMutation.mutate({ id: order.id, archiveStatus: 'archive' });
  };

  const handleMoveToActive = (order: StudentOrder) => {
    updateArchiveStatusMutation.mutate({ id: order.id, archiveStatus: 'active' });
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  // Filter orders based on search
  const filterOrders = (orders: StudentOrder[]) => {
    if (!search) return orders;
    const searchLower = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.student?.name?.toLowerCase().includes(searchLower) ||
        order.student?.app_code?.toLowerCase().includes(searchLower) ||
        order.student?.school_name?.toLowerCase().includes(searchLower) ||
        order.activity?.title?.toLowerCase().includes(searchLower) ||
        order.activity?.name?.toLowerCase().includes(searchLower)
    );
  };

  const activeOrdersFiltered = filterOrders(activeOrders);
  const archiveOrdersFiltered = filterOrders(archiveOrders);
  const isLoading = tabValue === 0 ? activeLoading : archiveLoading;

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
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  {user?.email}
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
        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            color="primary"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/tasks');
            }}
            sx={{ textDecoration: 'none', fontWeight: 500 }}
          >
            {task?.activity?.points || 20} POINT TASK LIST
          </Link>
          <Typography color="text.secondary" fontWeight={500}>
            {task?.activity?.points || 20} STUDENT LIST
          </Typography>
        </Breadcrumbs>

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {task?.activity?.points || 20} STUDENT LIST
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
              {/* Search */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search by name, APP ID, school, or activity"
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

              {/* Activity Info */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', ml: 'auto' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Activity Name :
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ maxWidth: 350 }}>
                    {task?.activity?.name || 'Loading...'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Activity Type :
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {task?.activity?.points || 20} Points
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Task Number :
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {task?.task_number || 'Loading...'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
            <Tabs 
              value={tabValue} 
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  minHeight: 48,
                },
                '& .Mui-selected': {
                  color: '#6366f1',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6366f1',
                  height: 3,
                },
              }}
            >
              <Tab label="ACTIVE PAGE" />
              <Tab label="ARCHIVE PAGE" />
            </Tabs>
          </Box>

          {/* Active Tab */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', width: 60 }}>Sl.</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>APP ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>School Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>Activity Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>To Evaluate</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>Shifting</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={32} />
                      </TableCell>
                    </TableRow>
                  ) : activeOrdersFiltered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                        No active students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeOrdersFiltered.map((order, index) => (
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
                          {order.student?.name?.toUpperCase() || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {order.student?.app_code || 'N/A'}
                        </TableCell>
                        <TableCell>{order.student?.school_name || 'N/A'}</TableCell>
                        <TableCell>{order.activity?.title || order.activity?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              navigate(`/evaluation/student/${order.student_id}/activity/${order.activity_id}/answer`);
                            }}
                            sx={{
                              color: '#22c55e',
                              borderColor: '#22c55e',
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#16a34a',
                                bgcolor: '#f0fdf4',
                              },
                            }}
                          >
                            Click here
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Archive />}
                            onClick={() => handleMoveToArchive(order)}
                            disabled={updateArchiveStatusMutation.isPending}
                            sx={{
                              color: '#f59e0b',
                              borderColor: '#f59e0b',
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                borderColor: '#d97706',
                                bgcolor: '#fffbeb',
                              },
                            }}
                          >
                            MOVE TO ARCHIVE
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Archive Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', width: 60 }}>Sl.</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>APP ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>School Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>Activity Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>To Evaluate</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>Shifting</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={32} />
                      </TableCell>
                    </TableRow>
                  ) : archiveOrdersFiltered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                        No archived students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    archiveOrdersFiltered.map((order, index) => (
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
                          {order.student?.name?.toUpperCase() || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {order.student?.app_code || 'N/A'}
                        </TableCell>
                        <TableCell>{order.student?.school_name || 'N/A'}</TableCell>
                        <TableCell>{order.activity?.title || order.activity?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              navigate(`/evaluation/student/${order.student_id}/activity/${order.activity_id}/answer`);
                            }}
                            sx={{
                              color: '#22c55e',
                              borderColor: '#22c55e',
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#16a34a',
                                bgcolor: '#f0fdf4',
                              },
                            }}
                          >
                            Click here
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Unarchive />}
                            onClick={() => handleMoveToActive(order)}
                            disabled={updateArchiveStatusMutation.isPending}
                            sx={{
                              color: '#10b981',
                              borderColor: '#10b981',
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                borderColor: '#059669',
                                bgcolor: '#f0fdf4',
                              },
                            }}
                          >
                            MOVE TO ACTIVE
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
}
