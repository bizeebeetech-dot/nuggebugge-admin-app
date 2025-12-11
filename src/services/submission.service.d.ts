export interface Student {
    id: number;
    app_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface Activity {
    id: number;
    name: string;
    activity_type: string;
    points: number;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface Task {
    id: number;
    activity_id: number;
    activity: Activity;
    task_number: string;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export type EvaluationStatus = 'submitted_for_evaluation' | 'under_review' | 'evaluated' | 'rejected';
export interface Submission {
    id: number;
    student_id: number;
    student: Student;
    task_id: number;
    task: Task;
    evaluation_status: EvaluationStatus;
    submitted_at: string;
    evaluated_at: string | null;
    evaluator_id: string | null;
    score: number | null;
    remarks: string | null;
    submission_data: string | null;
    created_at: string;
    updated_at: string;
}
export interface SubmissionStats {
    total: number;
    submitted_for_evaluation: number;
    under_review: number;
    evaluated: number;
    rejected: number;
}
export declare const activityService: {
    getAll(search?: string): Promise<Activity[]>;
    getById(id: number): Promise<Activity>;
    create(data: Partial<Activity>): Promise<Activity>;
    update(id: number, data: Partial<Activity>): Promise<Activity>;
    delete(id: number): Promise<void>;
};
export declare const taskService: {
    getAll(activityId?: number): Promise<Task[]>;
    getById(id: number): Promise<Task>;
    create(data: Partial<Task>): Promise<Task>;
    update(id: number, data: Partial<Task>): Promise<Task>;
    delete(id: number): Promise<void>;
};
export declare const studentService: {
    getAll(search?: string): Promise<Student[]>;
    getById(id: number): Promise<Student>;
    create(data: Partial<Student>): Promise<Student>;
    update(id: number, data: Partial<Student>): Promise<Student>;
    delete(id: number): Promise<void>;
};
export declare const submissionService: {
    getAll(taskId?: number, search?: string): Promise<Submission[]>;
    getByTask(taskId: number, search?: string): Promise<Submission[]>;
    getById(id: number): Promise<Submission>;
    create(data: {
        student_id: number;
        task_id: number;
        submission_data?: string;
    }): Promise<Submission>;
    evaluate(id: number, data: {
        evaluation_status: EvaluationStatus;
        score?: number;
        remarks?: string;
    }): Promise<Submission>;
    getStats(taskId: number): Promise<SubmissionStats>;
    delete(id: number): Promise<void>;
};
