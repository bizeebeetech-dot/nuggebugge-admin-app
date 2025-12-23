import { useState, useMemo } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Logout,
  Person,
  KeyboardArrowDown,
  Archive,
  Unarchive,
  ArrowBack,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { submissionService, Submission } from '../services/submission.service';
import studentService from '../services/student.service';
import { Student } from '../services/student.service';

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
      id={`evaluation-tabpanel-${index}`}
      aria-labelledby={`evaluation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export default function Evaluation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();

  const [tabValue, setTabValue] = useState(0); // 0 = Active, 1 = Archive
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  // Fetch all students
  const { data: allStudents = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students-all', search],
    queryFn: () => studentService.getAll(search || undefined),
  });

  // Fetch all active submissions (evaluation_status = 'submitted_for_evaluation')
  const { data: activeSubmissionsData = [], isLoading: activeSubmissionsLoading } = useQuery({
    queryKey: ['submissions-active'],
    queryFn: async () => {
      const allSubmissions = await submissionService.getAll();
      // Filter only active submissions
      return allSubmissions.filter(
        (submission) => submission.evaluation_status === 'submitted_for_evaluation'
      );
    },
  });

  // Fetch all archived submissions (evaluation_status = 'evaluated' or 'rejected')
  const { data: archivedSubmissionsData = [], isLoading: archivedSubmissionsLoading } = useQuery({
    queryKey: ['submissions-archived'],
    queryFn: async () => {
      const allSubmissions = await submissionService.getAll();
      // Filter only archived submissions
      return allSubmissions.filter(
        (submission) =>
          submission.evaluation_status === 'evaluated' || submission.evaluation_status === 'rejected'
      );
    },
  });

  // Active Page: Show only students who have active submissions
  interface StudentWithSubmission {
    student: Student;
    submission: Submission;
  }

  const activeStudentsWithSubmissions = useMemo(() => {
    const result: StudentWithSubmission[] = [];
    
    // For each student, check if they have active submissions
    allStudents.forEach((student) => {
      const studentActiveSubmissions = activeSubmissionsData.filter(
        (submission) => submission.student_id === student.id
      );
      
      // Group by activity_id to get unique student-activity combinations
      const submissionsByActivity = new Map<number, Submission>();
      studentActiveSubmissions.forEach((submission) => {
        if (submission.activity_id) {
          const key = submission.activity_id;
          // Keep the most recent submission for each activity
          if (!submissionsByActivity.has(key) || 
              new Date(submission.submitted_at) > new Date(submissionsByActivity.get(key)!.submitted_at)) {
            submissionsByActivity.set(key, submission);
          }
        }
      });
      
      // Add each student-activity combination
      submissionsByActivity.forEach((submission) => {
        result.push({
          student,
          submission,
        });
      });
    });
    
    return result;
  }, [allStudents, activeSubmissionsData]);

  // Archive Page: Show only students who have archived submissions
  const archivedStudentsWithSubmissions = useMemo(() => {
    const result: StudentWithSubmission[] = [];
    
    // For each student, check if they have archived submissions
    allStudents.forEach((student) => {
      const studentArchivedSubmissions = archivedSubmissionsData.filter(
        (submission) => submission.student_id === student.id
      );
      
      // Group by activity_id to get unique student-activity combinations
      const submissionsByActivity = new Map<number, Submission>();
      studentArchivedSubmissions.forEach((submission) => {
        if (submission.activity_id) {
          const key = submission.activity_id;
          // Keep the most recent submission for each activity
          if (!submissionsByActivity.has(key) || 
              new Date(submission.submitted_at) > new Date(submissionsByActivity.get(key)!.submitted_at)) {
            submissionsByActivity.set(key, submission);
          }
        }
      });
      
      // Add each student-activity combination
      submissionsByActivity.forEach((submission) => {
        result.push({
          student,
          submission,
        });
      });
    });
    
    return result;
  }, [allStudents, archivedSubmissionsData]);

  const isLoading = studentsLoading || activeSubmissionsLoading || archivedSubmissionsLoading;

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


  // Move submission to archive by updating evaluation status to 'evaluated'
  const updateEvaluationStatusMutation = useMutation({
    mutationFn: async ({ submissionId, status }: { submissionId: number; status: 'evaluated' | 'submitted_for_evaluation' }) => {
      return submissionService.evaluate(submissionId, {
        evaluation_status: status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-active'] });
      queryClient.invalidateQueries({ queryKey: ['submissions-archived'] });
      queryClient.invalidateQueries({ queryKey: ['students-all'] });
    },
  });

  const handleMoveToArchive = (submissionId: number) => {
    // Manual archive - no validation needed
    updateEvaluationStatusMutation.mutate({
      submissionId,
      status: 'evaluated',
    });
  };

  const handleMoveToActive = (submissionId: number) => {
    updateEvaluationStatusMutation.mutate({
      submissionId,
      status: 'submitted_for_evaluation',
    });
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  // Filter students with submissions based on search
  const filterStudentsWithSubmissions = (studentsWithSubmissions: StudentWithSubmission[]) => {
    if (!search) return studentsWithSubmissions;
    const searchLower = search.toLowerCase();
    return studentsWithSubmissions.filter(
      (item) =>
        (item.student.name && item.student.name.toLowerCase().includes(searchLower)) ||
        (item.student.app_code && item.student.app_code.toLowerCase().includes(searchLower)) ||
        (item.student.school_name && item.student.school_name.toLowerCase().includes(searchLower)) ||
        ((item.submission.activity?.title || item.submission.activity?.name) && (item.submission.activity?.title || item.submission.activity?.name || '').toLowerCase().includes(searchLower))
    );
  };

  const activeStudentsFiltered = filterStudentsWithSubmissions(activeStudentsWithSubmissions);
  const archivedStudentsFiltered = filterStudentsWithSubmissions(archivedStudentsWithSubmissions);

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
              Evaluation
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
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Student Evaluation
            </Typography>

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
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      Student Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>
                      APP ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      School Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      Activity Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>
                      To Evaluate
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      Shifting
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={32} />
                      </TableCell>
                    </TableRow>
                  ) : activeStudentsFiltered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                        No students with active submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeStudentsFiltered.map((item, index) => (
                      <TableRow
                        key={`${item.student.id}-${item.submission.activity_id}`}
                        sx={{
                          bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                          '&:hover': { bgcolor: '#e0f2fe' },
                        }}
                      >
                        <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.student.name
                            ? item.student.name.toUpperCase()
                            : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {item.student.app_code || 'N/A'}
                        </TableCell>
                        <TableCell>{item.student.school_name || 'N/A'}</TableCell>
                        <TableCell>
                          {item.submission.activity?.title || item.submission.activity?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              navigate(`/evaluation/student/${item.student.id}/activity/${item.submission.activity_id}/answer`);
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
                            onClick={() => handleMoveToArchive(item.submission.id)}
                            disabled={updateEvaluationStatusMutation.isPending}
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
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      Student Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>
                      APP ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      School Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      Activity Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 120 }}>
                      To Evaluate
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', minWidth: 150 }}>
                      Shifting
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={32} />
                      </TableCell>
                    </TableRow>
                  ) : archivedStudentsFiltered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                        No students with archived submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    archivedStudentsFiltered.map((item, index) => (
                      <TableRow
                        key={`${item.student.id}-${item.submission.activity_id}`}
                        sx={{
                          bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                          '&:hover': { bgcolor: '#e0f2fe' },
                        }}
                      >
                        <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.student.name
                            ? item.student.name.toUpperCase()
                            : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {item.student.app_code || 'N/A'}
                        </TableCell>
                        <TableCell>{item.student.school_name || 'N/A'}</TableCell>
                        <TableCell>
                          {item.submission.activity?.title || item.submission.activity?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              navigate(`/evaluation/student/${item.student.id}/activity/${item.submission.activity_id}/answer`);
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
                            onClick={() => handleMoveToActive(item.submission.id)}
                            disabled={updateEvaluationStatusMutation.isPending}
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

