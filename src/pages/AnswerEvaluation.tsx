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
  ArrowBack,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { activityService, ActivityTask } from '../services/activity.service';
import { submissionService } from '../services/submission.service';
import { taskService } from '../services/submission.service';
import { studentService } from '../services/submission.service';
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
      // Fetch all submissions for this student and activity
      try {
        const allSubmissions = await submissionService.getAll(undefined, undefined);
        // Filter submissions for this student and activity
        return allSubmissions.filter(
          (s) => s.student_id === parseInt(studentId) && s.activity_id === parseInt(activityId)
        );
      } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
      }
    },
    enabled: !!studentId && !!activityId,
  });

  // Fetch student info directly
  const { data: studentInfoDirect } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      try {
        return await studentService.getById(parseInt(studentId));
      } catch (error) {
        return null;
      }
    },
    enabled: !!studentId,
  });

  // Initialize question evaluations from all submissions
  useEffect(() => {
    if (!submissionsLoading && !tasksLoading && submissions.length >= 0 && activityTasks.length > 0) {
      // Check if data has actually changed
      const dataChanged = 
        submissions.length !== lastSubmissionsLength.current ||
        activityTasks.length !== lastActivityTasksLength.current ||
        !questionEvaluationsInitialized.current;
      
      if (dataChanged) {
        const evaluations: QuestionEvaluation[] = [];
        
        // Process all submissions for this student and activity
        submissions.forEach((submission) => {
          if (!submission.answers || !Array.isArray(submission.answers) || submission.answers.length === 0) {
            return; // Skip submissions without answers
          }
          
          // Process each answer in the submission
          submission.answers.forEach((answerItem, answerIndex) => {
            // Use questionId from submission answers as the question text
            const question = answerItem.questionId || `Question ${answerIndex + 1}`;
            
            // Get answer from submission
            const answer = answerItem.answer || 'Submitted';
            
            // Try to find matching activity_task to get the day
            let matchingActivityTask: ActivityTask | undefined;
            let day = answerIndex + 1; // Default day
            
            // Method 1: Match by questionId matching activity_task id
            if (answerItem.questionId) {
              matchingActivityTask = activityTasks.find(
                (at) => at.id.toString() === answerItem.questionId
              );
            }
            
            // Method 2: Match by questionId containing day info
            if (!matchingActivityTask && answerItem.questionId) {
              const dayMatch = answerItem.questionId.match(/day[_\s]*(\d+)/i);
              if (dayMatch) {
                const dayNum = parseInt(dayMatch[1]);
                matchingActivityTask = activityTasks.find((at) => at.day === dayNum);
                if (matchingActivityTask && matchingActivityTask.day !== undefined) {
                  day = matchingActivityTask.day;
                } else {
                  day = dayNum;
                }
              }
            }
            
            // Method 3: Match by questionId matching question text
            if (!matchingActivityTask && answerItem.questionId) {
              matchingActivityTask = activityTasks.find(
                (at) => 
                  at.text_question_1 === answerItem.questionId ||
                  at.text_question_2 === answerItem.questionId ||
                  at.title === answerItem.questionId
              );
              if (matchingActivityTask?.day !== undefined) {
                day = matchingActivityTask.day;
              }
            }
            
            // Method 4: Match by index if questionId is like "text_1", "text_2", etc.
            if (!matchingActivityTask && answerItem.questionId) {
              const textMatch = answerItem.questionId.match(/text[_\s]*(\d+)/i);
              if (textMatch) {
                const textNum = parseInt(textMatch[1]);
                matchingActivityTask = activityTasks.find((at) => {
                  if (textNum === 1 && at.text_question_1) return true;
                  if (textNum === 2 && at.text_question_2) return true;
                  return false;
                });
                if (matchingActivityTask?.day !== undefined) {
                  day = matchingActivityTask.day;
                }
              }
            }
            
            // Method 5: Use activity_task by answer index as fallback
            if (!matchingActivityTask && activityTasks.length > answerIndex) {
              matchingActivityTask = activityTasks[answerIndex];
              if (matchingActivityTask?.day !== undefined) {
                day = matchingActivityTask.day;
              }
            }
            
            // Check if we already have this exact question in the evaluations array (avoid duplicates)
            const alreadyExists = evaluations.some(
              (e) => e.submissionId === submission.id && e.question === question
            );
            
            if (!alreadyExists) {
              // Parse submission_data to get stored evaluation state
              // Store evaluations by questionId (not taskId) since each task has 2 questions
              let storedEval: any = null;
              if (submission.submission_data) {
                try {
                  const submissionData = JSON.parse(submission.submission_data);
                  // Find evaluation by questionId (the question text itself)
                  const questionEval = submissionData.evaluations?.[question];
                  if (questionEval) {
                    storedEval = questionEval;
                  }
                } catch (e) {
                  // Invalid JSON, ignore
                }
              }
              
              evaluations.push({
                taskId: matchingActivityTask?.id ?? submission.task_id ?? 0,
                day: day,
                question: question, // Use questionId from submission answers
                answer: answer,
                accept: storedEval?.accept !== undefined && storedEval?.accept !== null
                  ? storedEval.accept
                  : (submission.evaluation_status === 'evaluated' ? true : 
                     submission.evaluation_status === 'rejected' ? false : null),
                reject: storedEval?.reject !== undefined && storedEval?.reject !== null
                  ? storedEval.reject
                  : (submission.evaluation_status === 'rejected' ? true : null),
                remarks: storedEval?.remarks || submission.remarks || '',
                submissionId: submission.id,
              });
            }
          });
        });
        
        // Sort by day, then by question
        evaluations.sort((a, b) => {
          if (a.day !== b.day) return a.day - b.day;
          return a.question.localeCompare(b.question);
        });
        
        setQuestionEvaluations(evaluations);
        questionEvaluationsInitialized.current = true;
        lastSubmissionsLength.current = submissions.length;
        lastActivityTasksLength.current = activityTasks.length;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions.length, submissionsLoading, activityTasks.length, tasksLoading]);

  // Initialize photo evaluations
  useEffect(() => {
    if (!submissionsLoading && submissions.length >= 0) {
      // Check if data has actually changed
      const dataChanged = 
        submissions.length !== lastSubmissionsLength.current ||
        !photoEvaluationsInitialized.current;
      
      if (dataChanged) {
        const evaluations: PhotoEvaluation[] = [];
        
        // Process all submissions to extract photos
        submissions.forEach((submission) => {
          if (!submission.photos || !Array.isArray(submission.photos) || submission.photos.length === 0) {
            return; // Skip submissions without photos
          }
          
          // Find matching activity task for this submission to get day info
          const matchingActivityTask = activityTasks.find((at) => at.id === submission.task_id);
          const day = matchingActivityTask?.day || (matchingActivityTask ? activityTasks.indexOf(matchingActivityTask) + 1 : 1);
          
          // Parse submission_data to get stored photo evaluations
          let storedPhotoEvaluations: Record<string, any> = {};
          if (submission.submission_data) {
            try {
              const submissionData = JSON.parse(submission.submission_data);
              storedPhotoEvaluations = submissionData.photoEvaluations || {};
            } catch (e) {
              // Invalid JSON, ignore
            }
          }
          
          // Process each photo in the submission
          submission.photos.forEach((photoUrl: string, photoIndex: number) => {
            // Use photo URL as key for stored evaluations
            const photoKey = `${submission.task_id}-${photoIndex}`;
            
            // Preserve existing state if we've already initialized
            const existingEval = photoEvaluationsInitialized.current
              ? photoEvaluations.find(e => e.photoUrl === photoUrl && e.submissionId === submission.id)
              : null;
            
            // Get stored photo evaluation for this photo
            const storedEval = storedPhotoEvaluations[photoKey] || storedPhotoEvaluations[photoUrl];
            
            evaluations.push({
              taskId: submission.task_id,
              day: day,
              photoUrl: photoUrl,
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
              submissionId: submission.id,
            });
          });
        });
        
        // Sort by day, then by taskId
        evaluations.sort((a, b) => {
          if (a.day !== b.day) return a.day - b.day;
          return a.taskId - b.taskId;
        });
        
        setPhotoEvaluations(evaluations);
        photoEvaluationsInitialized.current = true;
        lastSubmissionsLength.current = submissions.length;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions.length, submissionsLoading, activityTasks.length]);

  // Function to check if all questions and photos are evaluated for this student-activity combination
  const checkAllEvaluationsComplete = async (): Promise<{ complete: boolean; message: string; submissionId?: number }> => {
    try {
      if (!studentId || !activityId) {
        return { complete: false, message: 'Student ID or Activity ID is missing.' };
      }

      // Get all submissions for this student and activity
      const allSubmissions = await submissionService.getAll();
      const studentActivitySubmissions = allSubmissions.filter(
        (s) => s.student_id === parseInt(studentId) && s.activity_id === parseInt(activityId)
      );

      if (studentActivitySubmissions.length === 0) {
        return { complete: false, message: 'No submissions found for this student and activity.' };
      }

      // Get all activity tasks to know what questions and photos should exist
      const activityTasks = await activityService.getTasks(parseInt(activityId));
      
      // Check if all questions and photos are evaluated across all submissions
      for (const submission of studentActivitySubmissions) {
        if (!submission.submission_data) {
          return { complete: false, message: 'Some submissions have not been evaluated yet.', submissionId: submission.id };
        }

        try {
          const submissionData = JSON.parse(submission.submission_data);
          const evaluations = submissionData.evaluations || {};
          const photoEvaluations = submissionData.photoEvaluations || {};

          // Check each question in the submission's answers array
          if (submission.answers && Array.isArray(submission.answers)) {
            for (const answer of submission.answers) {
              if (answer.questionId) {
                const questionEval = evaluations[answer.questionId];
                // Check if question has been evaluated: either accept === true OR reject === true
                // If evaluation doesn't exist, it's not evaluated
                if (!questionEval) {
                  return { 
                    complete: false, 
                    message: `Question "${answer.questionId}" has not been evaluated yet. Please accept or reject it.`, 
                    submissionId: submission.id 
                  };
                }
                // Check if accept or reject is explicitly true (not null, undefined, or false)
                // Must have exactly one of them as true
                const isAccepted = questionEval.accept === true;
                const isRejected = questionEval.reject === true;
                // If both are not true (could be null, undefined, false), it's not evaluated
                if (!isAccepted && !isRejected) {
                  console.log(`Question "${answer.questionId}" not evaluated: accept=${questionEval.accept}, reject=${questionEval.reject}`);
                  return { 
                    complete: false, 
                    message: `Question "${answer.questionId}" has not been evaluated yet.`, 
                    submissionId: submission.id 
                  };
                }
              }
            }
          }

          // Check if all photos from activity tasks are evaluated
          for (const task of activityTasks) {
            if (task.photo_url) {
              const photoEval = photoEvaluations[task.id];
              // Check if photo has been evaluated: either accept === true OR reject === true
              // If evaluation doesn't exist, it's not evaluated
              if (!photoEval) {
                return { 
                  complete: false, 
                  message: `Photo for Day ${task.day || 'N/A'} has not been evaluated yet. Please accept or reject it.`, 
                  submissionId: submission.id 
                };
              }
              // Check if accept or reject is explicitly true (not null, undefined, or false)
              // If both are not true (could be null, undefined, false), it's not evaluated
              // Explicitly check for null, false, or undefined
              if (photoEval.accept !== true && photoEval.reject !== true) {
                console.log(`Photo Day ${task.day || 'N/A'} not evaluated: accept=${photoEval.accept} (type: ${typeof photoEval.accept}), reject=${photoEval.reject} (type: ${typeof photoEval.reject})`);
                return { 
                  complete: false, 
                  message: `Photo for Day ${task.day || 'N/A'} has not been evaluated yet.`, 
                  submissionId: submission.id 
                };
              }
            }
          }
        } catch (e) {
          console.error('Error parsing submission data:', e);
          return { complete: false, message: 'Error parsing submission data.', submissionId: submission.id };
        }
      }

      // Return the first submission ID for archiving (they should all be for the same student-activity)
      return { complete: true, message: 'All evaluations are complete.', submissionId: studentActivitySubmissions[0].id };
    } catch (error: any) {
      console.error('Error checking evaluations:', error);
      return { complete: false, message: `Error checking evaluations: ${error?.message || 'Unknown error'}` };
    }
  };

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
      // Use questionId (question text) as key since each task has 2 questions
      for (const evalData of data.questionEvaluations) {
        console.log(`Processing evaluation for question ${evalData.question}, day ${evalData.day}`);
        
        // Store evaluation data by questionId (question text) to handle multiple questions per task
        submissionData.evaluations[evalData.question] = {
          day: evalData.day,
          question: evalData.question,
          answer: evalData.answer,
          accept: evalData.accept,
          reject: evalData.reject,
          remarks: evalData.remarks,
          taskId: evalData.taskId,
        };
      }
      
      // Determine overall status and remarks
      // Only mark as evaluated/rejected if ALL questions have been explicitly evaluated (accept === true OR reject === true)
      const allEvaluated = data.questionEvaluations.every(e => e.accept === true || e.reject === true);
      const hasAccepted = data.questionEvaluations.some(e => e.accept === true);
      const hasRejected = data.questionEvaluations.some(e => e.reject === true);
      // Only change status if all questions are evaluated, otherwise keep as submitted_for_evaluation
      const overallStatus = allEvaluated 
        ? (hasAccepted ? 'evaluated' : hasRejected ? 'rejected' : 'submitted_for_evaluation')
        : 'submitted_for_evaluation';
      
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
      
      // Check if all evaluations are complete and auto-move to archive
      const checkResult = await checkAllEvaluationsComplete();
      if (checkResult.complete && checkResult.submissionId) {
        try {
          await submissionService.evaluate(checkResult.submissionId, {
            evaluation_status: 'evaluated',
          });
          // Invalidate queries to refresh the evaluation list
          await queryClient.invalidateQueries({ queryKey: ['submissions-active'] });
          await queryClient.invalidateQueries({ queryKey: ['submissions-archived'] });
          alert('All evaluations are complete! Student has been automatically moved to archive.');
        } catch (error: any) {
          console.error('Error auto-archiving:', error);
          alert('Evaluation updated successfully, but failed to auto-archive. Please move manually.');
        }
      } else {
        alert('Evaluation updated successfully!');
      }
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
      const results = [];
      
      // Group photo evaluations by submissionId
      const evaluationsBySubmission = new Map<number, PhotoEvaluation[]>();
      
      for (const photoEval of data.photoEvaluations) {
        if (!photoEval.submissionId) {
          console.warn(`Photo evaluation missing submissionId:`, photoEval);
          continue;
        }
        
        if (!evaluationsBySubmission.has(photoEval.submissionId)) {
          evaluationsBySubmission.set(photoEval.submissionId, []);
        }
        evaluationsBySubmission.get(photoEval.submissionId)!.push(photoEval);
      }
      
      // Process each submission's photo evaluations
      for (const [submissionId, photoEvals] of evaluationsBySubmission.entries()) {
        // Get the submission
        let submission = submissions.find((s) => s.id === submissionId);
        
        if (!submission) {
          // Try to fetch it
          try {
            submission = await submissionService.getById(submissionId);
          } catch (error: any) {
            console.error(`Error fetching submission ${submissionId}:`, error);
            throw new Error(`Submission ${submissionId} not found`);
          }
        }
        
        // Store all photo evaluations in submission_data
        const submissionData = submission.submission_data ? JSON.parse(submission.submission_data) : { photoEvaluations: {} };
        if (!submissionData.photoEvaluations) {
          submissionData.photoEvaluations = {};
        }
        
        // Store photo evaluations by photo URL (since photos come from submission.photos array)
        for (const photoEval of photoEvals) {
          console.log(`Processing photo evaluation for submission ${submissionId}, photo ${photoEval.photoUrl}`);
          
          // Use photo URL as key for stored evaluations
          const photoKey = photoEval.photoUrl;
          
          submissionData.photoEvaluations[photoKey] = {
            day: photoEval.day,
            photoUrl: photoEval.photoUrl,
            taskId: photoEval.taskId,
            accept: photoEval.accept,
            reject: photoEval.reject,
            reason: photoEval.reason,
          };
        }
        
        // Determine overall status and remarks for this submission
        // Only mark as evaluated/rejected if ALL photos have been explicitly evaluated
        const allEvaluated = photoEvals.every(e => e.accept === true || e.reject === true);
        const hasAccepted = photoEvals.some(e => e.accept === true);
        const hasRejected = photoEvals.some(e => e.reject === true);
        const overallStatus = allEvaluated 
          ? (hasAccepted ? 'evaluated' : hasRejected ? 'rejected' : 'submitted_for_evaluation')
          : 'submitted_for_evaluation';
        
        const allReasons = photoEvals
          .filter(e => e.reject && e.reason)
          .map(e => `Day ${e.day}: ${e.reason}`)
          .join('; ');
        
        // Update the submission with photo evaluations
        try {
          console.log(`Calling API: PATCH /submissions/${submission.id}/evaluate with status: ${overallStatus}`);
          
          // First update evaluation status
          const result = await submissionService.evaluate(submission.id, {
            evaluation_status: overallStatus as any,
            remarks: allReasons || undefined,
          });
          
          // Then update submission_data with photo evaluations
          await submissionService.update(submission.id, {
            submission_data: JSON.stringify(submissionData),
          });
          
          console.log(`Successfully evaluated submission ${submission.id}:`, result);
          
          // Update photo evaluations with the submissionId
          const updatedEvals = photoEvals.map(e => ({ ...e, submissionId: submission.id }));
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
      
      // Check if all evaluations are complete and auto-move to archive
      const checkResult = await checkAllEvaluationsComplete();
      console.log('Check result after photo update:', checkResult);
      if (checkResult.complete && checkResult.submissionId) {
        try {
          await submissionService.evaluate(checkResult.submissionId, {
            evaluation_status: 'evaluated',
          });
          // Invalidate queries to refresh the evaluation list
          await queryClient.invalidateQueries({ queryKey: ['submissions-active'] });
          await queryClient.invalidateQueries({ queryKey: ['submissions-archived'] });
          alert('All evaluations are complete! Student has been automatically moved to archive.');
        } catch (error: any) {
          console.error('Error auto-archiving:', error);
          alert('Photo evaluation updated successfully, but failed to auto-archive. Please move manually.');
        }
      } else {
        console.log('Not all evaluations complete:', checkResult.message);
        alert(`Photo evaluation updated successfully! ${checkResult.message || ''}`);
      }
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

  // Handle individual question accept - update submission immediately
  const handleQuestionAccept = async (index: number, event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      event.stopPropagation();
    }
    const updated = [...questionEvaluations];
    const currentAccept = updated[index]?.accept;
    const newAcceptValue = !currentAccept;
    const evaluation = updated[index];
    
    updated[index] = {
      ...evaluation,
      accept: newAcceptValue,
      reject: false,
      remarks: newAcceptValue ? '' : evaluation.remarks, // Clear remarks if accepting
    };
    setQuestionEvaluations(updated);

    // If accepting and we have a submissionId, immediately update the submission
    if (newAcceptValue && evaluation.submissionId) {
      try {
        // Get the current submission to update submission_data
        const submission = await submissionService.getById(evaluation.submissionId);
        const submissionData = submission.submission_data ? JSON.parse(submission.submission_data) : { evaluations: {} };
        
        // Update this question's evaluation in submission_data
        // Use questionId (question text) as key since each task has 2 questions
        if (!submissionData.evaluations) {
          submissionData.evaluations = {};
        }
        submissionData.evaluations[evaluation.question] = {
          day: evaluation.day,
          question: evaluation.question,
          answer: evaluation.answer,
          accept: true,
          reject: false,
          remarks: '',
          taskId: evaluation.taskId,
        };
        
        // Determine overall status based on all questions
        // Only mark as evaluated/rejected if ALL questions have been explicitly evaluated
        const allEvaluations = [...updated];
        const allEvaluated = allEvaluations.every(e => e.accept === true || e.reject === true);
        const hasAccepted = allEvaluations.some(e => e.accept === true);
        const hasRejected = allEvaluations.some(e => e.reject === true);
        // Only change status if all questions are evaluated, otherwise keep as submitted_for_evaluation
        const overallStatus = allEvaluated 
          ? (hasAccepted ? 'evaluated' : hasRejected ? 'rejected' : 'submitted_for_evaluation')
          : 'submitted_for_evaluation';
        
        // Update evaluation status (sets evaluated_at and evaluator_id)
        await submissionService.evaluate(evaluation.submissionId, {
          evaluation_status: overallStatus as any,
          remarks: undefined,
        });
        
        // Update submission_data with all evaluations
        await submissionService.update(evaluation.submissionId, {
          submission_data: JSON.stringify(submissionData),
        });
        
        // Refetch submissions to get updated data
        await queryClient.invalidateQueries({ queryKey: ['submissions', studentId, activityId] });
      } catch (error: any) {
        console.error('Error evaluating submission:', error);
        // Revert the change on error
        updated[index] = {
          ...evaluation,
          accept: currentAccept,
        };
        setQuestionEvaluations(updated);
        alert(`Failed to update evaluation: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
      }
    }
  };

  // Handle individual question reject - update submission immediately
  const handleQuestionReject = async (index: number, event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      event.stopPropagation();
    }
    const updated = [...questionEvaluations];
    const currentReject = updated[index]?.reject;
    const newRejectValue = !currentReject;
    const evaluation = updated[index];
    
    updated[index] = {
      ...evaluation,
      reject: newRejectValue,
      accept: false,
      remarks: newRejectValue ? evaluation.remarks : '', // Keep remarks if rejecting
    };
    setQuestionEvaluations(updated);

    // If rejecting and we have a submissionId, immediately update the submission
    if (newRejectValue && evaluation.submissionId) {
      try {
        // Get the current submission to update submission_data
        const submission = await submissionService.getById(evaluation.submissionId);
        const submissionData = submission.submission_data ? JSON.parse(submission.submission_data) : { evaluations: {} };
        
        // Update this question's evaluation in submission_data
        // Use questionId (question text) as key since each task has 2 questions
        if (!submissionData.evaluations) {
          submissionData.evaluations = {};
        }
        submissionData.evaluations[evaluation.question] = {
          day: evaluation.day,
          question: evaluation.question,
          answer: evaluation.answer,
          accept: false,
          reject: true,
          remarks: evaluation.remarks || 'Rejected',
          taskId: evaluation.taskId,
        };
        
        // Determine overall status based on all questions
        // Only mark as evaluated/rejected if ALL questions have been explicitly evaluated
        const allEvaluations = [...updated];
        const allEvaluated = allEvaluations.every(e => e.accept === true || e.reject === true);
        const hasAccepted = allEvaluations.some(e => e.accept === true);
        const hasRejected = allEvaluations.some(e => e.reject === true);
        // Only change status if all questions are evaluated, otherwise keep as submitted_for_evaluation
        const overallStatus = allEvaluated 
          ? (hasAccepted ? 'evaluated' : hasRejected ? 'rejected' : 'submitted_for_evaluation')
          : 'submitted_for_evaluation';
        
        // Collect all rejection remarks
        const allRemarks = allEvaluations
          .filter(e => e.reject && e.remarks)
          .map(e => `Day ${e.day}: ${e.remarks}`)
          .join('; ');
        
        // Update evaluation status (sets evaluated_at and evaluator_id) with remarks
        await submissionService.evaluate(evaluation.submissionId, {
          evaluation_status: overallStatus as any,
          remarks: allRemarks || evaluation.remarks || 'Rejected',
        });
        
        // Update submission_data with all evaluations
        await submissionService.update(evaluation.submissionId, {
          submission_data: JSON.stringify(submissionData),
        });
        
        // Refetch submissions to get updated data
        await queryClient.invalidateQueries({ queryKey: ['submissions', studentId, activityId] });
      } catch (error: any) {
        console.error('Error evaluating submission:', error);
        // Revert the change on error
        updated[index] = {
          ...evaluation,
          reject: currentReject,
        };
        setQuestionEvaluations(updated);
        alert(`Failed to update evaluation: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
      }
    }
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

  // Get student info from submissions or direct fetch
  const studentInfo = submissions.length > 0 && submissions[0].student 
    ? submissions[0].student 
    : studentInfoDirect || null;
  const studentName = studentInfo?.name 
    ? studentInfo.name 
    : (studentInfo?.first_name && studentInfo?.last_name 
      ? `${studentInfo.first_name} ${studentInfo.last_name}` 
      : studentInfo?.first_name || 'Loading...');
  const appCode = studentInfo?.app_code || 'Loading...';

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
            <IconButton onClick={() => navigate('/evaluation')} sx={{ color: '#fff' }}>
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
              Answer Evaluation
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
                        questionEvaluations.map((evaluation, index) => {
                          // Create a truly unique key using submissionId, question, answer, and index
                          const questionKey = `${evaluation.submissionId || 'new'}-${evaluation.question}-${evaluation.answer}-${index}`;
                          const sanitizedKey = questionKey.replace(/[^a-zA-Z0-9-]/g, '-').substring(0, 100);
                          return (
                            <TableRow key={`q-${sanitizedKey}`} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
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
                                  onChange={async (e) => {
                                    const updated = [...questionEvaluations];
                                    updated[index].remarks = e.target.value;
                                    setQuestionEvaluations(updated);
                                    
                                    // If rejected and has submissionId, update remarks immediately
                                    if (evaluation.reject && evaluation.submissionId && e.target.value) {
                                      try {
                                        await submissionService.evaluate(evaluation.submissionId, {
                                          evaluation_status: 'rejected',
                                          remarks: e.target.value,
                                        });
                                        await queryClient.invalidateQueries({ queryKey: ['submissions', studentId, activityId] });
                                      } catch (error: any) {
                                        console.error('Error updating remarks:', error);
                                      }
                                    }
                                  }}
                                  disabled={!evaluation.reject}
                                  sx={{ width: 200 }}
                                  fullWidth
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })
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
                      <Grid item xs={12} md={4} key={`photo-${evaluation.taskId}-${evaluation.day}-${evaluation.submissionId || index}`}>
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

