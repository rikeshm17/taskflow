import { supabase } from "./supabase";

export async function getPomodoroSessions(userId: string, taskId?: number) {
  let query = supabase
    .from("pomodoro_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (taskId) {
    query = query.eq("task_id", taskId);
  }

  const { data, error } = await query;
  return { data: data ?? null, error: error ?? null };
}

export async function createPomodoroSession(userId: string, taskId: number | null, durationMinutes: number) {
  const { data, error } = await supabase.from("pomodoro_sessions").insert({
    user_id: userId,
    task_id: taskId,
    duration_minutes: durationMinutes,
    completed: false,
    started_at: new Date().toISOString(),
  });
  return { data: (data ?? null) as { id: number }[] | null, error: error ?? null };
}

export async function completePomodoroSession(id: number) {
  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .update({
      completed: true,
      ended_at: new Date().toISOString(),
    })
    .eq("id", id);
  return { data: (data ?? null) as { id: number }[] | null, error: error ?? null };
}

export async function getTotalFocusTime(userId: string) {
  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("duration_minutes")
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) return 0;

  return data?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0;
}
