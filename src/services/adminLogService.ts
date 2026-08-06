import { supabase } from "./supabase";

export async function createAdminLog(action: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  return await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action,
  });
}

export async function getAdminLogs() {
  return await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false });
}