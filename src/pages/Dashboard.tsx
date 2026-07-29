import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  addTask,
  getTasks,
  deleteTask,
  completeTask,
  updateTask,
} from "../services/taskService";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsCard from "../components/StatsCard";
import ProgressBar from "../components/ProgressBar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskChart from "../components/TaskChart";
import type { Task } from "../types/task";
import "../styles/dashboard.css";
import ProductivityStats from "../components/ProductivityStats";

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [repeatType, setRepeatType] = useState("None");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserEmail(user.email ?? "");

    const { data } = await getTasks(user.id);

    if (data) {
      setTasks(data as Task[]);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await addTask({
      title,
      description,
      priority,
      due_date: dueDate || null,
      repeat_type: repeatType,
      user_id: user.id,
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setRepeatType("None");

    loadTasks();
  }

  async function handleDeleteTask(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    await deleteTask(id);
    loadTasks();
  }

  async function handleCompleteTask(task: Task) {
    await completeTask(task.id, !task.completed);
    loadTasks();
  }

  async function handleUpdateTask(e: React.FormEvent) {
    e.preventDefault();

    if (!editingTask) return;

    await updateTask(editingTask.id, {
      title,
      description,
      priority,
      due_date: dueDate || null,
      repeat_type: repeatType,
    });

    setEditingTask(null);

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setRepeatType("None");

    loadTasks();
  }

  function handleCancelEdit() {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setRepeatType("None");
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const highPriority = tasks.filter(
    (task) => task.priority === "High"
  ).length;
  const overdue = tasks.filter(
    (task) =>
      task.due_date &&
      !task.completed &&
      new Date(task.due_date) < new Date()
  ).length;
  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100);
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      task.priority === filter ||
      (filter === "Completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard">
      <Navbar
  onLogout={logout}
  userEmail={userEmail}
/>

      <Hero userEmail={userEmail} />

      <StatsCard
        total={tasks.length}
        completed={completed}
        pending={pending}
      />

      <ProgressBar completed={completed} total={tasks.length} />

      <ProductivityStats
        highPriority={highPriority}
        overdue={overdue}
        completionRate={completionRate}
      />

      <TaskChart
        completed={completed}
        pending={pending}
      />

      <TaskForm
        title={title}
        description={description}
        priority={priority}
        dueDate={dueDate}
        repeatType={repeatType}
        editingTask={editingTask}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onPriorityChange={setPriority}
        onDueDateChange={setDueDate}
        onRepeatTypeChange={setRepeatType}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        onCancel={handleCancelEdit}
      />

      <TaskList
        filteredTasks={filteredTasks}
        onComplete={handleCompleteTask}
        onEdit={(task) => {
          setEditingTask(task);
          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
          setDueDate(task.due_date ?? "");
          setRepeatType(task.repeat_type ?? "None");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        onDelete={handleDeleteTask}
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />
    </div>
  );
}

export default Dashboard;
