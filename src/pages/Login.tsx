import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (session) {
    return null;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (mountedRef.current) {
      setIsSubmitting(false);
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
    }
  }

  async function handleOAuthLogin(
    provider: "google" | "github" | "discord"
  ) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back 👋</h1>

        <p className="auth-subtitle">
          Login to continue to <strong>TaskFlow</strong>
        </p>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button className="auth-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="oauth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={() => handleOAuthLogin("google")}
          disabled={isSubmitting}
        >
          Continue with Google
        </button>

        <button
          type="button"
          className="github-btn"
          onClick={() => handleOAuthLogin("github")}
          disabled={isSubmitting}
        >
          Continue with GitHub
        </button>

        <button
          type="button"
          className="discord-btn"
          onClick={() => handleOAuthLogin("discord")}
          disabled={isSubmitting}
        >
          Continue with Discord
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
