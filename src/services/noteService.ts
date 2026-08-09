import { supabase } from "./supabase";

export async function getTaskNotes(taskId: number) {
  return await supabase
    .from("task_notes")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
}

export async function createTaskNote(taskId: number, userId: string, content: string) {
  return await supabase.from("task_notes").insert({
    task_id: taskId,
    user_id: userId,
    content,
  });
}

export async function updateTaskNote(id: number, content: string) {
  return await supabase
    .from("task_notes")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function deleteTaskNote(id: number) {
  return await supabase
    .from("task_notes")
    .delete()
    .eq("id", id);
}
