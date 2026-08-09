import { supabase } from "./supabase";

export async function getTimeEntries(userId: string, taskId?: number) {
  let query = supabase
    .from("time_entries")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (taskId) {
    query = query.eq("task_id", taskId);
  }

  return await query;
}

export async function startTimeEntry(userId: string, taskId: number) {
  return await supabase.from("time_entries").insert({
    user_id: userId,
    task_id: taskId,
    started_at: new Date().toISOString(),
    duration_minutes: 0,
  });
}

export async function stopTimeEntry(id: number) {
  const startedAt = new Date();
  // We'll calculate duration on the client side
  return await supabase
    .from("time_entries")
    .update({
      ended_at: startedAt.toISOString(),
    })
    .eq("id", id);
}

export async function deleteTimeEntry(id: number) {
  return await supabase
    .from("time_entries")
    .delete()
    .eq("id", id);
}
