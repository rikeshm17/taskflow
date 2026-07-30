export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Browser doesn't support notifications.");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export function showBrowserNotification(
  title: string,
  body: string
) {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/logo192.png",
  });
}