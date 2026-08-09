import { supabase } from "./supabase";
import type { Tag } from "../types";

export async function getTags(userId: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });
  return { data: (data ?? null) as Tag[] | null, error: error ?? null };
}

export async function createTag(userId: string, name: string, color?: string) {
  const { data, error } = await supabase.from("tags").insert({
    user_id: userId,
    name,
    color: color || "#FC563C",
  });
  return { data: (data ?? null) as Tag[] | null, error: error ?? null };
}

export async function deleteTag(id: number) {
  const { data, error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id);
  return { data: (data ?? null) as Tag[] | null, error: error ?? null };
}

export async function getTaskTags(taskId: number) {
  const { data, error } = await supabase
    .from("task_tags")
    .select("*, tags(*)")
    .eq("task_id", taskId);
  return { data: (data ?? null) as { tags: Tag }[] | null, error: error ?? null };
}

export async function addTaskTag(taskId: number, tagId: number) {
  const { data, error } = await supabase.from("task_tags").insert({
    task_id: taskId,
    tag_id: tagId,
  });
  return { data: (data ?? null) as { id: number }[] | null, error: error ?? null };
}

export async function removeTaskTag(taskId: number, tagId: number) {
  const { data, error } = await supabase
    .from("task_tags")
    .delete()
    .eq("task_id", taskId)
    .eq("tag_id", tagId);
  return { data: (data ?? null) as { id: number }[] | null, error: error ?? null };
}
