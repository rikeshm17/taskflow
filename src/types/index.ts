export type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  due_date: string | null;
  repeat_type: string;
  category: string;
  status: string;
  user_id: string;
  created_at: string;
};

export type Subtask = {
  id: number;
  task_id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export type Tag = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type TaskTag = {
  id: number;
  task_id: number;
  tag_id: number;
  created_at: string;
};

export type PomodoroSession = {
  id: number;
  user_id: string;
  task_id: number | null;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  ended_at: string | null;
};

export type TaskDependency = {
  id: number;
  task_id: number;
  depends_on_task_id: number;
  created_at: string;
};

export type Goal = {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  completed: boolean;
  created_at: string;
};

export type TaskGoal = {
  id: number;
  task_id: number;
  goal_id: number;
  created_at: string;
};

export type TimeEntry = {
  id: number;
  user_id: string;
  task_id: number;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  notes: string | null;
};

export type TaskNote = {
  id: number;
  task_id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type TaskTemplate = {
  id: number;
  user_id: string;
  name: string;
  title: string;
  description: string | null;
  priority: string;
  category: string;
  repeat_type: string;
  created_at: string;
};

export type TemplateSubtask = {
  id: number;
  template_id: number;
  title: string;
  created_at: string;
};

export type Profile = {
  id: string;
  role: "admin" | "user";
  full_name: string | null;
  avatar_url: string | null;
  settings: Record<string, string> | null;
  created_at: string;
};
