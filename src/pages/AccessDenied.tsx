import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

function AccessDenied() {
  return (
    <div className="dashboard">
      <div style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "64px",
          marginBottom: "20px",
        }}>🚫</div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 42px)",
          color: "var(--primary)",
          marginBottom: "12px",
        }}>Access Denied</h1>
        <p style={{
          color: "var(--secondary)",
          fontSize: "16px",
          maxWidth: "400px",
          marginBottom: "30px",
        }}>
          You do not have permission to view this page. Please contact an administrator if you believe this is an error.
        </p>
        <Link to="/" className="auth-btn" style={{
          textDecoration: "none",
          display: "inline-block",
          padding: "14px 32px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, var(--crimson) 0%, var(--rose) 100%)",
          color: "white",
          fontWeight: 600,
          fontSize: "15px",
          boxShadow: "0 4px 15px rgba(115,18,17,0.3)",
          transition: "all 0.25s ease",
        }}>
          ← Back to Dashboard
        </Link>
      </div>

      <Footer />
    </div>
  );
}

export default AccessDenied;