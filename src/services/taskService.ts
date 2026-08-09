import { supabase } from "./supabase";
import type { Task } from "../types/task";
import type { PostgrestError } from "@supabase/supabase-js";

export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data: (data as Task[] | null) ?? null, error: error as PostgrestError | null };
}

export async function addTask(task: {
  title: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  due_date: string | null;
  repeat_type: string;
  user_id: string;
}): Promise<{ data: Task[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase.from("tasks").insert(task);
  return { data: (data as Task[] | null) ?? null, error: error as PostgrestError | null };
}

export async function deleteTask(id: number): Promise<{ data: Task[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase.from("tasks").delete().eq("id", id);
  return { data: (data as Task[] | null) ?? null, error: error as PostgrestError | null };
}

export async function completeTask(id: number, completed: boolean): Promise<{ data: Task[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);
  return { data: (data as Task[] | null) ?? null, error: error as PostgrestError | null };
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
): Promise<{ data: Task[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", id);
  return { data: (data as Task[] | null) ?? null, error: error as PostgrestError | null };
}
