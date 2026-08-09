import { supabase } from "./supabase";
import type { Profile } from "../types";
import type { Task } from "../types/task";
import type { PostgrestError } from "@supabase/supabase-js";

export async function getAllUsers(): Promise<{ data: Profile[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: (data as Profile[] | null) ?? null, error: error as PostgrestError | null };
}

export async function getAllTasks(): Promise<{ data: Task[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: (data as Task[] | null) ?? null, error: error as PostgrestError | null };
}

export async function updateUserRole(
  id: string,
  role: "admin" | "user"
): Promise<{ data: Profile[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);
  return { data: (data as Profile[] | null) ?? null, error: error as PostgrestError | null };
}

export async function deleteAnyTask(id: number): Promise<{ data: Task[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);
  return { data: (data as Task[] | null) ?? null, error: error as PostgrestError | null };
}
