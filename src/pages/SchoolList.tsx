import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  Grid,
  Chip,
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
  ArrowBack,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import schoolService, { School, CreateSchoolData, UpdateSchoolData } from '../services/school.service';

export default function SchoolList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formStateId, setFormStateId] = useState('');
  const [formDistrictId, setFormDistrictId] = useState('');
  const [formBoardId, setFormBoardId] = useState('');

  const open = Boolean(anchorEl);

  // Fetch schools
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools', search],
    queryFn: () => schoolService.getAll(search || undefined),
  });

  // Fetch dropdowns using React Query
  const { data: dropdowns, isLoading: dropdownsLoading } = useQuery({
    queryKey: ['school-dropdowns'],
    queryFn: () => schoolService.getDropdowns(),
  });

  // Filtered districts based on selected state
  const filteredDistricts = dropdowns?.districts?.filter(d => 
    !formStateId || d.state_id === formStateId
  ) || [];

  // Reset district if state changes and current district doesn't belong to new state
  useEffect(() => {
    if (formStateId && formDistrictId && dropdowns?.districts) {
      const districtBelongsToState = dropdowns.districts.some(
        d => d.id === formDistrictId && d.state_id === formStateId
      );
      if (!districtBelongsToState) {
        setFormDistrictId('');
      }
    }
  }, [formStateId, formDistrictId, dropdowns?.districts]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateSchoolData) => schoolService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      handleCloseDialog();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchoolData }) =>
      schoolService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      handleCloseDialog();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => schoolService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setDeleteDialogOpen(false);
      setDeletingSchool(null);
    },
  });

  const resetForm = () => {
    setFormName('');
    setFormStateId('');
    setFormDistrictId('');
    setFormBoardId('');
    setEditingSchool(null);
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleOpenDialog = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      setFormName(school.name);
      setFormStateId(school.state_id || '');
      setFormDistrictId(school.district_id || '');
      setFormBoardId(school.board_id || '');
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
    if (!formName.trim()) return;

    const data = {
      name: formName.trim(),
      state_id: formStateId || undefined,
      district_id: formDistrictId || undefined,
      board_id: formBoardId || undefined,
    };

    if (editingSchool) {
      updateMutation.mutate({ id: editingSchool.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteClick = (school: School) => {
    setDeletingSchool(school);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingSchool) {
      deleteMutation.mutate(deletingSchool.id);
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
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const noDropdownData = !dropdownsLoading && 
    (!dropdowns?.states?.length && !dropdowns?.districts?.length && !dropdowns?.boards?.length);

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
              Schools Management
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
        {/* Info Alert if no dropdown data */}
        {noDropdownData && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>No dropdown data available.</strong> Please add States, Districts, and School Boards in the "Add Entities" page first.
          </Alert>
        )}

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  LIST OF SCHOOLS
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage schools with state, district, and board information
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
                Add School
              </Button>
            </Box>

            {/* Search */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search by school name, state, district, or board..."
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
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 60 }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>School Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>State</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>District</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Board</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 100 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', width: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : schools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <SchoolIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                      <Typography color="text.secondary">No schools found</Typography>
                      <Button
                        variant="text"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{ mt: 1 }}
                      >
                        Add your first school
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  schools.map((school, index) => (
                    <TableRow
                      key={school.id}
                      sx={{
                        bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                        '&:hover': { bgcolor: '#e0f2fe' },
                      }}
                    >
                      <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{school.name}</TableCell>
                      <TableCell>{school.state_name || '-'}</TableCell>
                      <TableCell>{school.district_name || '-'}</TableCell>
                      <TableCell>{school.board_name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={school.is_active ? 'Active' : 'Inactive'}
                          color={school.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(school)}
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
                              onClick={() => handleDeleteClick(school)}
                              sx={{
                                border: '1px solid #f87171',
                                color: '#f87171',
                                '&:hover': { bgcolor: '#fef2f2' },
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

      {/* Add/Edit School Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingSchool ? 'Edit School' : 'Add New School'}
        </DialogTitle>
        <DialogContent>
          {dropdownsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="School Name *"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter school name"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={formStateId}
                    label="State"
                    onChange={(e) => setFormStateId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select State</em>
                    </MenuItem>
                    {dropdowns?.states?.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {!dropdowns?.states?.length && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      No states available. Add states in "Add Entities" page.
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>District</InputLabel>
                  <Select
                    value={formDistrictId}
                    label="District"
                    onChange={(e) => setFormDistrictId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select District</em>
                    </MenuItem>
                    {filteredDistricts.map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {!dropdowns?.districts?.length && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      No districts available. Add districts in "Add Entities" page.
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Board</InputLabel>
                  <Select
                    value={formBoardId}
                    label="Board"
                    onChange={(e) => setFormBoardId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select Board</em>
                    </MenuItem>
                    {dropdowns?.boards?.map((board) => (
                      <MenuItem key={board.id} value={board.id}>
                        {board.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {!dropdowns?.boards?.length && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      No boards available. Add school boards in "Add Entities" page.
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formName.trim() ||
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
            ) : editingSchool ? (
              'Update'
            ) : (
              'Add School'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete school "<strong>{deletingSchool?.name}</strong>"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
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
