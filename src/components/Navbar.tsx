import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Profile
        </NavLink>
      </div>

      <div className="nav-right">

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