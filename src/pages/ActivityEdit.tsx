import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
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
  Tabs,
  Tab,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import {
  Logout,
  Person,
  KeyboardArrowDown,
  Add,
  ArrowBack,
  Save,
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import activityService, { Activity, ActivityTask, DAY_RANGES } from '../services/activity.service';
import { getImageUrl } from '../utils/imageUrl';

export default function ActivityEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const user = authService.getUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Activity form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [price, setPrice] = useState('');

  // Task form state
  const [taskDayRange, setTaskDayRange] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskInstruction, setTaskInstruction] = useState('');
  const [taskVideoManual, setTaskVideoManual] = useState('');
  const [taskQuestion1, setTaskQuestion1] = useState('');
  const [taskQuestion2, setTaskQuestion2] = useState('');
  const [taskPhotoUrl, setTaskPhotoUrl] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const open = Boolean(anchorEl);
  const activityId = parseInt(id || '0', 10);

  // Fetch activity
  const { isLoading: activityLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const data = await activityService.getById(activityId);
      setTitle(data.title || data.name || '');
      setSummary(data.summary || data.description || '');
      setPrice(String(data.price || 0));
      return data;
    },
    enabled: !!activityId,
  });

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['activityTasks', activityId],
    queryFn: () => activityService.getTasks(activityId),
    enabled: !!activityId,
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: (data: Partial<Activity>) => activityService.update(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: Partial<ActivityTask>) => activityService.createTask(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityTasks', activityId] });
      setDialogOpen(false);
      resetTaskForm();
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: Partial<ActivityTask> }) =>
      activityService.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityTasks', activityId] });
      setDialogOpen(false);
      resetTaskForm();
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => activityService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityTasks', activityId] });
    },
  });

  const resetTaskForm = () => {
    setTaskDayRange('');
    setTaskTitle('');
    setTaskInstruction('');
    setTaskVideoManual('');
    setTaskQuestion1('');
    setTaskQuestion2('');
    setTaskPhotoUrl('');
    setEditingTaskId(null);
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

  const handleSaveActivity = () => {
    updateActivityMutation.mutate({
      title,
      summary,
      price: parseFloat(price) || 0,
    });
  };

  const handleOpenTaskDialog = (task?: ActivityTask) => {
    if (task) {
      setEditingTaskId(task.id);
      setTaskDayRange(task.day_range);
      setTaskTitle(task.title);
      setTaskInstruction(task.instruction || '');
      setTaskVideoManual(task.video_manual || '');
      setTaskQuestion1(task.text_question_1 || '');
      setTaskQuestion2(task.text_question_2 || '');
      setTaskPhotoUrl(task.photo_url || '');
    } else {
      resetTaskForm();
    }
    setDialogOpen(true);
  };

  const handleSaveTask = () => {
    const taskData = {
      day_range: taskDayRange,
      title: taskTitle,
      instruction: taskInstruction,
      video_manual: taskVideoManual,
      text_question_1: taskQuestion1,
      text_question_2: taskQuestion2,
      photo_url: taskPhotoUrl,
    };

    if (editingTaskId) {
      updateTaskMutation.mutate({ taskId: editingTaskId, data: taskData });
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (4 MB limit)
    if (file.size > 4 * 1024 * 1024) {
      alert('File size must be less than 4 MB');
      return;
    }

    setUploading(true);
    try {
      const url = await activityService.uploadPhoto(file);
      setTaskPhotoUrl(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  // Group tasks by day range for tabs
  const tasksByDayRange = DAY_RANGES.reduce((acc, dayRange) => {
    acc[dayRange] = tasks.filter((t) => t.day_range === dayRange);
    return acc;
  }, {} as Record<string, ActivityTask[]>);

  const tabsWithTasks = DAY_RANGES.filter((dr) => tasksByDayRange[dr]?.length > 0);

  if (activityLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
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
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/activities')}
          sx={{ mb: 2, color: '#475569' }}
        >
          Back to Activities
        </Button>

        {/* Activity Details */}
        <Paper sx={{ borderRadius: 2, p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Activity Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label="Summary"
              multiline
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <Box>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveActivity}
                disabled={updateActivityMutation.isPending}
                sx={{
                  bgcolor: '#6366f1',
                  '&:hover': { bgcolor: '#4f46e5' },
                  textTransform: 'none',
                }}
              >
                {updateActivityMutation.isPending ? (
                  <CircularProgress size={20} sx={{ color: '#fff' }} />
                ) : (
                  'Save Changes'
                )}
              </Button>
              {updateActivityMutation.isSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Activity updated successfully!
                </Alert>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Activity Tasks */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Activity Tasks
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenTaskDialog()}
                sx={{
                  bgcolor: '#22c55e',
                  '&:hover': { bgcolor: '#16a34a' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Add Task
              </Button>
            </Box>
          </Box>

          {tasksLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : tasks.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
              No tasks added yet. Click "Add Task" to create one.
            </Box>
          ) : (
            <>
              {/* Tabs for Day Ranges */}
              <Tabs
                value={selectedTab}
                onChange={(_, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: '1px solid #e5e7eb',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                  },
                }}
              >
                {tabsWithTasks.map((dayRange) => (
                  <Tab
                    key={dayRange}
                    label={`${dayRange} (${tasksByDayRange[dayRange].length})`}
                  />
                ))}
              </Tabs>

              {/* Task Cards */}
              <Box sx={{ p: 3 }}>
                {tabsWithTasks[selectedTab] && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tasksByDayRange[tabsWithTasks[selectedTab]].map((task) => (
                      <Card key={task.id} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {task.title}
                              </Typography>
                              {task.instruction && (
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                  <strong>Instruction:</strong> {task.instruction}
                                </Typography>
                              )}
                              {task.video_manual && (
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                  <strong>Video:</strong>{' '}
                                  <a href={task.video_manual} target="_blank" rel="noopener noreferrer">
                                    {task.video_manual}
                                  </a>
                                </Typography>
                              )}
                              {task.text_question_1 && (
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                  <strong>Question 1:</strong> {task.text_question_1}
                                </Typography>
                              )}
                              {task.text_question_2 && (
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                  <strong>Question 2:</strong> {task.text_question_2}
                                </Typography>
                              )}
                              {task.photo_url && (
                                <Box sx={{ mt: 2 }}>
                                  <img
                                    src={task.photo_url}
                                    alt="Task"
                                    style={{ maxWidth: 200, borderRadius: 8 }}
                                  />
                                </Box>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenTaskDialog(task)}
                                sx={{ textTransform: 'none' }}
                              >
                                Edit
                              </Button>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this task?')) {
                                    deleteTaskMutation.mutate(task.id);
                                  }
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Add/Edit Task Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingTaskId ? 'Edit Task' : 'Add Activity Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Day Range</InputLabel>
              <Select
                value={taskDayRange}
                label="Day Range"
                onChange={(e) => setTaskDayRange(e.target.value)}
              >
                {DAY_RANGES.map((range) => (
                  <MenuItem key={range} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Title (Day Title)"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Instruction"
              value={taskInstruction}
              onChange={(e) => setTaskInstruction(e.target.value)}
            />

            <TextField
              fullWidth
              label="Video Manual (paste video link)"
              value={taskVideoManual}
              onChange={(e) => setTaskVideoManual(e.target.value)}
              placeholder="https://youtube.com/..."
            />

            <TextField
              fullWidth
              label="Text Question 1"
              value={taskQuestion1}
              onChange={(e) => setTaskQuestion1(e.target.value)}
            />

            <TextField
              fullWidth
              label="Text Question 2"
              value={taskQuestion2}
              onChange={(e) => setTaskQuestion2(e.target.value)}
            />

            {/* Photo Upload */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Upload Photo (Max 4 MB)
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose Photo'}
              </Button>
              {taskPhotoUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={getImageUrl(taskPhotoUrl)}
                    alt="Preview"
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setTaskPhotoUrl('')}
                    sx={{ ml: 2 }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTask}
            disabled={!taskDayRange || !taskTitle || createTaskMutation.isPending || updateTaskMutation.isPending}
            sx={{
              bgcolor: '#6366f1',
              '&:hover': { bgcolor: '#4f46e5' },
            }}
          >
            {createTaskMutation.isPending || updateTaskMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : editingTaskId ? (
              'Save Changes'
            ) : (
              'Add Task'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

