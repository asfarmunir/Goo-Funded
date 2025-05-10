import { NotificationType } from "@prisma/client";

const APP_BASE_URL = process.env.NODE_ENV === "production" ? "https://app.vantagepicks.com" : "http://localhost:3000";

export const sendNotification = async (
  message: string,
  type: NotificationType,
  userId: string
) => {
  const response = await fetch(`${APP_BASE_URL}/api/notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, type, userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to send notification");
  }
  const ws_response = await fetch(`${process.env.BG_SERVICES_URL}/generate-notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, message }),
  });
  if (!ws_response.ok) {
    throw new Error("Failed to send notification");
  }
};
