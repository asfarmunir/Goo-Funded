export const getUser = async () => {
  const response = await fetch("/api/user");
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};
