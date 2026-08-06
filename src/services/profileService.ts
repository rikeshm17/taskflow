import { supabase } from "./supabase";

export async function getCurrentUserRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Logged in user:", user);

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("Profile data:", data);
  console.log("Profile error:", error);

  if (error) {
    return null;
  }

  return data.role;
}