import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../services/notificationService";
import { supabase } from "../services/supabase";
import type { Notification } from "../types/notification";

function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

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
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await getNotifications(user.id);

    if (data) {
      setNotifications(data as Notification[]);
    }
  }

  const unread = notifications.filter(
    (n) => !n.is_read
  ).length;

  return (
    <div className="notification-wrapper">

      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
      >
        🔔

        {unread > 0 && (
          <span className="notification-count">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">

          <h3>Notifications</h3>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.is_read ? "" : "unread"
                }`}
              >
                <strong>{notification.title}</strong>

                <p>{notification.message}</p>

                <div className="notification-actions">

                  {!notification.is_read && (
                    <button
                      onClick={async () => {
                        await markNotificationRead(notification.id);
                        loadNotifications();
                      }}
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      await deleteNotification(notification.id);
                      loadNotifications();
                    }}
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))
          )}

        </div>
      )}

    </div>
  );
}

export default NotificationBell;