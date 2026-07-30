import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const isOverdue =
    task.due_date &&
    !task.completed &&
    new Date(task.due_date) < new Date();

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="task-info">
        <h3>{task.title}</h3>

        <p>{task.description}</p>

        <div className="task-badges">
          <span className={`priority ${task.priority.toLowerCase()}`}>
            {task.priority === "High"
              ? "🔴 High"
              : task.priority === "Medium"
              ? "🟡 Medium"
              : "🟢 Low"}
          </span>

          <span className="category">
            📂 {task.category}
          </span>

          <span
            className={`status ${
              task.completed ? "done" : "pending-status"
            }`}
          >
            {task.completed ? "✅ Completed" : "⏳ Pending"}
          </span>
        </div>

        {task.due_date && (
          <p className="due-date">
            📅 Due: {new Date(task.due_date).toLocaleDateString()}
          </p>
        )}

        {task.repeat_type !== "None" && (
          <p className="repeat-type">
            🔁 Repeats: {task.repeat_type}
          </p>
        )}

        {isOverdue && (
          <p className="overdue">
            ⚠️ OVERDUE
          </p>
        )}
      </div>

      <div className="task-actions">
        <button
          className="complete-btn"
          onClick={() => onComplete(task)}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button
          className="edit-btn"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;