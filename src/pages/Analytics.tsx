import { useEffect, useState } from "react";
import moment from "moment";
import { supabase } from "../services/supabase";
import type { Task } from "../types/task";
import Navbar from "../components/Navbar";
import CategoryChart from "../components/charts/CategoryChart";
import PriorityChart from "../components/charts/PriorityChart";
import StatusChart from "../components/charts/StatusChart";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

function Analytics() {
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
      .eq("user_id", user.id);

    if (data) {
      setTasks(data as Task[]);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter(
    (t) => t.due_date && !t.completed && new Date(t.due_date) < new Date()
  ).length;
  const today = tasks.filter(
    (t) => t.due_date && !t.completed && moment(t.due_date).isSame(moment(), "day")
  ).length;
  const thisWeek = tasks.filter(
    (t) =>
      t.due_date &&
      !t.completed &&
      moment(t.due_date).isAfter(moment(), "day") &&
      moment(t.due_date).isBefore(moment().add(7, "days"), "day")
  ).length;
  const highPriority = tasks.filter(
    (t) => t.priority === "High" || t.priority === "Urgent"
  ).length;

  const completionRate =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const categoryDistribution = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryDistribution).sort((a, b) => b[1] - a[1])[0];

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

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton skeleton-text" style={{ width: "60%" }} />
              <div className="skeleton skeleton-number" />
            </div>
          ))
        ) : (
          <>
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
              <h2>In Progress</h2>
              <div className="number">{inProgress}</div>
            </div>

            <div className="card">
              <h2>Overdue</h2>
              <div className="number" style={{ color: overdue > 0 ? "#EF4444" : undefined }}>
                {overdue}
              </div>
            </div>

            <div className="card">
              <h2>Completion Rate</h2>
              <div className="number">{completionRate}%</div>
            </div>
          </>
        )}

      </section>

      {!loading && (
        <section className="analytics-insights">
          <div className="insight-card">
            <span className="insight-icon">📅</span>
            <div className="insight-content">
              <h3>Today</h3>
              <p className="insight-value">{today} tasks</p>
            </div>
          </div>

          <div className="insight-card">
            <span className="insight-icon">⏳</span>
            <div className="insight-content">
              <h3>This Week</h3>
              <p className="insight-value">{thisWeek} tasks</p>
            </div>
          </div>

          <div className="insight-card">
            <span className="insight-icon">🔥</span>
            <div className="insight-content">
              <h3>High Priority</h3>
              <p className="insight-value">{highPriority} tasks</p>
            </div>
          </div>

          {topCategory && (
            <div className="insight-card">
              <span className="insight-icon">📂</span>
              <div className="insight-content">
                <h3>Top Category</h3>
                <p className="insight-value">{topCategory[0]} ({topCategory[1]})</p>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="charts-grid">
        <CategoryChart tasks={tasks} />
        <PriorityChart tasks={tasks} />
        <StatusChart tasks={tasks} />
      </section>

      <Footer />
    </div>
  );
}

export default Analytics;

