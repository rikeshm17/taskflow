import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { getTasks } from "../services/taskService";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
} from "../services/exportService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Task } from "../types/task";
import "../styles/export.css";

function ExportPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadTasks();
    loadUserEmail();
  }, []);

  async function loadUserEmail() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email ?? "");
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function loadTasks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await getTasks(user.id);

    if (data) {
      setTasks(data);
    }

    setLoading(false);
  }

  return (
    <div className="dashboard">
      <Navbar onLogout={logout} userEmail={userEmail} />

      <div className="export-page">

        <h1>Export Tasks</h1>

        <p>
          Download your TaskFlow data in different formats.
        </p>

        <div className="export-buttons">

          <button
            onClick={() => exportToPDF(tasks)}
            disabled={loading}
          >
            Export PDF
          </button>

          <button
            onClick={() => exportToExcel(tasks)}
            disabled={loading}
          >
            Export Excel
          </button>

          <button
            onClick={() => exportToCSV(tasks)}
            disabled={loading}
          >
            Export CSV
          </button>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default ExportPage;