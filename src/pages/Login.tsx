import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <div className="oauth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={() => handleOAuthLogin("google")}
        >
          🔵 Continue with Google
        </button>

        <button
          type="button"
          className="github-btn"
          onClick={() => handleOAuthLogin("github")}
        >
          ⚫ Continue with GitHub
        </button>

        <button
          type="button"
          className="discord-btn"
          onClick={() => handleOAuthLogin("discord")}
        >
          🟣 Continue with  Discord 
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;