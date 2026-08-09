import { supabase } from "./supabase";

export async function getGoals(userId: string) {
  return await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function createGoal(userId: string, title: string, description?: string, targetDate?: string) {
  return await supabase.from("goals").insert({
    user_id: userId,
    title,
    description,
    target_date: targetDate || null,
  });
}

export async function updateGoal(id: number, updates: { title?: string; description?: string; target_date?: string | null; completed?: boolean }) {
  return await supabase
    .from("goals")
    .update(updates)
    .eq("id", id);
}

export async function deleteGoal(id: number) {
  return await supabase
    .from("goals")
    .delete()
    .eq("id", id);
}

export async function getTaskGoals(taskId: number) {
  return await supabase
    .from("task_goals")
    .select("*, goals(*)")
    .eq("task_id", taskId);
}

export async function addTaskGoal(taskId: number, goalId: number) {
  return await supabase.from("task_goals").insert({
    task_id: taskId,
    goal_id: goalId,
  });
}

export async function removeTaskGoal(taskId: number, goalId: number) {
  return await supabase
    .from("task_goals")
    .delete()
    .eq("task_id", taskId)
    .eq("goal_id", goalId);
}
