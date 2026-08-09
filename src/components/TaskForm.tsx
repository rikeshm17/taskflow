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
        <div className="form-group">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc">Description</label>
          <textarea
            id="task-desc"
            placeholder="Task Description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option>Urgent</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-due">Due Date</label>
          <input
            id="task-due"
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-repeat">Repeat</label>
          <select
            id="task-repeat"
            value={repeatType}
            onChange={(e) => onRepeatTypeChange(e.target.value)}
          >
            <option>None</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-category">Category</label>
          <select
            id="task-category"
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
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
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
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
