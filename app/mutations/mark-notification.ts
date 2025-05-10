export const markNotification = async (data: any) => {
  const response = await fetch("/api/notification/mark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to mark notification");
  }

  return await response.json();
};
