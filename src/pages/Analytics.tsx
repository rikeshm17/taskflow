import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import type { Task } from "../types/task";
import Navbar from "../components/Navbar";
import CategoryChart from "../components/charts/CategoryChart";
import "../styles/dashboard.css";

function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState("");

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
      .eq("user_id", user.id);

    if (data) {
      setTasks(data as Task[]);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  const completionRate =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="dashboard">
      <Navbar
        onLogout={logout}
        userEmail={userEmail}
      />

      <section className="hero">
        <h1>📊 Analytics</h1>

        <p>Your productivity overview.</p>
      </section>

      <section className="cards">

        <div className="card">
          <h2>Total Tasks</h2>
          <div className="number">{total}</div>
        </div>

        <div className="card">
          <h2>Completed</h2>
          <div className="number">{completed}</div>
        </div>

        <div className="card">
          <h2>Pending</h2>
          <div className="number">{pending}</div>
        </div>

        <div className="card">
          <h2>Completion</h2>
          <div className="number">
            {completionRate}%
          </div>
        </div>

      </section>

      <CategoryChart tasks={tasks} />
    </div>
  );
}

export default Analytics;
