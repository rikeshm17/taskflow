import { supabase } from "./supabase";

export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function addTask(task: {
  title: string;
  description: string;
  priority: string;
  category: string;
  due_date: string | null;
  repeat_type: string;
  user_id: string;
}) {
  return await supabase.from("tasks").insert(task);
}

export async function deleteTask(id: number) {
  return await supabase.from("tasks").delete().eq("id", id);
}

export async function completeTask(id: number, completed: boolean) {
  return await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);
    
}
export async function updateTask(
  id: number,
  task: {
    title: string;
    description: string;
    priority: string;
    category: string;
    due_date: string | null;
    repeat_type: string;
  }
) {
  return await supabase
    .from("tasks")
    .update(task)
    .eq("id", id);
}