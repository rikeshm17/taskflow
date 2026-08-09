import { supabase } from "./supabase";

export async function getTaskDependencies(taskId: number) {
  return await supabase
    .from("task_dependencies")
    .select("*, tasks!task_dependencies_depends_on_task_id_fkey(*)")
    .eq("task_id", taskId);
}

export async function addTaskDependency(taskId: number, dependsOnTaskId: number) {
  return await supabase.from("task_dependencies").insert({
    task_id: taskId,
    depends_on_task_id: dependsOnTaskId,
  });
}

export async function removeTaskDependency(taskId: number, dependsOnTaskId: number) {
  return await supabase
    .from("task_dependencies")
    .delete()
    .eq("task_id", taskId)
    .eq("depends_on_task_id", dependsOnTaskId);
}

export async function getDependentTasks(taskId: number) {
  return await supabase
    .from("task_dependencies")
    .select("*, tasks(*)")
    .eq("depends_on_task_id", taskId);
}
