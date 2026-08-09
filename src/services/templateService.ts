import { supabase } from "./supabase";

export async function getTaskTemplates(userId: string) {
  return await supabase
    .from("task_templates")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function createTaskTemplate(userId: string, template: {
  name: string;
  title: string;
  description?: string;
  priority?: string;
  category?: string;
  repeat_type?: string;
}) {
  return await supabase.from("task_templates").insert({
    user_id: userId,
    ...template,
  });
}

export async function updateTaskTemplate(id: number, updates: {
  name?: string;
  title?: string;
  description?: string;
  priority?: string;
  category?: string;
  repeat_type?: string;
}) {
  return await supabase
    .from("task_templates")
    .update(updates)
    .eq("id", id);
}

export async function deleteTaskTemplate(id: number) {
  return await supabase
    .from("task_templates")
    .delete()
    .eq("id", id);
}

export async function getTemplateSubtasks(templateId: number) {
  return await supabase
    .from("template_subtasks")
    .select("*")
    .eq("template_id", templateId)
    .order("created_at", { ascending: true });
}

export async function addTemplateSubtask(templateId: number, title: string) {
  return await supabase.from("template_subtasks").insert({
    template_id: templateId,
    title,
  });
}

export async function deleteTemplateSubtask(id: number) {
  return await supabase
    .from("template_subtasks")
    .delete()
    .eq("id", id);
}
