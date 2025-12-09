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
  TableSortLabel,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Logout,
  Person,
  KeyboardArrowDown,
  NavigateNext,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import {
  submissionService,
  taskService,
  Submission,
  EvaluationStatus,
} from '../services/submission.service';

type SortDirection = 'asc' | 'desc';
type SortField = 'app_code' | 'student_name' | 'submitted_at';

const statusLabels: Record<EvaluationStatus, string> = {
  submitted_for_evaluation: 'Submitted for evaluation',
  under_review: 'Under review',
  evaluated: 'Evaluated',
  rejected: 'Rejected',
};

const statusColors: Record<EvaluationStatus, string> = {
  submitted_for_evaluation: '#f59e0b',
  under_review: '#3b82f6',
  evaluated: '#22c55e',
  rejected: '#ef4444',
};

export default function StudentList() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('submitted_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [evaluateDialogOpen, setEvaluateDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [evaluationScore, setEvaluationScore] = useState('');
  const [evaluationRemarks, setEvaluationRemarks] = useState('');

  const open = Boolean(anchorEl);

  // Fetch task details
  const { data: task } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getById(parseInt(taskId!, 10)),
    enabled: !!taskId,
  });

  // Fetch submissions
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions', taskId, search],
    queryFn: () => submissionService.getByTask(parseInt(taskId!, 10), search || undefined),
    enabled: !!taskId,
  });

  // Evaluate mutation
  const evaluateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { evaluation_status: EvaluationStatus; score?: number; remarks?: string };
    }) => submissionService.evaluate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', taskId] });
      setEvaluateDialogOpen(false);
      setSelectedSubmission(null);
      setEvaluationScore('');
      setEvaluationRemarks('');
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const handleEvaluateClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setEvaluationScore(submission.score?.toString() || '');
    setEvaluationRemarks(submission.remarks || '');
    setEvaluateDialogOpen(true);
  };

  const handleEvaluateSubmit = (status: EvaluationStatus) => {
    if (!selectedSubmission) return;

    evaluateMutation.mutate({
      id: selectedSubmission.id,
      data: {
        evaluation_status: status,
        score: evaluationScore ? parseFloat(evaluationScore) : undefined,
        remarks: evaluationRemarks || undefined,
      },
    });
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

  // Sort submissions
  const sortedSubmissions = [...submissions].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'app_code') {
      comparison = a.student.app_code.localeCompare(b.student.app_code);
    } else if (sortField === 'student_name') {
      const nameA = `${a.student.first_name} ${a.student.last_name}`;
      const nameB = `${b.student.first_name} ${b.student.last_name}`;
      comparison = nameA.localeCompare(nameB);
    } else if (sortField === 'submitted_at') {
      comparison = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

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
                  placeholder="Search"
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
                  sx={{ width: 250 }}
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

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 60 }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>
                    <TableSortLabel
                      active={sortField === 'app_code'}
                      direction={sortField === 'app_code' ? sortDirection : 'asc'}
                      onClick={() => handleSort('app_code')}
                    >
                      App Code
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>
                    <TableSortLabel
                      active={sortField === 'student_name'}
                      direction={sortField === 'student_name' ? sortDirection : 'asc'}
                      onClick={() => handleSort('student_name')}
                    >
                      Student Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>
                    Submitted Date & Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>
                    Evaluation Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>
                    Click here to Evaluate
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : sortedSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedSubmissions.map((submission, index) => (
                    <TableRow
                      key={submission.id}
                      sx={{
                        bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                        '&:hover': { bgcolor: '#e0f2fe' },
                      }}
                    >
                      <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {submission.student.app_code}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {`${submission.student.first_name} ${submission.student.last_name}`.toUpperCase()}
                      </TableCell>
                      <TableCell>{formatDate(submission.submitted_at)}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[submission.evaluation_status]}
                          size="small"
                          sx={{
                            bgcolor: `${statusColors[submission.evaluation_status]}20`,
                            color: statusColors[submission.evaluation_status],
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEvaluateClick(submission)}
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
                          Evaluate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Evaluate Dialog */}
      <Dialog
        open={evaluateDialogOpen}
        onClose={() => setEvaluateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Evaluate Submission
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Student: {selectedSubmission.student.first_name} {selectedSubmission.student.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                App Code: {selectedSubmission.student.app_code}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                label="Score"
                type="number"
                value={evaluationScore}
                onChange={(e) => setEvaluationScore(e.target.value)}
                inputProps={{ min: 0, max: task?.activity?.points || 20 }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                value={evaluationRemarks}
                onChange={(e) => setEvaluationRemarks(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setEvaluateDialogOpen(false)}
            sx={{ color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleEvaluateSubmit('rejected')}
            disabled={evaluateMutation.isPending}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            onClick={() => handleEvaluateSubmit('evaluated')}
            disabled={evaluateMutation.isPending}
            sx={{
              bgcolor: '#22c55e',
              '&:hover': { bgcolor: '#16a34a' },
            }}
          >
            {evaluateMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              'Approve'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

