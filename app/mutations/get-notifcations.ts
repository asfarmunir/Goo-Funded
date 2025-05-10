export const getNotifications = async () => {
  const response = await fetch("/api/notification", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to get notifications");
  }

  return await response.json();
};
