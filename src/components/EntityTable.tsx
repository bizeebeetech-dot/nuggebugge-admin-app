import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  InputAdornment,
  TableSortLabel,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  Add,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import entityService, { Entity, EntityType } from '../services/entity.service';

interface EntityTableProps {
  entityType: EntityType;
  title: string;
}

type SortDirection = 'asc' | 'desc';

export default function EntityTable({ entityType, title }: EntityTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [deletingEntity, setDeletingEntity] = useState<Entity | null>(null);
  const [entityName, setEntityName] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Fetch entities
  const { data: entities = [], isLoading } = useQuery({
    queryKey: ['entities', entityType, search],
    queryFn: () => entityService.getAll(entityType, search || undefined),
  });

  // Fetch states for district dropdown
  const { data: states = [] } = useQuery({
    queryKey: ['entities', 'state'],
    queryFn: () => entityService.getAll('state'),
    enabled: entityType === 'district', // Only fetch when on district tab
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: { name: string; state_id?: string }) => 
      entityService.create(entityType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
      queryClient.invalidateQueries({ queryKey: ['school-dropdowns'] }); // Refresh school dropdowns
      handleCloseDialog();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { name: string; state_id?: string } }) =>
      entityService.update(entityType, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
      queryClient.invalidateQueries({ queryKey: ['school-dropdowns'] }); // Refresh school dropdowns
      handleCloseDialog();
    },
  });

  // Toggle active mutation
  const toggleMutation = useMutation({
    mutationFn: (id: string | number) => entityService.toggleActive(entityType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => entityService.delete(entityType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities', entityType] });
      queryClient.invalidateQueries({ queryKey: ['school-dropdowns'] }); // Refresh school dropdowns
      setDeleteDialogOpen(false);
      setDeletingEntity(null);
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleOpenDialog = (entity?: Entity) => {
    if (entity) {
      setEditingEntity(entity);
      setEntityName(entity.name);
      setSelectedStateId(entity.state_id || '');
    } else {
      setEditingEntity(null);
      setEntityName('');
      setSelectedStateId('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEntity(null);
    setEntityName('');
    setSelectedStateId('');
  };

  const handleSubmit = () => {
    if (!entityName.trim()) return;

    const data: { name: string; state_id?: string } = {
      name: entityName.trim(),
    };

    // Include state_id for districts
    if (entityType === 'district' && selectedStateId) {
      data.state_id = selectedStateId;
    }

    if (editingEntity) {
      updateMutation.mutate({ id: editingEntity.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteClick = (entity: Entity) => {
    setDeletingEntity(entity);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingEntity) {
      deleteMutation.mutate(deletingEntity.id);
    }
  };

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Get state name by ID
  const getStateName = (stateId: string | undefined): string => {
    if (!stateId) return '-';
    const state = states.find(s => String(s.id) === stateId);
    return state?.name || '-';
  };

  // Sort entities
  const sortedEntities = [...entities].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Check if we need to show state column (for districts)
  const showStateColumn = entityType === 'district';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
          {title.toUpperCase()}
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
          Add {title}
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          size="small"
          placeholder={`Search ${title.toLowerCase()}...`}
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#475569', width: 80 }}>No</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#475569' }}>
                <TableSortLabel
                  active
                  direction={sortDirection}
                  onClick={handleSort}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              {showStateColumn && (
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>State</TableCell>
              )}
              <TableCell sx={{ fontWeight: 600, color: '#475569', width: 100 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#475569', width: 150 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={showStateColumn ? 5 : 4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : sortedEntities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showStateColumn ? 5 : 4} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                  No {title.toLowerCase()}s found. Click "Add {title}" to create one.
                </TableCell>
              </TableRow>
            ) : (
              sortedEntities.map((entity, index) => (
                <TableRow
                  key={entity.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? '#f0f9ff' : '#fff',
                    '&:hover': { bgcolor: '#e0f2fe' },
                  }}
                >
                  <TableCell sx={{ color: '#3b82f6', fontWeight: 500 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{entity.name}</TableCell>
                  {showStateColumn && (
                    <TableCell>{getStateName(entity.state_id)}</TableCell>
                  )}
                  <TableCell>
                    <Tooltip title={entity.is_active ? 'Active' : 'Inactive'}>
                      <Switch
                        checked={entity.is_active}
                        onChange={() => toggleMutation.mutate(entity.id)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#22c55e',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: '#22c55e',
                          },
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(entity)}
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
                          onClick={() => handleDeleteClick(entity)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingEntity ? `Edit ${title}` : `Add New ${title}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Name"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !showStateColumn && handleSubmit()}
            placeholder={`Enter ${title.toLowerCase()} name`}
            sx={{ mt: 2 }}
          />
          
          {/* State dropdown for districts */}
          {showStateColumn && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedStateId}
                label="State"
                onChange={(e) => setSelectedStateId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select State</em>
                </MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.id} value={String(state.id)}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
              {states.length === 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  No states available. Please add states first.
                </Typography>
              )}
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!entityName.trim() || createMutation.isPending || updateMutation.isPending}
            sx={{
              bgcolor: '#6366f1',
              '&:hover': { bgcolor: '#4f46e5' },
            }}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : editingEntity ? (
              'Update'
            ) : (
              'Add'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deletingEntity?.name}"?
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
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
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
