import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
  
} from "react-icons/fa";
import {
  getAllUsers,
  getAllTasks,
  updateUserRole,
  deleteAnyTask,
} from "../services/adminService";
import { getTotalFocusTime } from "../services/pomodoroService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";
import type { Profile } from "../types";
import type { Task } from "../types/task";
import "../styles/admin.css";

function AdminDashboard() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  useEffect(() => {
    loadData();
    loadUserEmail();
    loadFocusTime();
  }, []);

  async function loadUserEmail() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email ?? "");
  }

  async function loadFocusTime() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const totalFocus = await getTotalFocusTime(user?.id ?? "");
    setTotalFocusTime(totalFocus);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function loadData() {
    const { data: usersData } = await getAllUsers();
    const { data: tasksData } = await getAllTasks();

    setUsers(usersData ?? []);
    setTasks(tasksData ?? []);
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && !t.completed && new Date(t.due_date) < new Date()
  ).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const highPriorityTasks = tasks.filter(
    (t) => t.priority === "High" || t.priority === "Urgent"
  ).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="admin-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar onLogout={logout} userEmail={userEmail} />

      <div className="admin-header">
        <div>
          <h1>👑 Admin Dashboard</h1>
          <p>Monitor and manage your TaskFlow system.</p>
        </div>
        <div className="admin-header-stats">
          <span className="admin-badge success">
            {completionRate}% Complete
          </span>
          <span className="admin-badge warning">
            {overdueTasks} Overdue
          </span>
        </div>
      </div>

      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="stat-card blue" variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }}>
          <div className="stat-icon"><FaUsers /></div>
          <h2>{users.length}</h2>
          <p>Total Users</p>
          <div className="stat-trend">
            <span className="trend-label">Active</span>
            <span className="trend-value">{users.filter((u) => u.role === "user").length} users</span>
          </div>
        </motion.div>

        <motion.div className="stat-card green" variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }}>
          <div className="stat-icon"><FaTasks /></div>
          <h2>{totalTasks}</h2>
          <p>Total Tasks</p>
          <div className="stat-trend">
            <span className="trend-label">Pending</span>
            <span className="trend-value">{pendingTasks} tasks</span>
          </div>
        </motion.div>

        <motion.div className="stat-card orange" variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }}>
          <div className="stat-icon"><FaCheckCircle /></div>
          <h2>{completedTasks}</h2>
          <p>Completed</p>
          <div className="stat-trend">
            <span className="trend-label">Rate</span>
            <span className="trend-value">{completionRate}%</span>
          </div>
        </motion.div>

        <motion.div className="stat-card purple" variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }}>
          <div className="stat-icon"><FaClock /></div>
          <h2>{pendingTasks}</h2>
          <p>Pending</p>
          <div className="stat-trend">
            <span className="trend-label">High Priority</span>
            <span className="trend-value">{highPriorityTasks} tasks</span>
          </div>
        </motion.div>

        <motion.div className="stat-card red" variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }}>
          <div className="stat-icon"><FaExclamationTriangle /></div>
          <h2>{overdueTasks}</h2>
          <p>Overdue</p>
          <div className="stat-trend">
            <span className="trend-label">Attention</span>
            <span className="trend-value">{overdueTasks > 0 ? "Needs action" : "All good"}</span>
          </div>
        </motion.div>

        <motion.div className="stat-card indigo" variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }}>
          <div className="stat-icon"><FaChartLine /></div>
          <h2>{totalFocusTime}</h2>
          <p>Focus Minutes</p>
          <div className="stat-trend">
            <span className="trend-label">Productivity</span>
            <span className="trend-value">{totalFocusTime > 0 ? `${Math.round(totalFocusTime / 60)}h tracked` : "No data"}</span>
          </div>
        </motion.div>
      </motion.div>

      <div className="admin-section">
        <h2>Users</h2>

        <input
          className="search-box"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter((u) =>
                  (u.full_name ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {(user.full_name ?? "U").charAt(0).toUpperCase()}
                        </div>
                        <span>{user.full_name || "Unnamed"}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>

                    <td>
                      <select
                        value={user.role}
                        onChange={async (e) => {
                          await updateUserRole(
                            user.id,
                            e.target.value as "admin" | "user"
                          );
                          loadData();
                        }}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section">
        <h2>Tasks</h2>

        <input
          className="search-box"
          placeholder="Search tasks..."
          value={taskSearch}
          onChange={(e) => setTaskSearch(e.target.value)}
        />

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks
                .filter((task) =>
                  task.title
                    .toLowerCase()
                    .includes(taskSearch.toLowerCase())
                )
                .map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-title-cell">
                        {task.title}
                      </div>
                    </td>

                    <td>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>

                    <td>
                      <span className={`status-badge ${task.completed ? "completed" : "pending"}`}>
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </td>

                    <td>{task.category}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={async () => {
                          if (confirm("Delete this task? This action cannot be undone.")) {
                            await deleteAnyTask(task.id);
                            loadData();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}

export default AdminDashboard;
