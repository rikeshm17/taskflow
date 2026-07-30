import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  onLogout: () => void;
  userEmail: string;
}

function Navbar({ onLogout, userEmail }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="logo">⚡ TaskFlow</div>

      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Analytics
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/kanban"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Kanban
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Settings
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Calendar
        </NavLink>

        <NavLink
          to="/export"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Export
        </NavLink>
      </div>

      <div className="nav-right">

        <NotificationBell />

        <button
          className="theme-btn"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="nav-avatar">
          {userEmail.charAt(0).toUpperCase()}
        </div>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;