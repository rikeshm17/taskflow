import { supabase } from "./supabase";

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
}) {
  return await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
  });
}

export async function getNotifications(userId: string) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function markNotificationRead(id: number) {
  return await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("id", id);
}

export async function deleteNotification(id: number) {
  return await supabase
    .from("notifications")
    .delete()
    .eq("id", id);
}