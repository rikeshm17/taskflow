import { supabase } from "./supabase";

export async function getCurrentUserRole(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to fetch user role");
  }

  return data.role as string;
}
