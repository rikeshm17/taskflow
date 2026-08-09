import { useEffect, useState, useCallback } from "react";
import { Calendar as BigCalendar, momentLocalizer, type View, type Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "../components/Navbar";
import { getTasks, completeTask, addTask } from "../services/taskService";
import { supabase } from "../services/supabase";
import type { Task } from "../types/task";
import "../styles/dashboard.css";
import "../styles/calendar.css";
import Footer from "../components/Footer";

const localizer = momentLocalizer(moment);

type CalendarEvent = Event & {
  taskId: number;
  priority: string;
  completed: boolean;
  category: string;
  repeat_type: string;
};

const VIEWS: { label: string; value: View }[] = [
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Day", value: "day" },
  { label: "Agenda", value: "agenda" },
];

const PRIORITY_COLORS: Record<string, string> = {
  Urgent: "#B91C1C",
  High: "#731211",
  Medium: "#997A80",
  Low: "#A4B5C3",
};

const CATEGORIES = ["Work", "Study", "Personal", "Fitness", "Shopping", "Other"];
const PRIORITIES = ["Urgent", "High", "Medium", "Low"];

function Calendar() {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskCategory, setNewTaskCategory] = useState("Personal");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadTasks();
    loadUserEmail();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
        setShowCreateModal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function loadTasks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUserEmail(user.email ?? "");
    const { data } = await getTasks(user.id);
    if (data) setTasks(data);
    setLoading(false);
  }

  async function loadUserEmail() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email ?? "");
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const events: CalendarEvent[] = tasks
    .filter((task): task is Task & { due_date: string } => {
      if (!task.due_date) return false;
      if (filterPriority && task.priority !== filterPriority) return false;
      if (filterCategory && task.category !== filterCategory) return false;
      return true;
    })
    .map((task) => ({
      taskId: task.id,
      title: task.completed ? `✓ ${task.title}` : task.title,
      start: new Date(task.due_date),
      end: new Date(task.due_date),
      allDay: true,
      priority: task.priority,
      completed: task.completed,
      category: task.category,
      repeat_type: task.repeat_type,
    }));

  const overdueTasks = tasks.filter(
    (task): task is Task & { due_date: string } => !!task.due_date && !task.completed && new Date(task.due_date) < new Date()
  );

  const todayTasks = tasks.filter(
    (task): task is Task & { due_date: string } => !!task.due_date && !task.completed && moment(task.due_date).isSame(moment(), "day")
  );

  const upcomingTasks = tasks.filter(
    (task): task is Task & { due_date: string } => !!task.due_date && !task.completed && moment(task.due_date).isAfter(moment(), "day") && moment(task.due_date).isBefore(moment().add(7, "days"), "day")
  );

  const workloadByDate = tasks
    .filter((t) => t.due_date && !t.completed)
    .reduce((acc, task) => {
      const day = moment(task.due_date).format("YYYY-MM-DD");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const busyDates = Object.keys(workloadByDate)
    .filter((day) => workloadByDate[day] >= 3)
    .map((day) => moment(day).toDate());

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleSelectSlot = useCallback(
    ({ start }: { start: Date }) => {
      setNewTaskDueDate(moment(start).format("YYYY-MM-DD"));
      setShowCreateModal(true);
    },
    []
  );

  const handleCompleteTask = useCallback(async (taskId: number) => {
    await completeTask(taskId, true);
    setSelectedEvent(null);
    await loadTasks();
  }, []);

  const handleCreateTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await addTask({
      title: newTaskTitle.trim(),
      description: "",
      priority: newTaskPriority,
      category: newTaskCategory,
      status: "todo",
      due_date: newTaskDueDate || null,
      repeat_type: "None",
      user_id: user.id,
    });

    setNewTaskTitle("");
    setNewTaskPriority("Medium");
    setNewTaskCategory("Personal");
    setNewTaskDueDate("");
    setShowCreateModal(false);
    await loadTasks();
  }, [newTaskTitle, newTaskPriority, newTaskCategory, newTaskDueDate]);

  const handleNavigate = useCallback((action: "PREV" | "NEXT" | "TODAY") => {
    const current = moment(date);
    if (action === "PREV") current.subtract(1, view === "day" ? "day" : view === "week" ? "week" : "month");
    if (action === "NEXT") current.add(1, view === "day" ? "day" : view === "week" ? "week" : "month");
    if (action === "TODAY") current.startOf("day");
    setDate(current.toDate());
  }, [date, view]);

  const label = view === "day"
    ? moment(date).format("MMMM D, YYYY")
    : view === "week"
    ? `Week of ${moment(date).startOf("week").format("MMMM D, YYYY")}`
    : moment(date).format("MMMM YYYY");

  const eventPropGetter = (event: CalendarEvent) => {
    const color = PRIORITY_COLORS[event.priority] || "#FC563C";
    const isRecurring = event.repeat_type && event.repeat_type !== "None";
    return {
      style: {
        backgroundColor: color,
        borderRadius: "6px",
        color: "white",
        border: isRecurring ? "2px dashed rgba(255,255,255,0.5)" : "none",
        fontSize: "12px",
        padding: "2px 6px",
        boxShadow: `0 2px 8px ${color}40`,
        cursor: "pointer",
      },
    };
  };

  const clearFilters = () => {
    setFilterPriority(null);
    setFilterCategory(null);
  };

  return (
    <div className="calendar-page">
      <Navbar onLogout={logout} userEmail={userEmail} />

      <div className="calendar-header">
        <div>
          <h1>📅 Calendar</h1>
          <p>View and manage your schedule.</p>
        </div>
        <div className="calendar-header-actions">
          <button className="calendar-create-btn" onClick={() => { setNewTaskDueDate(moment().format("YYYY-MM-DD")); setShowCreateModal(true); }}>
            + New Task
          </button>
        </div>
      </div>

      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={() => handleNavigate("PREV")} aria-label="Previous">‹</button>
          <button className="calendar-nav-btn" onClick={() => handleNavigate("NEXT")} aria-label="Next">›</button>
          <span className="calendar-label">{label}</span>
          <button className="calendar-today-btn" onClick={() => handleNavigate("TODAY")}>Today</button>
        </div>

        <div className="calendar-filters">
          <select
            value={filterPriority || ""}
            onChange={(e) => setFilterPriority(e.target.value || null)}
            className="calendar-filter-select"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filterCategory || ""}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="calendar-filter-select"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {(filterPriority || filterCategory) && (
            <button className="calendar-clear-filters" onClick={clearFilters}>Clear</button>
          )}
        </div>

        <div className="calendar-view-toggle">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              className={`calendar-view-btn ${view === v.value ? "active" : ""}`}
              onClick={() => setView(v.value)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-container">
          <div className="calendar-wrapper">
            {loading ? (
              <div className="calendar-loading">
                <div className="skeleton" style={{ height: 600 }} />
              </div>
            ) : (
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
                style={{ height: 600 }}
                views={["month", "week", "day", "agenda"]}
                popup
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                eventPropGetter={eventPropGetter}
              />
            )}
          </div>
        </div>

        <div className="calendar-sidebar">
          {busyDates.length > 0 && (
            <div className="calendar-sidebar-section busy-section">
              <h3>⚠️ Busy Days ({busyDates.length})</h3>
              <ul>
                {busyDates.slice(0, 5).map((d, i) => (
                  <li key={i} className="sidebar-task busy">
                    <span className="sidebar-task-title">{moment(d).format("ddd, MMM D")}</span>
                    <span className="sidebar-task-badge">{workloadByDate[moment(d).format("YYYY-MM-DD")]} tasks</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {overdueTasks.length > 0 && (
            <div className="calendar-sidebar-section overdue-section">
              <h3>🔴 Overdue ({overdueTasks.length})</h3>
              <ul>
                {overdueTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="sidebar-task overdue" onClick={() => setSelectedEvent({
                    taskId: task.id,
                    title: task.title,
                    start: new Date(task.due_date),
                    end: new Date(task.due_date),
                    allDay: true,
                    priority: task.priority,
                    completed: task.completed,
                    category: task.category,
                    repeat_type: task.repeat_type,
                  })}>
                    <span className="sidebar-task-title">{task.title}</span>
                    <span className="sidebar-task-date">{moment(task.due_date).format("MMM D")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {todayTasks.length > 0 && (
            <div className="calendar-sidebar-section today-section">
              <h3>📌 Today ({todayTasks.length})</h3>
              <ul>
                {todayTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="sidebar-task today" onClick={() => setSelectedEvent({
                    taskId: task.id,
                    title: task.title,
                    start: new Date(task.due_date),
                    end: new Date(task.due_date),
                    allDay: true,
                    priority: task.priority,
                    completed: task.completed,
                    category: task.category,
                    repeat_type: task.repeat_type,
                  })}>
                    <span className="sidebar-task-title">{task.title}</span>
                    <span className="sidebar-task-priority">{task.priority}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <div className="calendar-sidebar-section upcoming-section">
              <h3>⏳ Upcoming ({upcomingTasks.length})</h3>
              <ul>
                {upcomingTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="sidebar-task upcoming" onClick={() => setSelectedEvent({
                    taskId: task.id,
                    title: task.title,
                    start: new Date(task.due_date),
                    end: new Date(task.due_date),
                    allDay: true,
                    priority: task.priority,
                    completed: task.completed,
                    category: task.category,
                    repeat_type: task.repeat_type,
                  })}>
                    <span className="sidebar-task-title">{task.title}</span>
                    <span className="sidebar-task-date">{moment(task.due_date).format("MMM D")}</span>
                    {task.repeat_type && task.repeat_type !== "None" && (
                      <span className="repeat-icon" title={`Repeats ${task.repeat_type}`}>🔁</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && tasks.filter((t) => t.due_date && !t.completed).length === 0 && (
            <div className="calendar-sidebar-section empty-section">
              <h3>📭 No Upcoming Tasks</h3>
              <p>Create tasks with due dates to see them here.</p>
                <button className="calendar-create-inline" onClick={() => { setNewTaskDueDate(moment().format("YYYY-MM-DD")); setShowCreateModal(true); }}>
                + Create Task
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedEvent.repeat_type && selectedEvent.repeat_type !== "None" && (
                <div className="modal-detail">
                  <span className="modal-label">Repeats</span>
                  <span className="modal-repeat">🔁 {selectedEvent.repeat_type}</span>
                </div>
              )}
              <div className="modal-detail">
                <span className="modal-label">Priority</span>
                <span className={`modal-priority ${selectedEvent.priority.toLowerCase()}`}>{selectedEvent.priority}</span>
              </div>
              <div className="modal-detail">
                <span className="modal-label">Category</span>
                <span>{selectedEvent.category}</span>
              </div>
              <div className="modal-detail">
                <span className="modal-label">Due Date</span>
                <span>{moment(selectedEvent.start).format("MMMM D, YYYY")}</span>
              </div>
              <div className="modal-detail">
                <span className="modal-label">Status</span>
                <span>{selectedEvent.completed ? "✅ Completed" : "⏳ Pending"}</span>
              </div>
            </div>
            <div className="modal-actions">
              {!selectedEvent.completed && (
                <button className="modal-btn complete" onClick={() => handleCompleteTask(selectedEvent.taskId)}>
                  Mark Complete
                </button>
              )}
              <button className="modal-btn close" onClick={() => setSelectedEvent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Task</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                  autoFocus
                />
              </div>
              <div className="modal-form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Priority</label>
                  <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Category</label>
                  <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn complete" onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>
                Create Task
              </button>
              <button className="modal-btn close" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="calendar-upcoming">
        <h3>Upcoming Important Tasks</h3>
        <div className="upcoming-tasks-list">
          {tasks
            .filter((t) => {
              if (!t.due_date || t.completed) return false;
              const taskDate = moment(t.due_date);
              const now = moment();
              return taskDate.isSame(now, "day") || taskDate.isAfter(now, "day");
            })
            .sort((a, b) => moment(a.due_date).valueOf() - moment(b.due_date).valueOf())
            .slice(0, 8)
            .map((task) => (
              <div key={task.id} className="upcoming-task-item">
                <div className="upcoming-task-info">
                  <span className="upcoming-task-title">{task.title}</span>
                  <span className="upcoming-task-meta">
                    {moment(task.due_date).format("MMM D, YYYY")} • {task.priority}
                  </span>
                </div>
                <span className={`upcoming-task-badge priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Calendar;
