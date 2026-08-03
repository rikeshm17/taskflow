import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  addTask,
  getTasks,
  deleteTask,
  completeTask,
  updateTask,
} from "../services/taskService";
import { createNotification } from "../services/notificationService";
import { requestNotificationPermission, showBrowserNotification } from "../utils/browserNotification";
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
import TodoTable from "../components/TodoTable";
import "../styles/todotable.css";

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [repeatType, setRepeatType] = useState("None");
  const [category, setCategory] = useState("Personal");

  const scrollRef = { current: 0 };

  useEffect(() => {
    loadTasks();
    requestNotificationPermission();

    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        async () => {
          try {
            await loadTasks();
          } catch (err) {
            console.error("Realtime load failed:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadTasks() {
    scrollRef.current = window.scrollY;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("Current User:", user);

    if (!user) {
      setLoading(false);
      return;
    }

    setUserEmail(user.email ?? "");

    const { data, error } = await getTasks(user.id);

    if (error) {
      console.error("Failed to load tasks:", error);
      setLoading(false);
      return;
    }

    if (data) {
      setTasks(data as Task[]);
    }

    setLoading(false);

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollRef.current);
    });
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("Current User:", user);

    if (!user) return;

    const { data, error } = await addTask({
      title,
      description,
      priority,
      category,
      status: "todo",
      due_date: dueDate || null,
      repeat_type: repeatType,
      user_id: user.id,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    if (Array.isArray(data) && data.length > 0) {
      setTasks(prev => [data[0], ...prev]);
    } else {
      await loadTasks();
    }

    await createNotification({
      userId: user.id,
      title: "Task Created",
      message: `"${title}" has been added successfully.`,
      type: "success",
    });

    showBrowserNotification(
      "Task Created",
      `"${title}" has been added successfully.`
    );

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Personal");
    setDueDate("");
    setRepeatType("None");
  }

  async function handleDeleteTask(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    const { error } = await deleteTask(id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    showBrowserNotification(
      "Task Deleted",
      "A task has been deleted."
    );

    setTasks(prev => prev.filter(task => task.id !== id));
  }

  async function handleCompleteTask(task: Task) {
    const { error } = await completeTask(task.id, !task.completed);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    showBrowserNotification(
      "Task Completed",
      `"${task.title}" marked as completed.`
    );

    setTasks(prev =>
      prev.map(t =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  async function handleUpdateTask(e: React.FormEvent) {
    e.preventDefault();

    if (!editingTask) return;

    const { data, error } = await updateTask(editingTask.id, {
      title,
      description,
      priority,
      category,
      due_date: dueDate || null,
      repeat_type: repeatType,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    if (data && data[0]) {
      setTasks(prev =>
        prev.map(t =>
          t.id === editingTask.id ? { ...t, ...data[0] as Task } : t
        )
      );
    }

    showBrowserNotification(
      "Task Updated",
      `"${title}" updated successfully.`
    );

    setEditingTask(null);

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Personal");
    setDueDate("");
    setRepeatType("None");

    await loadTasks();
  }

  async function handleCancelEdit() {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Personal");
    setDueDate("");
    setRepeatType("None");

    await loadTasks();
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function handleAddTaskFromTable(task: {
    title: string;
    description: string;
    priority: string;
    category: string;
    due_date: string | null;
    repeat_type: string;
  }) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await addTask({
      ...task,
      status: "todo",
      user_id: user.id,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    if (Array.isArray(data) && data.length > 0) {
      setTasks(prev => [data[0], ...prev]);
    } else {
      await loadTasks();
    }

    await createNotification({
      userId: user.id,
      title: "Task Created",
      message: `"${task.title}" has been added successfully.`,
      type: "success",
    });

    showBrowserNotification(
      "Task Created",
      `"${task.title}" has been added successfully.`
    );
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

    const matchesCategory =
      categoryFilter === "All Categories" ||
      task.category === categoryFilter;

    return matchesSearch && matchesFilter && matchesCategory;
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
        loading={loading}
      />

      <ProgressBar completed={completed} total={tasks.length} />

      <ProductivityStats
        highPriority={highPriority}
        overdue={overdue}
        completionRate={completionRate}
        loading={loading}
      />

      <TaskChart
        completed={completed}
        pending={pending}
        loading={loading}
      />

      <TaskForm
        title={title}
        description={description}
        priority={priority}
        dueDate={dueDate}
        repeatType={repeatType}
        category={category}
        editingTask={editingTask}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onPriorityChange={setPriority}
        onDueDateChange={setDueDate}
        onRepeatTypeChange={setRepeatType}
        onCategoryChange={setCategory}
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
          setCategory(task.category ?? "Personal");
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
        categoryFilter={categoryFilter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onCategoryFilterChange={setCategoryFilter}
        loading={loading}
      />

      <TodoTable
        tasks={filteredTasks}
        onComplete={handleCompleteTask}
        onEdit={(task) => {
          setEditingTask(task);
          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
          setCategory(task.category ?? "Personal");
          setDueDate(task.due_date ?? "");
          setRepeatType(task.repeat_type ?? "None");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        onDelete={handleDeleteTask}
        onAdd={handleAddTaskFromTable}
        loading={loading}
      />
    </div>
  );
}

export default Dashboard;
