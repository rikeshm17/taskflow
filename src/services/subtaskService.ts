import { supabase } from "./supabase";

export async function getSubtasks(taskId: number) {
  return await supabase
    .from("subtasks")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
}

export async function addSubtask(taskId: number, title: string) {
  return await supabase.from("subtasks").insert({
    task_id: taskId,
    title,
  });
}

export async function updateSubtask(id: number, completed: boolean) {
  return await supabase
    .from("subtasks")
    .update({ completed })
    .eq("id", id);
}

export async function deleteSubtask(id: number) {
  return await supabase
    .from("subtasks")
    .delete()
    .eq("id", id);
}
