import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">⚡ TaskFlow</span>
          <span className="footer-tagline">Organize your work, stay productive.</span>
        </div>

        <div className="footer-links">
          <Link to="/">Dashboard</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/kanban">Kanban</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/settings">Settings</Link>
        </div>

        <div className="footer-bottom">
          <p>TaskFlow AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
