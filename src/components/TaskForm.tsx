import type { Task } from "../types/task";

interface TaskFormProps {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  repeatType: string;
  category: string;
  editingTask: Task | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onRepeatTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function TaskForm({
  title,
  description,
  priority,
  dueDate,
  repeatType,
  category,
  editingTask,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueDateChange,
  onRepeatTypeChange,
  onCategoryChange,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  return (
    <section className="task-form">
      <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />

          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
          />

          <select
            value={repeatType}
            onChange={(e) => onRepeatTypeChange(e.target.value)}
          >
            <option>None</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option>Work</option>
            <option>Study</option>
            <option>Personal</option>
            <option>Fitness</option>
            <option>Shopping</option>
            <option>Other</option>
          </select>

        <button type="submit">
          {editingTask ? "Save Changes" : "+ Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}

export default TaskForm;
