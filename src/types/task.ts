export type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  due_date: string | null;
  repeat_type: string;
  category: string;
};