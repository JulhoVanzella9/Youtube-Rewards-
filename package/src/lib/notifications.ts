// Push Notification utilities for PWA

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch {
    return false;
  }
}

export async function scheduleNotification(
  title: string,
  body: string,
  delayMs: number,
  tag?: string
): Promise<boolean> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return false;

  // Store the scheduled notification in localStorage
  const scheduledTime = Date.now() + delayMs;
  const notification = {
    title,
    body,
    scheduledTime,
    tag: tag || "default",
  };

  try {
    const stored = localStorage.getItem("scheduledNotifications");
    const notifications = stored ? JSON.parse(stored) : [];
    
    // Remove existing notification with same tag
    const filtered = notifications.filter((n: { tag: string }) => n.tag !== notification.tag);
    filtered.push(notification);
    
    localStorage.setItem("scheduledNotifications", JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function checkScheduledNotifications(): void {
  try {
    const stored = localStorage.getItem("scheduledNotifications");
    if (!stored) return;

    const notifications = JSON.parse(stored);
    const now = Date.now();
    const remaining: typeof notifications = [];

    notifications.forEach((notification: { title: string; body: string; scheduledTime: number; tag: string }) => {
      if (notification.scheduledTime <= now) {
        // Time to show this notification
        showNotification(notification.title, notification.body, notification.tag);
      } else {
        remaining.push(notification);
      }
    });

    localStorage.setItem("scheduledNotifications", JSON.stringify(remaining));
  } catch {
    // Silent fail
  }
}

export async function showNotification(title: string, body: string, tag?: string): Promise<boolean> {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return false;
  }

  try {
    // Try to use service worker notification for better reliability
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const options: NotificationOptions & { vibrate?: number[]; actions?: Array<{ action: string; title: string }> } = {
        body,
        icon: "/icons/icon-192x192.jpg",
        badge: "/icons/icon-192x192.jpg",
        tag: tag || "tikcash-notification",
        vibrate: [100, 50, 100],
        data: { url: "/create" },
        actions: [
          { action: "open", title: "Open App" },
          { action: "close", title: "Dismiss" },
        ],
      };
      await registration.showNotification(title, options);
      return true;
    } else {
      // Fallback to regular notification
      new Notification(title, {
        body,
        icon: "/icons/icon-192x192.jpg",
        tag: tag || "tikcash-notification",
      });
      return true;
    }
  } catch {
    return false;
  }
}

// Schedule notification for when daily ratings reset (24 hours from now)
export async function scheduleRatingsAvailableNotification(): Promise<boolean> {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  
  return scheduleNotification(
    "Videos Available! 🎬",
    "Your daily video ratings have reset. Rate 3 videos now to earn more money!",
    TWENTY_FOUR_HOURS,
    "daily-ratings"
  );
}
