import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSubtasks, addSubtask, updateSubtask, deleteSubtask } from "../services/subtaskService";
import type { Subtask } from "../types";
import "../styles/subtasks.css";

interface SubtaskListProps {
  taskId: number;
}

function SubtaskList({ taskId }: SubtaskListProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  const loadSubtasks = useCallback(async () => {
    const { data } = await getSubtasks(taskId);
    if (data) setSubtasks(data);
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    loadSubtasks();
  }, [loadSubtasks]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const { data } = await addSubtask(taskId, newTitle.trim());
    if (data && Array.isArray(data) && data[0]) {
      setSubtasks([...subtasks, data[0]]);
      setNewTitle("");
    }
  }

  async function handleToggle(subtask: Subtask) {
    await updateSubtask(subtask.id, !subtask.completed);
    setSubtasks(subtasks.map((s) => (s.id === subtask.id ? { ...s, completed: !s.completed } : s)));
  }

  async function handleDelete(id: number) {
    await deleteSubtask(id);
    setSubtasks(subtasks.filter((s) => s.id !== id));
  }

  const completedCount = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length === 0 ? 0 : Math.round((completedCount / subtasks.length) * 100);

  return (
    <div className="subtask-list">
      <button className="subtask-toggle" onClick={() => setExpanded(!expanded)}>
        <span className="subtask-toggle-icon">{expanded ? "▼" : "▶"}</span>
        <span>Subtasks ({completedCount}/{subtasks.length})</span>
        <span className="subtask-progress-mini">{progress}%</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="subtask-content"
          >
            {subtasks.length > 0 && (
              <div className="subtask-progress-bar">
                <motion.div
                  className="subtask-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}

            {loading ? (
              <div className="subtask-loading">
                <div className="skeleton skeleton-text" style={{ width: "70%" }} />
              </div>
            ) : (
              <ul className="subtask-items">
                <AnimatePresence>
                  {subtasks.map((subtask) => (
                    <motion.li
                      key={subtask.id}
                      className={`subtask-item ${subtask.completed ? "completed" : ""}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="subtask-checkbox">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleToggle(subtask)}
                        />
                        <span className="checkmark" />
                      </label>
                      <span className="subtask-title">{subtask.title}</span>
                      <button className="subtask-delete" onClick={() => handleDelete(subtask.id)}>
                        ✕
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            <form className="subtask-form" onSubmit={handleAdd}>
              <input
                type="text"
                placeholder="Add subtask..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="subtask-input"
              />
              <button type="submit" className="subtask-add-btn" disabled={!newTitle.trim()}>
                +
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubtaskList;
