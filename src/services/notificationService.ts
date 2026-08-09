import { supabase } from "./supabase";
import type { Notification } from "../types/notification";
import type { PostgrestError } from "@supabase/supabase-js";

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
}: {
  userId: string;
  title: string;
  message: string;
  type?: string;
}): Promise<{ data: Notification[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
  });
  return { data: (data as Notification[] | null) ?? null, error: error as PostgrestError | null };
}

export async function getNotifications(userId: string): Promise<{ data: Notification[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: (data as Notification[] | null) ?? null, error: error as PostgrestError | null };
}

export async function markNotificationRead(id: number): Promise<{ data: Notification[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("id", id);
  return { data: (data as Notification[] | null) ?? null, error: error as PostgrestError | null };
}

export async function deleteNotification(id: number): Promise<{ data: Notification[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id);
  return { data: (data as Notification[] | null) ?? null, error: error as PostgrestError | null };
}
