import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../services/notificationService";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import type { Notification } from "../types/notification";

const NOTIFICATION_ICONS: Record<string, string> = {
  success: "✓",
  info: "ℹ",
  warning: "⚠",
  error: "✕",
};

function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await getNotifications(user.id);

    if (data) {
      setNotifications(data as Notification[]);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function setupRealtime() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      channel = supabase.channel(`notifications-${user.id}`);

      channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();
    }

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const unread = notifications.filter(
    (n) => !n.is_read
  ).length;

  async function handleMarkAllRead() {
    const unreadNotifications = notifications.filter((n) => !n.is_read);
    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          markNotificationRead(notification.id)
        )
      );
    } catch {
      toast.error("Failed to mark all as read");
    }
    await loadNotifications();
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return (
    <div className="notification-wrapper" ref={panelRef}>

      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        🔔

        {unread > 0 && (
          <motion.span
            className="notification-count"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notification-panel"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>

              {unread > 0 && (
                <button
                  className="mark-all-read"
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="notification-empty-icon">🔔</span>
                <p>No notifications yet</p>
                <span>We'll notify you when something important happens</span>
              </div>
            ) : (
              <div className="notification-list">
                <AnimatePresence>
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={`notification-item ${notification.is_read ? "" : "unread"}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <div className="notification-icon-wrapper">
                        <span className={`notification-type-icon ${notification.type}`}>
                          {NOTIFICATION_ICONS[notification.type] || "ℹ"}
                        </span>
                      </div>

                      <div className="notification-content">
                        <strong>{notification.title}</strong>

                        <p>{notification.message}</p>

                        <span className="notification-time">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>

                        <div className="notification-actions">

                        {!notification.is_read && (
                          <button
                            className="notification-action-btn mark-read"
                            onClick={async () => {
                              try {
                                await markNotificationRead(notification.id);
                                await loadNotifications();
                              } catch {
                                toast.error("Failed to mark as read");
                              }
                            }}
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        )}

                        <button
                          className="notification-action-btn delete"
                          onClick={async () => {
                            try {
                              await deleteNotification(notification.id);
                              await loadNotifications();
                            } catch {
                              toast.error("Failed to delete notification");
                            }
                          }}
                          title="Delete"
                        >
                          ✕
                        </button>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default NotificationBell;
