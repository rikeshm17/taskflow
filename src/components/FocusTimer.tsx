import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPomodoroSession, completePomodoroSession, getPomodoroSessions } from "../services/pomodoroService";
import type { Task } from "../types";

interface FocusTimerProps {
  tasks: Task[];
}

type TimerStatus = "idle" | "running" | "paused" | "completed";

const PRESETS = [10, 15, 25, 30, 45, 60];

function FocusTimer({ tasks }: FocusTimerProps) {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState("");
  const [sessionCount, setSessionCount] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const completeRef = useRef(handleComplete);
  completeRef.current = handleComplete;

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (status === "running" && prev > 0) {
          return prev - 1;
        } else if (status === "running" && prev === 0) {
          completeRef.current();
          return 0;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  async function loadStats() {
    const { data } = await getPomodoroSessions("");
    if (data) {
      const completed = data.filter((s) => s.completed);
      setSessionCount(completed.length);
      const total = completed.reduce((sum, s) => sum + s.duration_minutes, 0);
      setTotalFocusTime(total);
    }
  }

  async function handleStart() {
    if (!selectedTaskId) {
      alert("Please select a task first");
      return;
    }

    const minutes = selectedMinutes;
    const { data } = await createPomodoroSession("", selectedTaskId, minutes);
    if (data && data[0] && data[0].id) {
      setCurrentSessionId(data[0].id);
    }

    setStatus("running");
    setTimeLeft(minutes * 60);
  }

  async function handlePause() {
    setStatus("paused");
  }

  async function handleResume() {
    setStatus("running");
  }

  async function handleReset() {
    setStatus("idle");
    setTimeLeft(selectedMinutes * 60);
    setCurrentSessionId(null);
  }

  async function handleComplete() {
    if (currentSessionId) {
      await completePomodoroSession(currentSessionId);
    }

    setStatus("completed");
    setSessionCount((prev) => prev + 1);
    setTotalFocusTime((prev) => prev + selectedMinutes);

    setTimeout(() => {
      setStatus("idle");
      setTimeLeft(selectedMinutes * 60);
      setCurrentSessionId(null);
    }, 3000);
  }

  function handlePresetClick(minutes: number) {
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setCustomMinutes("");
    setStatus("idle");
  }

  function handleCustomTimeChange(value: string) {
    setCustomMinutes(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0 && num <= 120) {
      setSelectedMinutes(num);
      setTimeLeft(num * 60);
      setStatus("idle");
    }
  }

  function handleScrollAdjust(delta: number) {
    const newMinutes = Math.max(1, Math.min(120, selectedMinutes + delta));
    setSelectedMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
    setCustomMinutes(String(newMinutes));
    setStatus("idle");
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const progress = timeLeft > 0 ? ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100 : 0;

  return (
    <div className="focus-timer-section">
      <button
        className="focus-timer-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="focus-timer-icon">⏱️</span>
        <span>Focus Timer</span>
        {sessionCount > 0 && (
          <span className="focus-timer-badge">{sessionCount}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="focus-timer-card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="focus-timer-header">
              <h3>Focus Timer</h3>
              <div className="focus-timer-header-actions">
                <button
                  className="focus-settings-btn"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Settings"
                >
                  ⚙️
                </button>
                <div className="focus-timer-stats">
                  <div className="focus-stat">
                    <span className="focus-stat-value">{sessionCount}</span>
                    <span className="focus-stat-label">Sessions</span>
                  </div>
                  <div className="focus-stat">
                    <span className="focus-stat-value">{totalFocusTime}</span>
                    <span className="focus-stat-label">Minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {showSettings && (
              <motion.div
                className="focus-settings-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="focus-setting-item">
                  <label>Sound Notifications</label>
                  <button
                    className={`focus-toggle ${soundEnabled ? "active" : ""}`}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? "ON" : "OFF"}
                  </button>
                </div>
                <div className="focus-setting-item">
                  <label>Auto-start Break</label>
                  <button
                    className={`focus-toggle ${autoStartBreak ? "active" : ""}`}
                    onClick={() => setAutoStartBreak(!autoStartBreak)}
                  >
                    {autoStartBreak ? "ON" : "OFF"}
                  </button>
                </div>
              </motion.div>
            )}

            <div className="focus-timer-display">
              <div className="focus-timer-ring">
                <svg viewBox="0 0 120 120" className="focus-timer-svg">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="var(--glass-border)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="focus-timer-time">
                  {status === "completed" ? "✓" : formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="focus-timer-presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  className={`focus-preset-btn ${selectedMinutes === preset ? "active" : ""}`}
                  onClick={() => handlePresetClick(preset)}
                  disabled={status === "running"}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="focus-timer-scroll">
              <button
                className="focus-scroll-btn"
                onClick={() => handleScrollAdjust(-5)}
                disabled={status === "running"}
                aria-label="Decrease 5 minutes"
              >
                −5
              </button>
              <div className="focus-scroll-track">
                <div className="focus-scroll-fill" style={{ width: `${(selectedMinutes / 60) * 100}%` }} />
              </div>
              <button
                className="focus-scroll-btn"
                onClick={() => handleScrollAdjust(5)}
                disabled={status === "running"}
                aria-label="Increase 5 minutes"
              >
                +5
              </button>
            </div>

            <div className="focus-timer-custom">
              <label htmlFor="focus-custom">Custom (min)</label>
              <input
                id="focus-custom"
                type="number"
                min="1"
                max="120"
                value={customMinutes}
                onChange={(e) => handleCustomTimeChange(e.target.value)}
                disabled={status === "running"}
                placeholder="Enter minutes"
              />
            </div>

            <div className="focus-timer-task-select">
              <label htmlFor="focus-task">Task</label>
              <select
                id="focus-task"
                value={selectedTaskId ?? ""}
                onChange={(e) => setSelectedTaskId(Number(e.target.value) || null)}
                disabled={status === "running"}
              >
                <option value="">Select a task...</option>
                {tasks
                  .filter((t) => !t.completed)
                  .map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="focus-timer-controls">
              {status === "idle" && (
                <button className="focus-btn start" onClick={handleStart}>
                  Start Focus
                </button>
              )}

              {status === "running" && (
                <>
                  <button className="focus-btn pause" onClick={handlePause}>
                    Pause
                  </button>
                  <button className="focus-btn reset" onClick={handleReset}>
                    Reset
                  </button>
                </>
              )}

              {status === "paused" && (
                <>
                  <button className="focus-btn resume" onClick={handleResume}>
                    Resume
                  </button>
                  <button className="focus-btn reset" onClick={handleReset}>
                    Reset
                  </button>
                </>
              )}

              {status === "completed" && (
                <button className="focus-btn start" onClick={handleReset}>
                  New Session
                </button>
              )}
            </div>

            <div className="focus-timer-mode">
              {status === "running" && (
                <span className="focus-mode-indicator running">
                  ● Focus Time
                </span>
              )}
              {status === "paused" && (
                <span className="focus-mode-indicator paused">
                  ⏸ Paused
                </span>
              )}
              {status === "completed" && (
                <span className="focus-mode-indicator completed">
                  ✓ Session Complete!
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FocusTimer;
