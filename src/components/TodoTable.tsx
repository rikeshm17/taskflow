import { useState, useRef, useEffect } from "react";
import type { Task } from "../types/task";

interface TodoTableProps {
  tasks: Task[];
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onAdd: (task: {
    title: string;
    description: string;
    priority: string;
    category: string;
    due_date: string | null;
    repeat_type: string;
  }) => void;
  loading?: boolean;
}

function TodoTable({
  tasks,
  onComplete,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: TodoTableProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [repeatType, setRepeatType] = useState("None");

  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedTasks.length > 0 && selectedTasks.length < tasks.length;
    }
  }, [selectedTasks, tasks]);

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleTaskSelection = (id: number) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((t) => t.id));
    }
  };

  const handleBulkComplete = () => {
    selectedTasks.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      if (task) onComplete(task);
    });
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    if (
      !confirm(
        `Delete ${selectedTasks.length} selected task(s)? This action cannot be undone.`
      )
    )
      return;
    selectedTasks.forEach((id) => onDelete(id));
    setSelectedTasks([]);
  };

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Personal");
    setDueDate("");
    setRepeatType("None");
    setShowAddForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      due_date: dueDate || null,
      repeat_type: repeatType,
    });

    resetForm();
  }

  return (
    <div className="todo-table-wrapper">
      <div className="todo-table-header">
        <h2>to do</h2>
        <div className="todo-header-actions">
          <span className="todo-count">{tasks.length} Tasks</span>
          {!showAddForm && (
            <button
              className="todo-add-btn"
              onClick={() => setShowAddForm(true)}
            >
              + New Task
            </button>
          )}
        </div>
      </div>

      <div className="todo-table-container">
        {selectedTasks.length > 0 && (
          <div className="bulk-actions-bar">
            <span className="selected-count">
              {selectedTasks.length} selected
            </span>
            <div className="bulk-action-buttons">
              <button
                className="bulk-btn complete"
                onClick={handleBulkComplete}
                title="Mark selected as complete"
              >
                ✓ Complete
              </button>
              <button
                className="bulk-btn delete"
                onClick={handleBulkDelete}
                title="Delete selected tasks"
              >
                ✕ Delete
              </button>
              <button
                className="bulk-btn clear"
                onClick={() => setSelectedTasks([])}
                title="Clear selection"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <table className="todo-table">
          <thead>
            <tr>
              <th className="checkbox-header">
                <input
                  type="checkbox"
                  className="select-all-checkbox"
                  ref={selectAllRef}
                  checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Title</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showAddForm && (
              <tr className="todo-add-row">
                <td colSpan={7}>
                  <form className="todo-add-form" onSubmit={handleSubmit}>
                    <div className="todo-form-row">
                      <input
                        type="text"
                        placeholder="Task title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="todo-input"
                        autoFocus
                      />
                      <input
                        type="text"
                        placeholder="Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="todo-input"
                      />
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="todo-select"
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="todo-select"
                      >
                        <option>Work</option>
                        <option>Study</option>
                        <option>Personal</option>
                        <option>Fitness</option>
                        <option>Shopping</option>
                        <option>Other</option>
                      </select>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="todo-input"
                      />
                      <select
                        value={repeatType}
                        onChange={(e) => setRepeatType(e.target.value)}
                        className="todo-select"
                      >
                        <option>None</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div className="todo-form-actions">
                      <button type="submit" className="todo-btn submit-btn">
                        Save
                      </button>
                      <button
                        type="button"
                        className="todo-btn cancel-btn"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            )}

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td>
                    <div className="skeleton skeleton-checkbox" />
                  </td>
                  <td>
                    <div className="skeleton skeleton-text" style={{ width: "80%" }} />
                  </td>
                  <td>
                    <div className="skeleton skeleton-badge" />
                  </td>
                  <td>
                    <div className="skeleton skeleton-text short" />
                  </td>
                  <td>
                    <div className="skeleton skeleton-text short" />
                  </td>
                  <td>
                    <div className="skeleton skeleton-badge" />
                  </td>
                  <td>
                    <div className="skeleton skeleton-btn" />
                  </td>
                </tr>
              ))
            ) : tasks.length === 0 && !showAddForm ? (
              <tr className="empty-row">
                <td colSpan={7}>
                  <div className="todo-empty-state">
                    <div className="todo-empty-icon">📋</div>
                    <h3>No Tasks Yet</h3>
                    <p>Create your first task above to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const isOverdue =
                  task.due_date &&
                  !task.completed &&
                  new Date(task.due_date) < new Date();

                return (
                   <tr
                     key={task.id}
                     className={`todo-row ${task.completed ? "completed" : ""}`}
                   >
                     <td className="checkbox-cell">
                       <input
                         type="checkbox"
                         className="task-checkbox"
                         checked={selectedTasks.includes(task.id)}
                         onChange={() => toggleTaskSelection(task.id)}
                       />
                     </td>
                     <td className="task-title-cell">
                      <div className="task-title-content">
                        <span className="task-title-text">{task.title}</span>
                        {task.description && (
                          <span className="task-desc-text">{task.description}</span>
                        )}
                        {task.repeat_type !== "None" && (
                          <span className="repeat-badge">🔁 {task.repeat_type}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority === "Urgent"
                          ? "🚨 Urgent"
                          : task.priority === "High"
                          ? "🔴 High"
                          : task.priority === "Medium"
                          ? "🟡 Medium"
                          : "🟢 Low"}
                      </span>
                    </td>
                    <td>
                      <span className="category-badge">
                        📂 {task.category}
                      </span>
                    </td>
                    <td>
                      <span className={`due-date-cell ${isOverdue ? "overdue" : ""}`}>
                        {formatDate(task.due_date)}
                        {isOverdue && <span className="overdue-label"> OVERDUE</span>}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${task.completed ? "done" : "pending"}`}>
                        {task.completed ? "✅ Done" : "⏳ Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="todo-actions">
                        <button
                          className="todo-btn complete"
                          onClick={() => onComplete(task)}
                          title={task.completed ? "Undo" : "Complete"}
                        >
                          {task.completed ? "↩" : "✓"}
                        </button>
                        <button
                          className="todo-btn edit"
                          onClick={() => onEdit(task)}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          className="todo-btn delete"
                          onClick={() => onDelete(task.id)}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TodoTable;
