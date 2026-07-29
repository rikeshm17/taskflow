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
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

function TaskList({
  filteredTasks,
  onComplete,
  onEdit,
  onDelete,
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: TaskListProps) {
  return (
    <section className="task-list">
      <SearchFilter
        search={search}
        filter={filter}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
      />

      <div className="task-header">
        <h2>Recent Tasks</h2>

        <span>{filteredTasks.length} Tasks</span>
      </div>

      {filteredTasks.length === 0 ? (
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
