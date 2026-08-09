import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import type { Task } from "../types/task";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

const COLUMNS = ["todo", "in-progress", "done"] as const;

type Status = typeof COLUMNS[number];

function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserEmail(user.email ?? "");

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setTasks(data as Task[]);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function moveTask(task: Task, status: Status) {
    await supabase
      .from("tasks")
      .update({ status })
      .eq("id", task.id);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status } : t
      )
    );
  }

  const columns: Record<Status, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="dashboard">
      <Navbar
        onLogout={logout}
        userEmail={userEmail}
      />

      <section className="hero">
        <h1>📋 Kanban Board</h1>
        <p>Drag your tasks across columns to track progress.</p>
      </section>

      <section className="kanban-board">
        {loading
          ? COLUMNS.map((status) => (
              <div key={status} className="kanban-column">
                <div className="kanban-header">
                  <h3>
                    {status === "todo"
                      ? "📌 To Do"
                      : status === "in-progress"
                      ? "🚧 In Progress"
                      : "✅ Done"}
                  </h3>
                  <span>
                    <div className="skeleton" style={{ width: 24, height: 20, borderRadius: 999 }} />
                  </span>
                </div>

                <div className="kanban-cards">
                  {[1, 2].map((i) => (
                    <div key={i} className="kanban-card">
                      <div className="skeleton skeleton-text" style={{ width: "80%" }} />
                      <div className="skeleton skeleton-text short" />
                      <div className="skeleton skeleton-text" style={{ width: "40%" }} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          : COLUMNS.map((status) => (
              <div key={status} className="kanban-column">
                <div className="kanban-header">
                  <h3>
                    {status === "todo"
                      ? "📌 To Do"
                      : status === "in-progress"
                      ? "🚧 In Progress"
                      : "✅ Done"}
                  </h3>
                  <span>{columns[status].length}</span>
                </div>

                <div className="kanban-cards">
                  {columns[status].map((task) => (
                    <div key={task.id} className="kanban-card">
                      <h4>{task.title}</h4>

                      <p>{task.description}</p>

                      <div className="kanban-meta">
                        <span className={`priority ${task.priority.toLowerCase()}`}>
                          {task.priority === "Urgent"
                            ? "🚨 Urgent"
                            : task.priority === "High"
                            ? "🔴 High"
                            : task.priority === "Medium"
                            ? "🟡 Medium"
                            : "🟢 Low"}
                        </span>

                        <span className="category">
                          📂 {task.category}
                        </span>
                      </div>

                      <div className="kanban-actions">
                        {status !== "todo" && (
                          <button
                            onClick={() => moveTask(task, "todo")}
                          >
                            ← To Do
                          </button>
                        )}

                        {status !== "in-progress" && (
                          <button
                            onClick={() => moveTask(task, "in-progress")}
                          >
                            In Progress
                          </button>
                        )}

                        {status !== "done" && (
                          <button
                            onClick={() => moveTask(task, "done")}
                          >
                            Done →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {columns[status].length === 0 && (
                    <p className="kanban-empty">
                      No tasks here.
                    </p>
                  )}
                </div>
              </div>
            ))}
      </section>

      <Footer />
    </div>
  );
}

export default Kanban;
