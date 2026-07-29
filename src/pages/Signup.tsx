import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";
import "../styles/auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account 🚀</h1>

        <p className="auth-subtitle">
          Sign up to start managing your tasks with <strong>TaskFlow</strong>
        </p>

        <form onSubmit={handleSignup}>
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
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;