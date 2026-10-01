export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department_id: string | null;
  manager_id: string | null;
  designation: string | null;
  hire_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department: Department | null;
  manager: Employee | null;
  full_name: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  size: number;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  department_id: string | null;
  trainer_id: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_weeks: number | null;
  mode: string | null;
  location: string | null;
  max_participants: number | null;
  prerequisites: string | null;
  learning_objectives: string | null;
  status: string;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  estimated_hours: number | null;
  status: string;
  is_mandatory: boolean;
  training_program_id: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  estimated_hours: number | null;
  status: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  training_program_id: string;
  module_id: string | null;
  trainer_id: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  meeting_url: string | null;
  capacity: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  session_id: string;
  employee_id: string;
  status: string;
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any[];
  correct_answer: string;
  explanation: string | null;
  points: number;
  order_index: number;
  assessment_id: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  assessment_type: string;
  training_program_id: string | null;
  module_id: string | null;
  duration_minutes: number | null;
  passing_score: number;
  attempt_limit: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  employee_id: string;
  attempt_number: number;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  start_time: string;
  submit_time: string | null;
  status: string;
  answers: AssessmentAnswer[];
}

export interface AssessmentAnswer {
  id: string;
  question_id: string;
  selected_answer: string | null;
  is_correct: boolean;
  points_awarded: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export interface Certificate {
  id: string;
  certificate_number: string;
  employee_id: string;
  training_program_id: string;
  issue_date: string;
  expiry_date: string | null;
  issuer_name: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string
  title: string
  description: string | null
  training_program_id: string
  course_id: string | null
  due_date: string | null
  max_score: number
  created_at: string
  updated_at: string
}

export interface AssignmentSubmission {
  id: string
  assignment_id: string
  employee_id: string
  file_path: string | null
  comments: string | null
  status: string
  score: number | null
  trainer_feedback: string | null
  graded_by_id: string | null
  graded_at: string | null
  created_at: string
  updated_at: string
}

export interface ApiError {
  detail: string;
}