import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import AvatarUploader from "../components/AvatarUploader";
import "../styles/dashboard.css";

const ACCENT_COLORS = [
  { name: "Red", value: "#FC563C" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
];

const PRIORITIES = ["Low", "Medium", "High"];
const CATEGORIES = ["Work", "Study", "Personal", "Fitness", "Shopping", "Other"];
const WEEK_STARTS = ["Sunday", "Monday", "Saturday"];

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [accent, setAccent] = useState("#FC563C");
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [defaultPriority, setDefaultPriority] = useState("Medium");
  const [defaultCategory, setDefaultCategory] = useState("Personal");
  const [weekStarts, setWeekStarts] = useState("Sunday");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, settings")
      .eq("id", user.id)
      .single();

    if (data) {
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
      if (data.settings) {
        const s = data.settings as Record<string, string>;
        if (s.accent) setAccent(s.accent);
        if (s.default_priority) setDefaultPriority(s.default_priority);
        if (s.default_category) setDefaultCategory(s.default_category);
        if (s.week_starts) setWeekStarts(s.week_starts);
        if (s.reminder_time) setReminderTime(s.reminder_time);
      }
    }
  }

  async function handleSaveProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const settings = {
      accent,
      default_priority: defaultPriority,
      default_category: defaultCategory,
      week_starts: weekStarts,
      reminder_time: reminderTime,
    };

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, settings })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Settings saved!");
      applyAccentColor(accent);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure? This will permanently delete your account and all data."
    );

    if (!confirmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("tasks").delete().eq("user_id", user.id);
    await supabase.from("notifications").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    // await supabase.auth.admin.deleteUser(user.id);

    toast.success("Account deleted.");
  }

  function applyAccentColor(color: string) {
    document.documentElement.style.setProperty("--accent", color);
  }

  function handleAccentChange(color: string) {
    setAccent(color);
    applyAccentColor(color);
  }

  return (
    <div className="dashboard">
      <Navbar onLogout={async () => await supabase.auth.signOut()} userEmail="" />

      <section className="hero">
        <h1>⚙️ Settings</h1>
        <p>Manage your account and preferences.</p>
      </section>

      <section className="settings-page">
        <div className="settings-section">
          <h2>👤 Account</h2>

          <AvatarUploader
            avatarUrl={avatarUrl}
            onUpload={setAvatarUrl}
          />

          <div className="setting-item">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="setting-item">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
          </div>

          <div className="setting-item">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
          </div>

          <button
            className="settings-btn save"
            onClick={handleChangePassword}
            disabled={loading}
          >
            Change Password
          </button>
        </div>

        <div className="settings-section">
          <h2>🎨 Appearance</h2>

          <div className="setting-item">
            <label>Dark Mode</label>
            <button
              className="toggle"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙 Off" : "☀️ On"}
            </button>
          </div>

          <div className="setting-item">
            <label>Accent Color</label>
            <div className="accent-options">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`accent-swatch ${accent === c.value ? "active" : ""}`}
                  style={{ background: c.value }}
                  onClick={() => handleAccentChange(c.value)}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>🔔 Notifications</h2>

          <div className="setting-item">
            <label>Browser Notifications</label>
            <button
              className={`toggle ${browserNotifications ? "on" : ""}`}
              onClick={() => setBrowserNotifications(!browserNotifications)}
            >
              {browserNotifications ? "On" : "Off"}
            </button>
          </div>

          <div className="setting-item">
            <label>Email Notifications</label>
            <button
              className={`toggle ${emailNotifications ? "on" : ""}`}
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              {emailNotifications ? "On" : "Off"}
            </button>
          </div>

          <div className="setting-item">
            <label>Reminder Time</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>📅 Task Preferences</h2>

          <div className="setting-item">
            <label>Default Priority</label>
            <select
              value={defaultPriority}
              onChange={(e) => setDefaultPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <label>Default Category</label>
            <select
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <label>Week Starts On</label>
            <select
              value={weekStarts}
              onChange={(e) => setWeekStarts(e.target.value)}
            >
              {WEEK_STARTS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="settings-section danger">
          <h2>🔒 Privacy</h2>

          <div className="setting-item">
            <label>Danger Zone</label>
            <button
              className="settings-btn delete"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>ℹ About</h2>
          <p className="about-text">TaskFlow v2.0</p>
          <p className="about-sub">Built with React, Supabase & Recharts.</p>
        </div>

        <button
          className="settings-btn save bottom-save"
          onClick={handleSaveProfile}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </section>
    </div>
  );
}

export default Settings;
