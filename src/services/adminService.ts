import { supabase } from "./supabase";

export async function getAllUsers() {
  return await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function getAllTasks() {
  return await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function updateUserRole(
  id: string,
  role: "admin" | "user"
) {
  return await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);
}

export async function deleteAnyTask(id: number) {
  return await supabase
    .from("tasks")
    .delete()
    .eq("id", id);
}