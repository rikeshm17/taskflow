import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import {
  getAllUsers,
  getAllTasks,
  updateUserRole,
  deleteAnyTask,
} from "../services/adminService";
import "../styles/admin.css";

function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: usersData } = await getAllUsers();
    const { data: tasksData } = await getAllTasks();

    setUsers(usersData ?? []);
    setTasks(tasksData ?? []);
  }

  return (
    <motion.div
      className="admin-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      <div className="admin-header">
        <div>
          <h1>👑 Admin Dashboard</h1>
          <p>Manage users, tasks and your TaskFlow system.</p>
        </div>
      </div>

      <div className="stats-grid">

        <motion.div
          className="stat-card blue"
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">
            <FaUsers />
          </div>
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </motion.div>

        <motion.div
          className="stat-card green"
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">
            <FaTasks />
          </div>
          <h2>{tasks.length}</h2>
          <p>Total Tasks</p>
        </motion.div>

        <motion.div
          className="stat-card orange"
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <h2>
            {tasks.filter((t) => t.completed).length}
          </h2>
          <p>Completed</p>
        </motion.div>

        <motion.div
          className="stat-card purple"
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">
            <FaClock />
          </div>
          <h2>
            {tasks.filter((t) => !t.completed).length}
          </h2>
          <p>Pending</p>
        </motion.div>

      </div>

      <div className="admin-section">

        <h2>Users</h2>

        <input
          className="search-box"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
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

                  <td>{user.full_name}</td>

                  <td>{user.email}</td>

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

      <div className="admin-section">

        <h2>Tasks</h2>

        <input
          className="search-box"
          placeholder="Search tasks..."
          value={taskSearch}
          onChange={(e) => setTaskSearch(e.target.value)}
        />

        <table>

          <thead>

            <tr>
              <th>Task</th>
              <th>Priority</th>
              <th>Status</th>
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

                  <td>{task.title}</td>

                  <td>{task.priority}</td>

                  <td>

                    {task.completed
                      ? "Completed"
                      : "Pending"}

                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={async () => {

                        if (confirm("Delete task?")) {

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

    </motion.div>
  );
}

export default AdminDashboard;