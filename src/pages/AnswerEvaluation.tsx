import { useState, useEffect, useRef } from 'react';
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
  Checkbox,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Logout,
  Person,
  KeyboardArrowDown,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { activityService } from '../services/activity.service';
import { submissionService, Submission } from '../services/submission.service';
import { studentOrderService } from '../services/student-order.service';
import { taskService } from '../services/submission.service';
import { getImageUrl } from '../utils/imageUrl';

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
      id={`answer-tabpanel-${index}`}
      aria-labelledby={`answer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface QuestionEvaluation {
  taskId: number;
  day: number;
  question: string;
  answer: string;
  accept: boolean | null;
  reject: boolean | null;
  remarks: string;
  submissionId?: number;
}

interface PhotoEvaluation {
  taskId: number;
  day: number;
  photoUrl: string;
  accept: boolean | null;
  reject: boolean | null;
  reason: string;
  submissionId?: number;
}

export default function AnswerEvaluation() {
  const { studentId, activityId } = useParams<{ studentId: string; activityId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getUser();

  const [tabValue, setTabValue] = useState(0); // 0 = Questions, 1 = Photos
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [questionEvaluations, setQuestionEvaluations] = useState<QuestionEvaluation[]>([]);
  const [photoEvaluations, setPhotoEvaluations] = useState<PhotoEvaluation[]>([]);
  
  // Refs to track initialization and prevent infinite loops
  const questionEvaluationsInitialized = useRef(false);
  const photoEvaluationsInitialized = useRef(false);
  const lastActivityTasksLength = useRef(0);
  const lastSubmissionsLength = useRef(0);

  const open = Boolean(anchorEl);

  // Fetch student order to get student info
  const { data: studentOrder } = useQuery({
    queryKey: ['student-order', studentId, activityId],
    queryFn: async () => {
      if (!studentId || !activityId) return null;
      const orders = await studentOrderService.getByActivityId(parseInt(activityId));
      return orders.find((o) => o.student_id === parseInt(studentId));
    },
    enabled: !!studentId && !!activityId,
  });

  // Fetch activity tasks
  const { data: activityTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['activity-tasks', activityId],
    queryFn: () => activityService.getTasks(parseInt(activityId!)),
    enabled: !!activityId,
  });

  // Fetch tasks (for submissions)
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', activityId],
    queryFn: () => taskService.getAll(parseInt(activityId!)),
    enabled: !!activityId,
  });

  // Fetch submissions for this student and activity
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissions', studentId, activityId],
    queryFn: async () => {
      if (!studentId || !activityId) return [];
      const allSubmissions: Submission[] = [];
      for (const task of tasks) {
        try {
          const taskSubmissions = await submissionService.getByTask(task.id);
          const studentSubmission = taskSubmissions.find((s) => s.student_id === parseInt(studentId));
          if (studentSubmission) {
            allSubmissions.push(studentSubmission);
          }
        } catch (error) {
          // Task might not have submissions yet
        }
      }
      return allSubmissions;
    },
    enabled: !!studentId && !!activityId && tasks.length > 0,
  });

  // Initialize question evaluations when data loads
  useEffect(() => {
    if (activityTasks.length > 0 && !tasksLoading && !submissionsLoading) {
      // Check if data has actually changed
      const dataChanged = 
        activityTasks.length !== lastActivityTasksLength.current ||
        submissions.length !== lastSubmissionsLength.current ||
        !questionEvaluationsInitialized.current;
      
      if (dataChanged) {
        const evaluations: QuestionEvaluation[] = [];
        // Find the submission for this activity (one submission per student-activity-task)
        const activityTask = tasks.find((t) => t.activity_id === parseInt(activityId!));
        const submission = activityTask 
          ? submissions.find((s) => s.task_id === activityTask.id && s.student_id === parseInt(studentId!))
          : undefined;
        
        // Parse submission_data to get stored evaluations
        let storedEvaluations: Record<number, any> = {};
        if (submission?.submission_data) {
          try {
            const submissionData = JSON.parse(submission.submission_data);
            storedEvaluations = submissionData.evaluations || {};
          } catch (e) {
            // Invalid JSON, ignore
          }
        }
        
        activityTasks.forEach((task, index) => {
          // Preserve existing state if we've already initialized
          const existingEval = questionEvaluationsInitialized.current 
            ? questionEvaluations.find(e => e.taskId === task.id)
            : null;
          
          // Get stored evaluation for this activity task
          const storedEval = storedEvaluations[task.id];
          
          // Get answer text - show "Submitted" unless we have actual answer text
          let answerText = 'Submitted';
          if (storedEval?.answer && storedEval.answer !== 'Submitted' && !storedEval.answer.startsWith('{')) {
            // Only use stored answer if it's not JSON and not "Submitted"
            answerText = storedEval.answer;
          } else if (submission?.submission_data) {
            try {
              const submissionData = JSON.parse(submission.submission_data);
              // Check for answer in various possible locations
              const taskEval = submissionData.evaluations?.[task.id];
              if (taskEval?.answer && taskEval.answer !== 'Submitted' && !taskEval.answer.startsWith('{')) {
                answerText = taskEval.answer;
              } else if (submissionData.answer && submissionData.answer !== 'Submitted' && !submissionData.answer.startsWith('{')) {
                answerText = submissionData.answer;
              } else if (submissionData.text_answer && !submissionData.text_answer.startsWith('{')) {
                answerText = submissionData.text_answer;
              } else if (submissionData.response && !submissionData.response.startsWith('{')) {
                answerText = submissionData.response;
              } else if (taskEval?.text_answer && !taskEval.text_answer.startsWith('{')) {
                answerText = taskEval.text_answer;
              } else if (taskEval?.response && !taskEval.response.startsWith('{')) {
                answerText = taskEval.response;
              }
              // If no valid answer found, keep "Submitted" (don't show JSON)
            } catch (e) {
              // If not JSON and looks like actual text (not JSON), use it
              if (submission.submission_data && !submission.submission_data.startsWith('{') && !submission.submission_data.startsWith('[')) {
                answerText = submission.submission_data;
              }
              // Otherwise keep "Submitted"
            }
          }
          
          evaluations.push({
            taskId: task.id,
            day: index + 1,
            question: task.text_question_1 || task.text_question_2 || task.title || `Question ${index + 1}`,
            answer: answerText,
            // Use existing state if available, otherwise use stored evaluation, otherwise use submission status
            accept: existingEval?.accept !== undefined && existingEval?.accept !== null
              ? existingEval.accept
              : (storedEval?.accept !== undefined && storedEval?.accept !== null
                ? storedEval.accept
                : (submission?.evaluation_status === 'evaluated' ? true : submission?.evaluation_status === 'rejected' ? false : null)),
            reject: existingEval?.reject !== undefined && existingEval?.reject !== null
              ? existingEval.reject
              : (storedEval?.reject !== undefined && storedEval?.reject !== null
                ? storedEval.reject
                : (submission?.evaluation_status === 'rejected' ? true : null)),
            remarks: existingEval?.remarks || storedEval?.remarks || submission?.remarks || '',
            submissionId: submission?.id,
          });
        });
        
        setQuestionEvaluations(evaluations);
        questionEvaluationsInitialized.current = true;
        lastActivityTasksLength.current = activityTasks.length;
        lastSubmissionsLength.current = submissions.length;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityTasks.length, tasks.length, submissions.length, tasksLoading, submissionsLoading]);

  // Initialize photo evaluations
  useEffect(() => {
    if (activityTasks.length > 0 && !tasksLoading && !submissionsLoading) {
      // Check if data has actually changed
      const dataChanged = 
        activityTasks.length !== lastActivityTasksLength.current ||
        submissions.length !== lastSubmissionsLength.current ||
        !photoEvaluationsInitialized.current;
      
      if (dataChanged) {
        const evaluations: PhotoEvaluation[] = [];
        
        // Find the submission for this activity (one submission per student-activity-task)
        const activityTask = tasks.find((t) => t.activity_id === parseInt(activityId!));
        const submission = activityTask 
          ? submissions.find((s) => s.task_id === activityTask.id && s.student_id === parseInt(studentId!))
          : undefined;
        
        // Parse submission_data to get stored photo evaluations
        let storedPhotoEvaluations: Record<number, any> = {};
        if (submission?.submission_data) {
          try {
            const submissionData = JSON.parse(submission.submission_data);
            storedPhotoEvaluations = submissionData.photoEvaluations || {};
          } catch (e) {
            // Invalid JSON, ignore
          }
        }
        
        activityTasks.forEach((task, index) => {
          if (task.photo_url) {
            // Preserve existing state if we've already initialized
            const existingEval = photoEvaluationsInitialized.current
              ? photoEvaluations.find(e => e.taskId === task.id)
              : null;
            
            // Get stored photo evaluation for this activity task
            const storedEval = storedPhotoEvaluations[task.id];
            
            evaluations.push({
              taskId: task.id,
              day: index + 1,
              photoUrl: task.photo_url,
              // Use existing state if available, otherwise use stored evaluation
              accept: existingEval?.accept !== undefined && existingEval?.accept !== null
                ? existingEval.accept
                : (storedEval?.accept !== undefined && storedEval?.accept !== null
                  ? storedEval.accept
                  : false),
              reject: existingEval?.reject !== undefined && existingEval?.reject !== null
                ? existingEval.reject
                : (storedEval?.reject !== undefined && storedEval?.reject !== null
                  ? storedEval.reject
                  : false),
              reason: existingEval?.reason || storedEval?.reason || '',
              submissionId: submission?.id,
            });
          }
        });
        setPhotoEvaluations(evaluations);
        photoEvaluationsInitialized.current = true;
        lastSubmissionsLength.current = submissions.length;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityTasks.length, tasks.length, submissions.length, tasksLoading, submissionsLoading]);

  // Update evaluation mutation for questions
  const updateEvaluationMutation = useMutation({
    mutationFn: async (data: { questionEvaluations: QuestionEvaluation[] }) => {
      console.log('Mutation called with data:', data);
      console.log('Available tasks:', tasks);
      console.log('Activity ID:', activityId);
      const results = [];
      
      // Find or create a task for this activity
      let task = tasks.find((t) => t.activity_id === parseInt(activityId!));
      
      // If no task exists, create one
      if (!task && activityId) {
        try {
          console.log(`Creating new task for activity ${activityId}`);
          task = await taskService.create({
            activity_id: parseInt(activityId!),
            task_number: 'task_1',
            title: 'Evaluation Task',
            description: 'Task for student evaluation',
          });
          console.log('Created task:', task);
        } catch (error: any) {
          console.error('Error creating task:', error);
          // If creation fails, try to get tasks again
          const allTasks = await taskService.getAll(parseInt(activityId!));
          task = allTasks.find((t) => t.activity_id === parseInt(activityId!));
          if (!task && allTasks.length > 0) {
            task = allTasks[0]; // Use first available task
          }
        }
      }
      
      if (!task) {
        throw new Error('Unable to find or create a task for this activity. Please ensure the activity has at least one task.');
      }
      
      console.log(`Using task ${task.id} for evaluations`);
      
      // Create or find one submission for all evaluations (one submission per student-activity-task combination)
      let submission = submissions.find((s) => 
        s.task_id === task.id && s.student_id === parseInt(studentId!)
      );
      
      // If not found, create one
      if (!submission) {
        try {
          console.log(`Creating new submission for student ${studentId}, task ${task.id}`);
          submission = await submissionService.create({
            student_id: parseInt(studentId!),
            task_id: task.id,
            submission_data: JSON.stringify({ 
              activityId: parseInt(activityId!),
              evaluations: {}
            }),
          });
          console.log('Created submission:', submission);
        } catch (error: any) {
          // If creation fails because it already exists, fetch it
          if (error?.response?.status === 400) {
            const taskSubmissions = await submissionService.getByTask(task.id);
            submission = taskSubmissions.find((s) => s.student_id === parseInt(studentId!));
            if (!submission) {
              throw new Error('Failed to create or find submission');
            }
          } else {
            throw error;
          }
        }
      }
      
      // Store all evaluations in submission_data
      const submissionData = submission.submission_data ? JSON.parse(submission.submission_data) : { evaluations: {} };
      if (!submissionData.evaluations) {
        submissionData.evaluations = {};
      }
      
      // Store all evaluations in submission_data
      for (const evalData of data.questionEvaluations) {
        console.log(`Processing evaluation for activity task ${evalData.taskId}, day ${evalData.day}`);
        
        // Store evaluation data
        submissionData.evaluations[evalData.taskId] = {
          day: evalData.day,
          question: evalData.question,
          answer: evalData.answer,
          accept: evalData.accept,
          reject: evalData.reject,
          remarks: evalData.remarks,
        };
      }
      
      // Determine overall status and remarks
      const hasAccepted = data.questionEvaluations.some(e => e.accept === true);
      const hasRejected = data.questionEvaluations.some(e => e.reject === true);
      const overallStatus = hasAccepted ? 'evaluated' : hasRejected ? 'rejected' : 'submitted_for_evaluation';
      
      const allRemarks = data.questionEvaluations
        .filter(e => e.reject && e.remarks)
        .map(e => `Day ${e.day}: ${e.remarks}`)
        .join('; ');
      
      // Update the submission with all evaluations
      try {
        console.log(`Calling API: PATCH /submissions/${submission.id}/evaluate with status: ${overallStatus}`);
        
        // First update evaluation status
        const result = await submissionService.evaluate(submission.id, {
          evaluation_status: overallStatus as any,
          remarks: allRemarks || undefined,
        });
        
        // Then update submission_data with all evaluations
        await submissionService.update(submission.id, {
          submission_data: JSON.stringify(submissionData),
        });
        
        console.log(`Successfully evaluated submission ${submission.id}:`, result);
        
        // Update all evaluations with the submissionId
        const updatedEvals = data.questionEvaluations.map(e => ({ ...e, submissionId: submission.id }));
        results.push(...updatedEvals);
      } catch (error: any) {
        console.error(`Error evaluating submission ${submission.id}:`, error);
        console.error('Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        throw error;
      }
      
      console.log(`Successfully processed ${results.length} evaluations`);
      return results;
    },
    onSuccess: async (savedEvaluations) => {
      // Update local state immediately with saved values (including submissionIds)
      setQuestionEvaluations(savedEvaluations);
      // Reset initialization flag so we can re-initialize with new submission data
      questionEvaluationsInitialized.current = false;
      // Refetch submissions to get updated data
      await queryClient.invalidateQueries({ queryKey: ['submissions', studentId, activityId] });
      await queryClient.refetchQueries({ queryKey: ['submissions', studentId, activityId] });
      alert('Evaluation updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating evaluation:', error);
      alert(`Failed to update evaluation: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
    },
  });

  // Update evaluation mutation for photos
  const updatePhotoEvaluationMutation = useMutation({
    mutationFn: async (data: { photoEvaluations: PhotoEvaluation[] }) => {
      console.log('Photo mutation called with data:', data);
      console.log('Available tasks:', tasks);
      console.log('Activity ID:', activityId);
      const results = [];
      
      // Find or create a task for this activity
      let task = tasks.find((t) => t.activity_id === parseInt(activityId!));
      
      // If no task exists, create one
      if (!task && activityId) {
        try {
          console.log(`Creating new task for activity ${activityId}`);
          task = await taskService.create({
            activity_id: parseInt(activityId!),
            task_number: 'task_1',
            title: 'Evaluation Task',
            description: 'Task for student evaluation',
          });
          console.log('Created task:', task);
        } catch (error: any) {
          console.error('Error creating task:', error);
          // If creation fails, try to get tasks again
          const allTasks = await taskService.getAll(parseInt(activityId!));
          task = allTasks.find((t) => t.activity_id === parseInt(activityId!));
          if (!task && allTasks.length > 0) {
            task = allTasks[0]; // Use first available task
          }
        }
      }
      
      if (!task) {
        throw new Error('Unable to find or create a task for this activity. Please ensure the activity has at least one task.');
      }
      
      console.log(`Using task ${task.id} for photo evaluations`);
      
      // Create or find one submission for all photo evaluations (one submission per student-activity-task)
      let submission = submissions.find((s) => 
        s.task_id === task.id && s.student_id === parseInt(studentId!)
      );
      
      // If not found, create one
      if (!submission) {
        try {
          console.log(`Creating new submission for student ${studentId}, task ${task.id}`);
          submission = await submissionService.create({
            student_id: parseInt(studentId!),
            task_id: task.id,
            submission_data: JSON.stringify({ 
              activityId: parseInt(activityId!),
              photoEvaluations: {}
            }),
          });
          console.log('Created submission:', submission);
        } catch (error: any) {
          // If creation fails because it already exists, fetch it
          if (error?.response?.status === 400) {
            const taskSubmissions = await submissionService.getByTask(task.id);
            submission = taskSubmissions.find((s) => s.student_id === parseInt(studentId!));
            if (!submission) {
              throw new Error('Failed to create or find submission');
            }
          } else {
            throw error;
          }
        }
      }
      
      // Store all photo evaluations in submission_data
      const submissionData = submission.submission_data ? JSON.parse(submission.submission_data) : { photoEvaluations: {} };
      if (!submissionData.photoEvaluations) {
        submissionData.photoEvaluations = {};
      }
      
      // Store all photo evaluations
      for (const photoEval of data.photoEvaluations) {
        console.log(`Processing photo evaluation for activity task ${photoEval.taskId}, day ${photoEval.day}`);
        
        // Store photo evaluation data
        submissionData.photoEvaluations[photoEval.taskId] = {
          day: photoEval.day,
          photoUrl: photoEval.photoUrl,
          accept: photoEval.accept,
          reject: photoEval.reject,
          reason: photoEval.reason,
        };
      }
      
      // Determine overall status and remarks
      const hasAccepted = data.photoEvaluations.some(e => e.accept === true);
      const hasRejected = data.photoEvaluations.some(e => e.reject === true);
      const overallStatus = hasAccepted ? 'evaluated' : hasRejected ? 'rejected' : 'submitted_for_evaluation';
      
      const allReasons = data.photoEvaluations
        .filter(e => e.reject && e.reason)
        .map(e => `Day ${e.day}: ${e.reason}`)
        .join('; ');
      
      // Update the submission with all photo evaluations
      try {
        console.log(`Calling API: PATCH /submissions/${submission.id}/evaluate with status: ${overallStatus}`);
        
        // First update evaluation status
        const result = await submissionService.evaluate(submission.id, {
          evaluation_status: overallStatus as any,
          remarks: allReasons || undefined,
        });
        
        // Then update submission_data with all photo evaluations
        await submissionService.update(submission.id, {
          submission_data: JSON.stringify(submissionData),
        });
        
        console.log(`Successfully evaluated submission ${submission.id}:`, result);
        
        // Update all photo evaluations with the submissionId
        const updatedEvals = data.photoEvaluations.map(e => ({ ...e, submissionId: submission.id }));
        results.push(...updatedEvals);
      } catch (error: any) {
        console.error(`Error evaluating submission ${submission.id}:`, error);
        console.error('Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        throw error;
      }
      
      console.log(`Successfully processed ${results.length} photo evaluations`);
      return results;
    },
    onSuccess: async (savedEvaluations) => {
      // Update local state immediately with saved values
      setPhotoEvaluations(savedEvaluations);
      // Refetch submissions to get updated data
      await queryClient.invalidateQueries({ queryKey: ['submissions', studentId, activityId] });
      await queryClient.refetchQueries({ queryKey: ['submissions', studentId, activityId] });
      alert('Photo evaluation updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating photo evaluation:', error);
      alert(`Failed to update photo evaluation: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
    },
  });

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

  const handleAcceptAll = () => {
    const updated = questionEvaluations.map((evaluation) => ({
      ...evaluation,
      accept: true,
      reject: false,
    }));
    setQuestionEvaluations(updated);
  };

  const handleAcceptAllPhotos = () => {
    const updated = photoEvaluations.map((evaluation) => ({
      ...evaluation,
      accept: true,
      reject: false,
    }));
    setPhotoEvaluations(updated);
  };

  const handleQuestionAccept = (index: number, event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      event.stopPropagation();
    }
    const updated = [...questionEvaluations];
    const currentAccept = updated[index]?.accept;
    updated[index] = {
      ...updated[index],
      accept: !currentAccept, // Toggle accept
      reject: false, // Always uncheck reject when accept is toggled
      remarks: !currentAccept ? updated[index].remarks : '', // Clear remarks if unchecking accept
    };
    setQuestionEvaluations(updated);
  };

  const handleQuestionReject = (index: number, event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      event.stopPropagation();
    }
    const updated = [...questionEvaluations];
    const currentReject = updated[index]?.reject;
    updated[index] = {
      ...updated[index],
      reject: !currentReject, // Toggle reject
      accept: false, // Always uncheck accept when reject is toggled
      remarks: !currentReject ? '' : updated[index].remarks, // Clear remarks if unchecking reject
    };
    setQuestionEvaluations(updated);
  };

  const handlePhotoAccept = (index: number) => {
    const updated = [...photoEvaluations];
    updated[index] = {
      ...updated[index],
      accept: true,
      reject: false,
    };
    setPhotoEvaluations(updated);
  };

  const handlePhotoReject = (index: number) => {
    const updated = [...photoEvaluations];
    updated[index] = {
      ...updated[index],
      accept: false,
      reject: true,
    };
    setPhotoEvaluations(updated);
  };

  const handleUpdate = () => {
    console.log('Updating evaluations:', questionEvaluations);
    // Always allow update - will create submissions if needed
    updateEvaluationMutation.mutate({ questionEvaluations });
  };

  const handleUpdatePhotos = () => {
    console.log('Updating photo evaluations:', photoEvaluations);
    // Always allow update - will create submissions if needed
    updatePhotoEvaluationMutation.mutate({ photoEvaluations });
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const studentName = studentOrder?.student?.name || 'Loading...';
  const appCode = studentOrder?.student?.app_code || 'Loading...';

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
            onClick={() => navigate('/evaluation')}
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
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                ANSWER PAGE:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Student Name: {studentName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                APP ID: {appCode}
              </Typography>
            </Box>
            {tabValue === 0 && (
              <Button
                variant="text"
                onClick={handleAcceptAll}
                sx={{ textTransform: 'none', color: '#6366f1' }}
              >
                Click here to Accept all answers
              </Button>
            )}
            {tabValue === 1 && (
              <Button
                variant="text"
                onClick={handleAcceptAllPhotos}
                sx={{ textTransform: 'none', color: '#6366f1' }}
              >
                Click here to Accept all Photos
              </Button>
            )}
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
              <Tab label="QUESTIONS" />
              <Tab label="PHOTOS" />
            </Tabs>
          </Box>

          {/* Questions Tab */}
          <TabPanel value={tabValue} index={0}>
            {tasksLoading || submissionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Day</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Question</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Answer</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Accept</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Reject</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {questionEvaluations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                            No questions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        questionEvaluations.map((evaluation, index) => (
                          <TableRow key={evaluation.taskId} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>{evaluation.day}</TableCell>
                            <TableCell>{evaluation.question}</TableCell>
                            <TableCell>{evaluation.answer}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={!!evaluation.accept}
                                onChange={(e) => handleQuestionAccept(index, e)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                  color: '#22c55e',
                                  '&.Mui-checked': {
                                    color: '#22c55e',
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={!!evaluation.reject}
                                onChange={(e) => handleQuestionReject(index, e)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                  color: '#ef4444',
                                  '&.Mui-checked': {
                                    color: '#ef4444',
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                placeholder="Only for REJECTION"
                                value={evaluation.remarks}
                                onChange={(e) => {
                                  const updated = [...questionEvaluations];
                                  updated[index].remarks = e.target.value;
                                  setQuestionEvaluations(updated);
                                }}
                                disabled={!evaluation.reject}
                                sx={{ width: 200 }}
                                fullWidth
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={updateEvaluationMutation.isPending}
                    sx={{
                      bgcolor: '#6366f1',
                      '&:hover': { bgcolor: '#4f46e5' },
                      textTransform: 'none',
                      px: 4,
                    }}
                  >
                    {updateEvaluationMutation.isPending ? (
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                    ) : (
                      'UPDATE'
                    )}
                  </Button>
                </Box>
              </>
            )}
          </TabPanel>

          {/* Photos Tab */}
          <TabPanel value={tabValue} index={1}>
            {tasksLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {photoEvaluations.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                        No photos found
                      </Typography>
                    </Grid>
                  ) : (
                    photoEvaluations.map((evaluation, index) => (
                      <Grid item xs={12} md={4} key={evaluation.taskId}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="200"
                            image={getImageUrl(evaluation.photoUrl)}
                            alt={`Day ${evaluation.day} Photo`}
                          />
                          <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Day-{evaluation.day}: Photo-1
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                              <Button
                                size="small"
                                variant={evaluation.accept ? 'contained' : 'outlined'}
                                color="success"
                                onClick={() => handlePhotoAccept(index)}
                                startIcon={<CheckCircle />}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                variant={evaluation.reject ? 'contained' : 'outlined'}
                                color="error"
                                onClick={() => handlePhotoReject(index)}
                                startIcon={<Cancel />}
                              >
                                Reject
                              </Button>
                            </Box>
                            <TextField
                              fullWidth
                              size="small"
                              label="Reason"
                              placeholder="Reason for rejection"
                              value={evaluation.reason}
                              onChange={(e) => {
                                const updated = [...photoEvaluations];
                                updated[index].reason = e.target.value;
                                setPhotoEvaluations(updated);
                              }}
                              disabled={!evaluation.reject}
                            />
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleUpdatePhotos}
                    disabled={updatePhotoEvaluationMutation.isPending}
                    sx={{
                      bgcolor: '#6366f1',
                      '&:hover': { bgcolor: '#4f46e5' },
                      textTransform: 'none',
                      px: 4,
                    }}
                  >
                    {updatePhotoEvaluationMutation.isPending ? (
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                    ) : (
                      'UPDATE'
                    )}
                  </Button>
                </Box>
              </>
            )}
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
}

