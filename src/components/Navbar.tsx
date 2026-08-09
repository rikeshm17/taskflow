import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  onLogout: () => void;
  userEmail: string;
}

function Navbar({ onLogout, userEmail }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">⚡ TaskFlow</div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="nav-links"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div id="nav-links" className={`nav-links ${menuOpen ? "open" : ""}`} role="navigation" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Analytics
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Profile
        </NavLink>

        <NavLink
          to="/kanban"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Kanban
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Settings
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Calendar
        </NavLink>

        <NavLink
          to="/export"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
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

        <div className="nav-avatar-wrapper">
          <div
            className="nav-avatar"
            aria-hidden="true"
            onClick={() => setProfileOpen(!profileOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setProfileOpen(!profileOpen); }}
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>

          {profileOpen && (
            <div className="nav-avatar-dropdown">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-dropdown-link active" : "nav-dropdown-link"
                }
                onClick={() => setProfileOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-dropdown-link active" : "nav-dropdown-link"
                }
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </NavLink>
              <button
                className="nav-dropdown-logout"
                onClick={() => { setProfileOpen(false); onLogout(); }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="logout-btn logout-btn-desktop"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;