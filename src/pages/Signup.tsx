import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Signup() {
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

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
      toast.error(error.message);
      return;
    }

    if (!data.user) {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
      toast.error("Signup failed.");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name: "",
        avatar_url: "",
      });

    if (mountedRef.current) {
      setIsSubmitting(false);
    }

    if (profileError) {
      toast.error("Failed to create profile. Please contact support or try again.");
      return;
    }

    toast.success("Account created! Check your email.");
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
            minLength={6}
            autoComplete="new-password"
          />

          <button className="auth-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
