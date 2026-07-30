import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { getTasks } from "../services/taskService";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
} from "../services/exportService";

import type { Task } from "../types/task";
import "../styles/export.css";

function ExportPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await getTasks(user.id);

    if (data) {
      setTasks(data);
    }
  }

  return (
    <div className="export-page">

      <h1>📄 Export Tasks</h1>

      <p>
        Download your TaskFlow data in different formats.
      </p>

      <div className="export-buttons">

        <button onClick={() => exportToPDF(tasks)}>
          Export PDF
        </button>

        <button onClick={() => exportToExcel(tasks)}>
          Export Excel
        </button>

        <button onClick={() => exportToCSV(tasks)}>
          Export CSV
        </button>

      </div>

    </div>
  );
}

export default ExportPage;