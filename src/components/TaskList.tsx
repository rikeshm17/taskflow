import type { Task } from "../types/task";
import TaskCard from "./TaskCard";
import SearchFilter from "./SearchFilter";

interface TaskListProps {
  filteredTasks: Task[];
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  search: string;
  filter: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  loading?: boolean;
}

function TaskList({
  filteredTasks,
  onComplete,
  onEdit,
  onDelete,
  search,
  filter,
  categoryFilter,
  onSearchChange,
  onFilterChange,
  onCategoryFilterChange,
  loading = false,
}: TaskListProps) {
  return (
    <section className="task-list">
      <SearchFilter
        search={search}
        filter={filter}
        categoryFilter={categoryFilter}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        onCategoryFilterChange={onCategoryFilterChange}
      />

      <div className="task-header">
        <h2>Recent Tasks</h2>

        <span>{filteredTasks.length} Tasks</span>
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="task-card skeleton-card-task">
            <div className="skeleton skeleton-text" style={{ width: "70%" }} />
            <div className="skeleton skeleton-text short" />
            <div className="skeleton skeleton-text" style={{ width: "40%" }} />
          </div>
        ))
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h2>📋</h2>

          <h3>No Tasks Yet</h3>

          <p>
            Create your first task above to get started.
          </p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </section>
  );
}

export default TaskList;
